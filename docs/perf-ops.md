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

## Service Worker 캐시 갱신

배포 후 사용자 브라우저에서 오래된 캐시가 남으면:

1. `client/public/sw.js` 안의 `CACHE_VERSION` 값 변경 후 재배포
2. 클라이언트 접속 시 자동으로 구 버전 캐시가 삭제됩니다

```javascript
// sw.js
const CACHE_VERSION = "v1-2026-07"; // ← 이 값을 변경
```

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
