# Step 1 보고

## 1. 범위

첨부 지시의 변경된 방식에 따라 로컬 `/api/storage` 측정은 제외했습니다. 프로덕션 도메인의 실제 응답, `storageProxy.ts`의 `getCacheControl`, 해시 파일명 정규식, 그리고 서비스 워커 이미지 경로만 읽기 전용으로 조사했습니다. 애플리케이션 코드는 수정하지 않았습니다.

## 2. 프로덕션 헤더 실측

| 자산 | 확인 경로 | 상태 | Cache-Control | ETag | Content-Length | 판정 |
|---|---|---:|---|---|---:|---|
| 로고 | `/api/storage/star_logo_d0ae8bbf_8a004167.webp` | 200 | `public, max-age=31536000` | 존재 | 43,566 | 1년 TTL |
| 사용자 제공 히어로 키 | `/api/storage/hero-bg-new-desktop_2f8a8ccf_482fcfca.webp` | 415 | 미반환 | 존재 | 32 | 현재 사용 키가 아님 |
| 현재 히어로 | `/manus-storage/hero-background-0000_d3dee03d.webp` → `/api/storage/...` | 307 → 200 | 최종 응답 `max-age=31536000` | 존재 | 44,936 | 1년 TTL |

## 3. H1–H4 조사 결과

| 조사 | 결과 | 판정 |
|---|---|---|
| H1: 프로덕션 헤더 | 두 실제 사용 자산 모두 1년 TTL | 보고된 60초 TTL 재현 실패 |
| H2: 해시 정규식 | `01_5e3176cb_69bdbf43.png`, 로고, 현재 히어로 키 모두 매치 | 코드의 immutable 대상 판정 정상 |
| H3: 서비스 워커 | `handleImage`는 네트워크 응답 또는 Cache Storage의 복제 응답을 그대로 반환하며 헤더를 재작성하지 않음 | TTL 원인 아님 |
| H4: 전달 계층 | `star-pibu.com`과 `starpibu-qdq7tysk.manus.space` 모두 `server: cloudflare`, 동일 1년 TTL, `immutable` 지시자만 미노출 | 외부 전달 계층의 헤더 정규화 가능성. 규칙 접근 없이는 확정 불가 |

## 4. 코드 판정

`storageProxy.ts`는 해시 파일명에 대해 `public, max-age=31536000, immutable`을 생성합니다. 실제 응답은 `immutable`만 빠져 있으나 캐시 수명은 1년으로 유지됩니다. 따라서 코드 버그나 짧은 TTL은 확인되지 않았으며, 이번 Step에서는 `storageProxy.ts`와 테스트를 수정하지 않았습니다.

## 5. 동결 및 산출물

동결 대상 애플리케이션 파일 변경은 0건입니다. `dist/`와 `server/_generated/`은 커밋하지 않았습니다.

**Step 1 완료. 승인 대기.**
