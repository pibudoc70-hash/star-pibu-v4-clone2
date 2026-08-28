# Step 0 보고

## 1. 기준 리비전 및 변경 상태

현재 HEAD는 `6dc4535`입니다. 기준선 확인 전 작업 트리에는 `todo.md`만 수정되어 있었으며, 이는 첨부 제안의 작업 추적 항목을 추가한 결과입니다. 기능 코드·동결 파일은 수정하지 않았습니다.

```text
 M todo.md
```

## 2. 전제 게이트 결과

| 항목 | 결과 | 확인값 |
|---|---|---|
| P1 SpecialEventSection | 통과 | 270줄, `grid-cols-3` 0회, `md:grid-cols-12` 존재, 기존 오타 aria-label 3회, `PainManagementGuide` import와 정상 렌더 1회 |
| P2 EventCard | 통과 | 493줄, 4개 `EventCardVariant` 존재, VAT 포함 pill 존재 |
| P3 storageProxy | 통과 | `getCacheControl` 존재, 해시 파일용 immutable 정책 존재 |
| P4 Vite 청크 | 통과 | `manualChunks`, `vendor-heavy` 존재 |
| P5 히어로 이미지 | 통과 | `HERO_BACKGROUND_IMAGE`가 WebP를 가리킴 |
| P6 동결 테스트 | 통과 | `SpecialEventSection.desktopLayout.test.tsx`, `EventCard.variant.test.ts` 존재 |
| git status clean | 실패 | `todo.md` 수정 1건 존재 |
| 프로덕션 빌드 | 통과 | `pnpm build` 완료 |
| 프로덕션 서버 시작 | 통과 | 포트 3101에서 실행 확인 |
| 지정 이미지 헤더 기준선 | 기록 필요 | 두 URL 모두 `415 Unsupported Media Type`, `Content-Length: 32`, `ETag`만 반환되어 `Cache-Control`을 측정할 수 없음 |
| 지정 테스트 게이트 | 실패 | `Home.fouc.test.ts` 1건이 이전 문구 `스타피부과를 준비하고 있습니다`를 기대하나 현재 소스는 `콘텐츠를 불러오는 중입니다`를 제공 |

## 3. 기준선 이미지 헤더

| URL | HTTP 상태 | Cache-Control | ETag | Content-Length |
|---|---:|---|---|---:|
| `/api/storage/star_logo_d0ae8bbf.webp` | 415 | 미반환 | `W/"20-BPcn5jskppnEJIjA0C1mqUrfumI"` | 32 |
| `/api/storage/01_5e3176cb_69bdbf43.png` | 415 | 미반환 | `W/"20-BPcn5jskppnEJIjA0C1mqUrfumI"` | 32 |

## 4. 동결 위반 확인

동결 대상 파일·영역은 변경하지 않았습니다. 다만 R0/R3에 따라, `git status clean`과 기준선 테스트 게이트가 모두 충족되지 않았으므로 Step 1–4 구현은 진행하지 않았습니다.

## 5. 필요한 결정

`Home.fouc.test.ts`의 이전 초기 로딩 문구 단언을 현재 정상 로딩 문구로 갱신하는 것은 첨부 제안의 Step 0 “코드 변경 0건” 조건과 충돌합니다. 또한 `/api/storage`의 415 응답은 TTL 불일치 조사 전에 별도로 원인을 판별해야 합니다. 두 전제 불일치의 처리 방침을 승인받기 전에는 다음 단계를 시작하지 않습니다.

**Step 0 중단. 전제 불일치 확인. 승인 대기.**
