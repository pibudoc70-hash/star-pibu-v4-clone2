# 운영 성능 조언 검토 — Step 1

**측정일:** 2026-09-05  
**운영 대상:** <https://star-pibu.com/>  
**요청 헤더:** 모바일 Safari UA, `Accept-Encoding: br` 또는 `gzip`

## 판정 요약

첨부 조언의 **정적 자산 Brotli 미제공** 현상은 실제 운영 응답에서 재현되었다. 다만 이는 애플리케이션의 Express 정적 서빙보다 앞단의 `x-manus-proxy-mode: transparent-assets/1` 자산 프록시가 담당한다. 프로젝트 소스의 `serveStatic()`은 해당 경로를 제어하지 않으므로, 소스에서 사전 압축 파일을 만들거나 런타임 Brotli를 추가해도 현재 운영 자산 응답에는 적용되지 않는다. 따라서 이 제안은 **이번 배포에서 보류**한다.

반면 Pretendard의 `415 Unsupported storage content type`은 프로젝트가 제어하는 `/api/storage/*` 프록시의 MIME 검증에서 발생했다. 업스트림이 정상 WOFF2 바이트(`wOF2`)를 `application/octet-stream`으로 전달할 때만 `font/woff2`로 정규화하는 최소 보완은 안전하고 독립적으로 측정 가능하므로 **첫 번째 적용 대상**으로 선정했다.

| 항목 | 운영 실측 | 제어 가능성 | 이번 단계 판정 |
|---|---|---|---|
| 홈 HTML Brotli | `content-encoding: br`, Cloudflare `transparent/1` | CDN 계층 | 변경 불필요 |
| `/assets/*.js·css` Brotli 전용 요청 | `identity`, gzip 요청은 `gzip`, `transparent-assets/1` | 프로젝트 밖 프록시 | 보류 |
| Pretendard WOFF2 | `/api/storage/PretendardVariable_1ede78f7.woff2`가 `415` | 프로젝트 스토리지 프록시 | 적용 |
| Pretendard 개발 검증 | `200`, `Content-Type: font/woff2`, 2,057,688 B, `wOF2` 시그니처 | 프로젝트 스토리지 프록시 | 배포 후 운영 재확인 |

## 변경 안전 경계

이번 단계는 `imageProxyPolicy.ts`와 `storageProxy.ts`의 WOFF2 MIME 정규화만 변경한다. 확장자가 `.woff2`이고 업스트림 MIME이 `application/octet-stream`이며 첫 4바이트가 WOFF2 식별자 `wOF2`일 때만 허용한다. 다른 파일 형식, HTML 바이트, 이미지 MIME 정책, 캐시 키, URL, CSS 선언, 번들 청크, Hero, 예약·OTP·외부 예약 흐름은 변경하지 않는다.

## 다음 운영 검증

배포 후 아래 요청이 `200` 및 `Content-Type: font/woff2`를 반환하는지 확인한다.

```bash
curl -sS -D- -o /dev/null \
  https://star-pibu.com/api/storage/PretendardVariable_1ede78f7.woff2
```

정적 자산 Brotli는 플랫폼/프록시 설정 접근 권한이 확보된 경우에만 별도 단계로 재검토한다. 해당 시점에도 앱 소스의 `manualChunks`, modulepreload, KaTeX CSS, 기존 CSS 선언은 변경하지 않는다.

## 배포 후 운영 검증

자동 게시 버전 `bbd2d56e` 전파 후 `starpibu-qdq7tysk.manus.space`, `star-pibu.com`, `star-pibu.co.kr`에서 Pretendard 경로를 다시 요청했다. 세 도메인 모두 `200`, `Content-Type: font/woff2`, 2,057,688바이트, WOFF2 `wOF2` 시그니처를 반환했다. 따라서 최초 415는 정상 WOFF2를 잘못된 업스트림 MIME 때문에 거부하던 프록시 검증 경로였고, 이번 변경으로 복구되었다.

| 운영 검증 항목 | 결과 |
|---|---|
| `GET /api/storage/PretendardVariable_1ede78f7.woff2` | `200`, `font/woff2`, immutable 1년 캐시, WOFF2 시그니처 확인 |
| `/`, `/en`, `/ja`, `/doctors`, `/equipment3` | 모두 `200` |
| `/treatments/ulthera-prime`, `/events/1` | 모두 `200` |
| `Accept-Encoding: br`의 해시 JS | `identity` 응답 유지 |
| `Accept-Encoding: gzip`의 해시 JS | `gzip` 응답 유지 |

정적 자산의 Brotli 미제공은 여전히 `transparent-assets/1` 운영 프록시 계층의 동작이다. 이는 애플리케이션 코드로 안전하게 바꿀 수 있는 범위를 벗어나므로, 압축 관련 추가 변경은 하지 않았다. 이번 개선은 별도 WOFF2 요청의 415를 제거하는 범위이며, JS 번들 전송량 자체를 줄이는 변경은 아니다.
