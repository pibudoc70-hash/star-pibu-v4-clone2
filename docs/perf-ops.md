# 성능 운영 가이드

## 로컬 검증

```bash
pnpm build
pnpm start &    # 백그라운드 기동
sleep 5
pnpm perf:audit      # SW/캐시/압축 확인
pnpm perf:lighthouse # 성능 지표 실측 (Chromium 필요)
pnpm size            # 번들 크기 임계값 검사
```

## Chromium이 없을 때

샌드박스 등에서 `chrome-launcher`가 실패하면 Playwright의 Chromium을 사용합니다:

```bash
pnpm exec playwright install chromium
pnpm perf:lighthouse
```

## CI 인증

PR 생성 시 `.github/workflows/perf-guard.yml`이 자동 실행됩니다.

- `bundle-size` job: 항상 강제 (임계값 초과 시 CI 실패)
- `lighthouse` job: 초기 관측 기간에는 `continue-on-error: true`로 warning만 발생

## 번들 크기 감시

```bash
pnpm size         # 임계값 vs 실측
pnpm size:why     # 어떤 라이브러리가 청크에 기여했는지
```

### 임계값 (.size-limit.json)

| 청크 | 임계값 (gzip) |
|---|---|
| 홈 진입 (index) | 30 KB |
| vendor-react | 120 KB |
| vendor-trpc | 35 KB |
| vendor-radix | 40 KB |
| vendor-icons | 15 KB |
| **홈 초기 총합** | **230 KB** |

## Service Worker 캐시 갱신 원칙

정적 자산·이미지·폰트를 크게 변경하는 배포 후에는
반드시 `client/public/sw.js` 의 `CACHE_VERSION` 값을 갱신할 것.

형식: `v<번호>-<yyyy-mm-dd>`  
예: `v2-2026-07-24`

이 값이 바뀌면 사용자 브라우저의 옛 캐시 버킷(`static-v*`, `image-v*`, `html-v*`)이
`activate` 이벤트 시점에 자동 삭제되고, `controllerchange` 이벤트로 페이지가 자동 리로드됩니다.

```javascript
// client/public/sw.js
const CACHE_VERSION = "v2-2026-07-24"; // ← 배포마다 갱신
```

### 갱신이 필요한 경우

- 이미지·폰트·JS/CSS 파일 대규모 교체 또는 경로 변경
- CSP 정책 변경 (SW가 캐시한 응답에 영향)
- 스토리지 경로 변경 (`/manus-storage/` → `/api/storage/` 등)

### 갱신이 불필요한 경우

- 파일명 해시가 바뀌는 일반 코드 변경 (Vite가 자동 처리)
- 서버사이드 로직만 변경되는 경우

## 알려진 제한사항

- **headless 환경 SW 활성화 감지**: Playwright headless 모드에서 `navigator.serviceWorker.ready`가 지연될 수 있습니다. `waitForFunction` 폴링(최대 20초)으로 개선되었으나, 여전히 false negative가 발생할 수 있습니다. 실제 Chrome 브라우저 또는 GitHub Actions 러너에서는 정상입니다.
- **`lighthouse-audit.mjs`**: 시스템 Chromium이 필요합니다. Playwright 폴백이 없다면 `pnpm exec playwright install chromium` 실행 후 재시도하세요.

## GitHub Actions 시크릿 설정

`lighthouse` job이 정상 동작하려면 GitHub 저장소 Settings → Secrets에 다음을 등록하세요:

| 시크릿 이름 | 설명 |
|---|---|
| `DATABASE_URL_TEST` | CI용 테스트 DB URL (없으면 더미 값 사용) |
| `JWT_SECRET_TEST` | CI용 JWT 시크릿 (없으면 더미 값 사용) |

> 주의: 더미 값 사용 시 DB 연결이 실패하여 서버가 종료될 수 있습니다. Lighthouse 실측이 필요하면 실제 DB URL을 등록하세요.
