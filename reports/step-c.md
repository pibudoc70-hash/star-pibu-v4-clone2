# Step C 보고

## 1. `git diff --stat` 원문

아래는 Step C 구현 파일을 스테이징한 뒤, 보고서 산출물 생성 전에 실행한 `git diff --cached --stat`의 원문입니다. `reports/step-c.md`와 `reports/step-c.diff`는 이 보고서를 위해 새로 생성한 파일이므로 이 출력에는 포함되지 않습니다.

```text
 client/src/index.css               |  1 +
 docs/event-preview-focal-points.md | 37 +++++++++++++++++++++++++++++++++++++
 todo.md                            |  1 +
 3 files changed, 39 insertions(+)
```

## 2. 게이트 결과

| 게이트 | 결과 | 확인 내용 |
|---|---:|---|
| Step C 전제 C-P1 | PASS | `client/src/index.css`에서 지정된 이벤트 ID 9건의 `[data-event-id]` 선택자를 확인했습니다. |
| Step C 전제 C-P2 | PASS | 9개 선택자 모두 `object-position` 값을 직접 지정함을 확인했습니다. |
| CSS 주석 단일 변경 | PASS | `index.css` diff는 지정 블록 바로 위의 문서 참조 주석 1줄 추가뿐입니다. 기존 규칙 본문, 초점값, 미디어 쿼리는 변경하지 않았습니다. |
| TypeScript 검사 | PASS | `pnpm check` 통과. |
| 린트 | PASS | `pnpm lint` 통과. 기존 경고 105건 외 신규 오류·경고는 추가하지 않았습니다. |
| 변경 파일 범위 | PASS | 구현 변경은 `docs/event-preview-focal-points.md`, `client/src/index.css`, 그리고 완료 이력용 `todo.md`에 한정했습니다. 보고서 파일 외 코드 변경은 없습니다. |
| 공백·생성물 검사 | PASS | `git diff --check` 통과. `dist/` 및 `server/_generated/` 변경·커밋은 없습니다. |

## 3. 문서화 내용

새 문서는 현재 9개 이벤트 ID와 각 `object-position` 값을 표로 연결합니다. 또한 신규 이벤트에 초점 규칙이 없을 때 기본 중앙 크롭이 적용되는 동작, DB 재시드 또는 ID 변경 뒤 CSS 선택자가 조용히 불일치하는 경로, 확인·재설정 절차를 설명합니다. 초점 값을 이벤트 데이터로 옮기는 장기 개선안은 DB·관리자 화면·마이그레이션을 함께 변경해야 하므로 **별도 승인 필요**로 명시했습니다.

## 4. 동결 범위 및 산출물

예약·상담·OTP·외부예약·공통 CTA·헤더/히어로/푸터·`EventTableMobile` 및 테스트·`Home.tsx` FAQ JSON-LD·시술 정적 데이터·이벤트 라우터 응답값·통증관리·패키지/락파일·관리자 화면·`dist/`·`server/_generated/`을 포함한 **모든 동결 범위의 diff는 0건**입니다. CSS 규칙 본문도 0건 변경했습니다.

| 산출물 | 경로 |
|---|---|
| 이벤트 초점 운영 문서 | `docs/event-preview-focal-points.md` |
| Step C 보고서 | `reports/step-c.md` |
| Step C 변경 패치 | `reports/step-c.diff` |

Step C 완료. 승인 대기.
