# Step 4 보고

## 1. 조사 범위

`vite.config.ts`의 `manualChunks`와 modulepreload 제거 플러그인, 홈 import 체인, 그리고 일회성 프로덕션 빌드 산출물만 조사했습니다. 소스 파일은 변경하지 않았고 `dist/` 및 `server/_generated/`은 커밋 대상에서 제외했습니다.

## 2. 원인 조사

| 항목 | 결과 |
|---|---|
| `manualChunks`의 `vendor-heavy` | xlsx·KaTeX 의존성을 `vendor-heavy` 청크로 분리 |
| 홈 정적 import | xlsx·KaTeX·Streamdown 없음 |
| Streamdown 사용 | `AIChatBox`, `Equipment2Detail`, `Equipment3Detail`에서 모두 lazy import |
| xlsx 의존성 | 현재 `pnpm why` 결과에 설치 경로 없음 |
| KaTeX 의존성 | Mermaid·micromark math·rehype-katex·Streamdown 경유 |
| preload 제거 | `stripUnusedModulePreloadPlugin`이 `vendor-heavy`를 이미 제거 |

## 3. 빌드 산출물 검증

메모리 상한을 적용한 프로덕션 빌드가 성공했습니다. `dist/public/index.html`의 `vendor-heavy` modulepreload 일치 수는 0건입니다.

| 구분 | Raw bytes | gzip bytes | 홈 modulepreload |
|---|---:|---:|---|
| vendor-heavy | 291,298 | 87,286 | 아니오 |
| vendor-react | 395,685 | 116,414 | 예 |
| vendor-icons | 26,059 | 8,491 | 예 |
| vendor-radix | 90,154 | 30,792 | 예 |
| vendor-trpc | 105,531 | 29,538 | 예 |
| 홈 preload 합계 | 617,429 | 185,235 | vendor-heavy 제외 |

## 4. 판정

Lighthouse 보고의 vendor-heavy 크기는 실제 생성 청크를 반영하지만, 현재 빌드에서 이 청크는 홈 초기 HTML에 preload되지 않습니다. 따라서 이번 조사에서 수정할 코드 버그나 안전한 추가 개선 지점은 확인되지 않았습니다. 이미 존재하는 preload 제거 설정을 중복 변경하면 관리자·상세 페이지 지연 로딩 그래프에 불필요한 위험을 줄 수 있으므로 소스 수정 없이 종료합니다.

## 5. 동결 및 산출물

동결 대상 파일, 예약·OTP·외부 채널, `EventTableMobile*`, `Home.tsx`, `vite.config.ts`, import 파일, `dist/`, `server/_generated/`은 변경하지 않았습니다.

**Step 4 완료. 승인 대기.**
