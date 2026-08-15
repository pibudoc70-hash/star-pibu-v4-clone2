# 네이버·카카오 외부 예약 전환 검증 기록

## 실제 개발 화면 확인

| 경로 | 확인한 예약 CTA | 확인된 목적지 | 결과 |
| --- | --- | --- | --- |
| `/?verify=external-booking` | 헤더·히어로의 `네이버 예약` | `https://booking.naver.com/booking/13/bizes/209080` | 정상 렌더링 및 외부 HTTPS 링크 확인 |
| `/ja?verify=external-booking` | 헤더·히어로의 `NAVER予約` | `https://booking.naver.com/booking/13/bizes/209080` | 기존 LINE 예약 목적지 대신 공통 네이버 외부 예약 링크 확인 |
| `/zh?verify=external-booking` | 헤더·히어로의 `NAVER预约` | `https://booking.naver.com/booking/13/bizes/209080` | 정상 렌더링 및 외부 HTTPS 링크 확인 |
| `/zh-tw?verify=external-booking` | 헤더·히어로의 `NAVER預約` | `https://booking.naver.com/booking/13/bizes/209080` | 기존 LINE 예약 목적지 대신 공통 네이버 외부 예약 링크 확인 |

카카오와 OTOMO·WeChat·LINE은 다국어 상담 채널로만 유지했다. 일반 고객의 **예약 CTA**는 공통 네이버 예약 URL을 사용하도록 변경했으며, 내부 예약·OTP 코드, 예약 API·서비스·DB·관리 기능과 기존 경로 헬퍼는 보존했다.

## 외국인 안내 확인

`/ja/foreign-guide`에서 `NAVERで予約` CTA가 공통 네이버 예약 URL로 표시되는 것을 확인했다. `/en/foreign-guide`의 첫 요청은 개발 서버 재시작 직후 일시적으로 빈 화면이었으나, 서버·콘솔 상태 확인 후 재시도에서는 정상 렌더링됐다. 영어 화면의 `Naver Booking` 헤더·히어로 CTA와 `Book through Naver Booking or call us.` 안내, `Online Booking (Naver)` CTA가 모두 공통 네이버 예약 URL을 사용한다.

최종 재확인에서 일본어 외국인 안내의 예약 단계와 하단 안내는 `NAVER予約`을 예약 채널로, `OTOMO`를 일본어 상담·통역 채널로 분리해 표시했다. `/zh-tw` 헤더·히어로는 `NAVER預約`과 공통 네이버 예약 URL을 정상 렌더링했으며, 번체 주소 복사 버튼도 기존의 `複製地址` 표기를 유지했다.
