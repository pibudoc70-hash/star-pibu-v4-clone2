# 이벤트 이미지 초점값 데이터 이관 계획

## 1. 결정 요약

데스크톱 SPECIAL EVENT 미리보기의 이미지 초점값을 CSS의 이벤트 ID 선택자에서 `events` 테이블의 **선택적 데이터 필드**로 옮깁니다. 권장 필드명은 `imageObjectPosition`이며, 저장 형식은 CSS에 바로 전달 가능한 단일 문자열이 아니라 검증 가능한 두 숫자 좌표인 `imageFocalX`, `imageFocalY`로 분리하지 않고, 이번 범위에서는 **`imageObjectPosition` 단일 문자열**로 유지합니다. 이 선택은 현재 CSS의 `62% center` 등 9개 값을 손실 없이 이관하고, 현재 단일 이미지 URL 구조와도 잘 맞습니다.

> 최종 권장 계약: `imageObjectPosition VARCHAR(32) NULL`. 값은 `center`, `center center`, 또는 `0%`~`100%` 범위의 수평 백분율과 `center` 또는 수직 백분율로 구성된 CSS `object-position` 값만 허용합니다. 비어 있거나 `NULL`이면 기존 기본값인 `center center`를 사용합니다.

유효한 운영 값의 표준 형식은 `"62% center"`입니다. 모든 신규 값은 이 형식으로 정규화해 저장하고, 관리 화면은 수평 초점 0~100만 입력받도록 하여 수직 초점은 기본 `center`로 고정합니다. 이 방식은 입력 오류를 줄이고 향후 필요할 경우에만 세로 축 편집을 별도 승인으로 열어 둘 수 있습니다.

## 2. 현행 구조 확인 결과

| 계층 | 현재 상태 | 이관 시 영향 |
|---|---|---|
| DB | `drizzle/schema.ts`의 `events` 테이블은 `imageUrl`은 갖지만 초점 필드는 없습니다. 운영 DB의 `SHOW COLUMNS FROM events LIKE 'imageObjectPosition'`도 결과 0건이었습니다. | nullable 컬럼 1개를 추가해야 합니다. |
| 조회 | `server/db/events.ts`의 SPECIAL EVENT 조회는 `select().from(events)` 전체 행을 반환합니다. | 스키마 추가 후 별도 projection 수정 없이 공개 응답에 새 필드가 포함됩니다. |
| API | `server/routers/events.ts`의 `events.create`·`events.update`는 Zod 입력 스키마를 명시하고 관리자 전용으로 보호합니다. | create/update 입력에 검증된 선택 필드를 추가해야 합니다. |
| 관리자 | `AdminEventsTab.tsx`는 `EventFormState`를 사용해 이미지 업로드·이벤트 생성·수정을 처리합니다. | SPECIAL EVENT 편집 시 수평 초점 입력과 미리보기를 추가합니다. |
| 공개 UI | `SpecialEvent` 타입과 `EventCard`의 `OptimizedImage`가 미리보기 이미지를 렌더링합니다. `OptimizedImage`는 `style` prop을 전달합니다. | 새 필드를 타입에 추가하고 lead 미리보기 이미지에만 `objectPosition`을 적용합니다. |
| 캐시 | `events.special`은 2분 캐시를 사용하고, create/update는 `invalidateCache("events:")`를 호출합니다. | 초점 수정 후 같은 무효화 흐름을 유지합니다. |

현재 CSS에는 다음 9개 활성 SPECIAL EVENT에 ID 기반 초점값이 있습니다. 백필은 이 값을 변경 없이 새 컬럼에 복사해야 합니다.

| ID | 현재 제목 | 백필 `imageObjectPosition` |
|---:|---|---|
| 10560001 | 스타 메타셀 MCT | `62% center` |
| 300001 | 써마지 FLX | `46% center` |
| 10590001 | 벨로테로 리바이브 | `68% center` |
| 360002 | 리투오 이벤트 | `54% center` |
| 120002 | 눈밑지방재배치 | `59% center` |
| 330002 | 텐써마 리프팅 | `61% center` |
| 90001 | 세르프 리프팅 | `42% center` |
| 330001 | 온다 리프팅 | `47% center` |
| 360001 | 울쎄라피 프라임 | `55% center` |

## 3. 제안 스키마와 유효성 계약

`events` 테이블의 `imageUrl` 바로 다음에 다음 컬럼을 추가합니다. 초점값은 이미지 속성이고 모든 이벤트에 필요한 값은 아니므로 기본값을 강제하지 않는 nullable 컬럼이 안전합니다. 인덱스는 필요하지 않습니다. 이 값은 조회 필터·정렬 조건이 아니며, 행 단위 UI 렌더링에만 사용됩니다.

```ts
imageObjectPosition: varchar("imageObjectPosition", { length: 32 }),
```

서버 입력 검증은 문자열 전체를 허용하지 않고 아래 정책을 적용합니다. 이렇게 하면 CSS 문법 삽입을 막고 관리자 입력을 현재 요구에 맞게 제한할 수 있습니다.

| 항목 | 정책 |
|---|---|
| 허용 값 | `center`, `center center`, `0% center`~`100% center`, `0% 0%`~`100% 100%` |
| 공백·대소문자 | 서버에서 trim하고 소문자·단일 공백 형식으로 정규화 |
| 미입력 | `undefined`는 생성 시 DB 기본 `NULL`, 수정 시 기존 값 유지; 명시적 해제는 `null` 허용 |
| 금지 값 | CSS 함수, URL, 세미콜론, 임의 단위(px/rem), 음수·100 초과 비율, 32자 초과 |
| 공개 기본값 | `imageObjectPosition ?? "center center"` |

관리 UI는 CSS 문구 직접 입력 대신 `0`~`100` 범위의 정수형 **수평 초점** 필드와 “중앙으로 재설정” 버튼을 제공합니다. 저장 직전 `62`를 `"62% center"`로 변환하고, 기존 문자열은 입력용 숫자로 파싱합니다. 값이 없는 이벤트는 UI에서 “기본값: 중앙”으로 보이며 저장하지 않습니다. 수직 축 입력은 이번 범위에 포함하지 않습니다.

## 4. 무중단 단계별 이관

이관은 네 개의 독립된 체크포인트로 나눕니다. 스키마와 데이터를 먼저 추가해도 기존 CSS가 계속 적용되므로, 어떤 단계에서도 빈 초점값 때문에 이미지가 갑자기 달라지지 않습니다.

| 단계 | 변경 내용 | 배포 뒤 사용자 영향 | 통과 조건 | 롤백 |
|---|---|---|---|---|
| 0. 사전 점검 | 9개 ID·제목·현재 CSS 값·활성 상태를 읽기 전용으로 재확인하고 DB 백업/복구 지점을 확보합니다. | 없음 | 9개 행이 모두 존재하고 CSS 매핑과 일치 | 변경 없음 |
| 1. 스키마 확장 | Drizzle 스키마에 nullable `imageObjectPosition`을 추가하고 생성된 SQL을 검토한 뒤 적용합니다. | 없음 | 컬럼이 NULL 허용으로 생성되고 기존 행이 유지됨 | 앱은 이전 코드로 되돌릴 수 있으며 새 nullable 컬럼은 남아도 무해 |
| 2. 데이터 백필 | 대상 9개 ID에 현재 CSS 값을 한 번의 명시적 `UPDATE … CASE id`로 저장합니다. | 없음. CSS가 계속 우선 적용 | 9/9 값이 계획 표와 동일하며 다른 행 변경 0건 | 값을 `NULL`로 되돌리는 역방향 UPDATE |
| 3. 읽기·관리 UI 도입 | API·공개 lead 미리보기·관리 폼·테스트를 추가합니다. CSS ID 규칙은 **아직 유지**합니다. | UI 결과는 CSS fallback과 동일 | 필드가 응답·저장·수정·렌더링되고 기존 이벤트의 이미지가 동일하게 보임 | 직전 코드로 복귀하면 CSS가 계속 보장 |
| 4. CSS 제거 | 데이터 완전성·브라우저 QA 통과 후 9개 ID별 CSS override만 제거하고 기본 3:2/center 규칙은 유지합니다. | 초점값의 소유권이 DB로 전환 | 9개 + 신규 작성 이벤트의 데이터 초점이 화면에 반영됨 | CSS 블록만 직전 상태로 되돌림; DB 데이터는 보존 |

### 4.1 적용 SQL의 안전 원칙

실제 SQL은 생성된 Drizzle migration을 검토한 다음 스키마 변경용으로 적용합니다. 백필은 migration 생성만으로 처리하지 않고, Step 2 사전 점검에서 9개 행을 확인한 뒤 명시적인 범위 제한 SQL로 적용합니다. 개념상 업데이트는 아래와 같지만, 실행 시에는 재확인 결과와 함께 별도 승인을 받아야 합니다.

```sql
UPDATE events
SET imageObjectPosition = CASE id
  WHEN 10560001 THEN '62% center'
  WHEN 300001 THEN '46% center'
  WHEN 10590001 THEN '68% center'
  WHEN 360002 THEN '54% center'
  WHEN 120002 THEN '59% center'
  WHEN 330002 THEN '61% center'
  WHEN 90001 THEN '42% center'
  WHEN 330001 THEN '47% center'
  WHEN 360001 THEN '55% center'
END
WHERE id IN (10560001, 300001, 10590001, 360002, 120002, 330002, 90001, 330001, 360001)
  AND isSpecialEvent = '1';
```

즉시 이어서 같은 ID 집합을 조회하여 값·행 수·`isSpecialEvent` 상태를 대조합니다. 예상과 다른 ID, 제목 또는 행 수가 있으면 UPDATE를 실행하지 않고 중단합니다. 이 작업은 예약·OTP·상담 데이터와 관계가 없으며 해당 테이블을 읽거나 변경하지 않습니다.

## 5. 구현 파일별 계획

| 파일 | 예정 변경 | 보존 조건 |
|---|---|---|
| `drizzle/schema.ts` | `events.imageObjectPosition` nullable 정의 추가 | 기존 컬럼·인덱스·타입 이름을 변경하지 않음 |
| `drizzle/<generated>.sql` | Drizzle이 생성한 `ADD COLUMN` migration 검토·커밋 | 생성 SQL 외 수동 스키마 편집 금지 |
| `server/routers/events.ts` | create/update 입력에 공통 Zod 초점 스키마 추가, `null` 해제 경로 정의 | `adminProcedure`, 가격/제목/CTA/이미지 URL 계약, 캐시 무효화 유지 |
| `server/db/events.ts` | 일반적으로 변경 없음 | 전체 행 조회가 새 필드를 자동 반환하는지 테스트로 확인 |
| `client/src/hooks/useLocalizedEvent.ts` | `SpecialEvent`에 선택적 `imageObjectPosition?: string | null` 추가 | 텍스트 현지화·zh-TW fallback 무변경 |
| `client/src/components/events/EventCard.tsx` | desktop lead 미리보기 이미지에 검증된 필드 또는 `center center` 적용 | selector 접근성, mobile/compact/legacy 이미지 동작, `aria-live` 무변경 |
| `client/src/components/admin/AdminEventsTab.tsx` | SPECIAL EVENT 전용 수평 초점 입력·미리보기·해제 UI 추가 | 이벤트 생성·수정 권한·다국어 탭·이미지 업로드 흐름 유지 |
| `client/src/types/admin.ts` | `EventListItem`·`EventFormState`에 선택 필드 추가 | 기존 폼 필드 타입·가격 행 처리 무변경 |
| `client/src/index.css` | Step 4에서 9개 ID override만 제거 | 3:2 프레임, `object-fit`, 기본 center, 미디어 쿼리 유지 |
| 테스트 파일 | 라우터·폼·lead 렌더링·CSS 제거 이후 회귀 단언 추가 | 기존 테스트를 삭제하거나 약화하지 않음 |

## 6. 검증·보안·운영 게이트

각 구현 단계는 별도 커밋과 체크포인트를 만들고, 다음 게이트를 통과해야 다음 단계로 진행합니다.

| 분류 | 필수 검증 |
|---|---|
| DB | migration 전후 `SHOW COLUMNS`; 9개 대상의 ID·제목·초점값·`isSpecialEvent` 대조; 비대상 행 변경 0건 확인 |
| 서버 계약 | admin만 create/update 가능; 공개 `events.special` 응답에는 선택 필드가 반환됨; 허용 밖 값은 `BAD_REQUEST`; `null`은 명시적 초기화로만 처리 |
| 관리자 UI | 새 이벤트는 미입력 시 중앙 초점, 수평값 저장·재편집·해제, 업로드 이미지 미리보기와 저장 후 목록 갱신 확인 |
| 공개 UI | 1280px에서 9개 배너와 신규 이벤트를 연속 선택해 이미지 초점·3:2 프레임·fade·키보드 selector·제목 live region 확인 |
| 반응형 | 390px 모바일 EventTableMobile이 데이터 필드 추가에도 기존 외형·상세 전개를 유지하는지 확인 |
| 회귀 | 관련 Vitest 후 `pnpm test`, `pnpm check`, `pnpm lint`; 기존 경고와 신규 경고를 구분해 기록 |
| 릴리스 | Step 3에서 CSS와 DB 초점값의 시각 비교 캡처를 남기고, Step 4의 CSS 제거 전 명시적 승인 필요 |

관리자 입력값은 서버에서 다시 검증합니다. 클라이언트의 `min`/`max` 제약만 신뢰하지 않으며, CSS 값 전체를 임의로 입력받지 않습니다. 공개 API는 기존처럼 조회 전용이고, 초점값 쓰기는 기존 `adminProcedure` 권한 안에만 둡니다. 이 방식은 CSS 속성 주입과 비관리자 수정 경로를 함께 방지합니다.

## 7. 승인 요청 범위

이 문서는 **계획만** 기록합니다. 아직 스키마·SQL·DB 데이터·이벤트 라우터·관리자 화면·공개 렌더링·CSS 규칙을 변경하지 않았습니다. 실제 착수 전에는 다음 네 단계를 각각 승인해 주세요.

1. nullable 컬럼 추가와 migration 검토·적용
2. 확인된 9개 행만 대상으로 한 초점값 백필
3. API·관리자 편집·공개 lead 렌더링 도입 및 CSS fallback 병행
4. 시각 회귀 확인 후 ID 기반 CSS override 제거

특히 Step 4는 최종 시각 검증 전에는 수행하지 않습니다. 현재 CSS fallback을 유지하는 동안에는 DB 초점값이 비어 있거나 코드 배포가 지연되어도 기존의 데스크톱 크롭 결과가 보존됩니다.
