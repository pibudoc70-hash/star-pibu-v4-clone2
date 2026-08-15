# P3 초기 번들·네트워크 기준선

## 운영 홈 초기 정적 자산

운영 HTML의 내부 CSS·JavaScript 참조 6개는 원본 전송량 합계 약 **716KB**였다. CSS는 약 261KB, React vendor는 약 193KB, tRPC vendor는 약 103KB, Radix vendor는 약 90KB, 앱 entry는 약 44KB, icon vendor는 약 26KB였다.

## 공개 홈 렌더링 확인

개발 홈에서 로고, 1차 메뉴, 카카오 상담·네이버 예약 CTA, 히어로를 확인했다. 헤더에서 사용되지 않던 `useAuth()`를 제거한 뒤 auth/oAuth 요청은 초기 리소스 목록에 없었다.

초기 tRPC 요청은 공지·장비·팝업 공개 데이터만 포함했다.

| endpoint |
|---|
| `notices.list` |
| `equipment3.list` |
| `popup.list` |

## build 기준

GitHub Actions run `31911279789`의 Production Build는 성공했다. 로컬 Vite build는 6,779개 모듈 변환 뒤 sandbox 메모리 `SIGTERM(143)`으로 중단돼, 번들 최종 산출물 평가는 CI build와 운영 네트워크 측정을 기준으로 수행한다.
