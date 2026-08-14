# 외부 예약 링크 읽기 전용 감사 기록

> 감사 범위: 예약·OTP 코드, DB, API, 관리자 예약 기능을 변경하지 않고 외부 네이버·카카오 링크의 공개 진입점과 보안 속성만 확인한다.

## 홈 공개 화면 확인

- 대상 URL: 개발 미리보기 홈 `/`.
- 상단 헤더와 Hero의 사용자 예약 CTA는 네이버 예약 `https://booking.naver.com/booking/13/bizes/209080`, 카카오톡 상담 `https://pf.kakao.com/_HNyGC`로 렌더링됐다.
- 브라우저 DOM에서 확인한 모든 홈 네이버·카카오 외부 링크는 `target="_blank"` 및 `rel="noopener noreferrer"`를 보유했다.
- Hero에는 네이버 예약·카카오톡 상담·전화 링크가 함께 노출되며, 자체 예약 폼은 초기 화면에 표시되지 않았다.

## 코드 인벤토리에서 확인된 경계

- 공통 상수 `client/src/lib/constants.ts`는 네이버 예약 URL `bizes/209080`, 카카오 채널 URL을 중앙 관리한다.
- `client/src/hooks/useChatConfig.ts`는 위 공통 상수와 별도로 네이버 예약 URL 두 개(`bizes/209080`, `bizes/1122956`)를 보유한다.
- `client/src/pages/TreatmentDetail.tsx`, `client/src/pages/ForeignGuide.tsx`는 `bizes/1122956`를 직접 사용한다. 이는 외부 예약 URL의 단일 원본 원칙과 어긋날 수 있는 감사 후보이나, 이번 읽기 전용 단계에서는 수정하지 않는다.
- `client/src/lib/reservationPath.ts`와 일부 사용자 화면은 `/#reservation` 형태의 내부 예약 섹션 경로를 참조한다. 예약·OTP 비변경 조건에 따라 이 경로·연관 컴포넌트·API는 수정하지 않는다.

## 상세·외국어 안내 공개 화면 확인

- 개발 미리보기의 울쎄라피 프라임 상세는 상단과 본문 CTA 모두 네이버 `bizes/209080`·카카오 `/_HNyGC`로 연결됐으며, DOM에서 확인한 외부 링크는 모두 새 창과 `noopener noreferrer`를 사용했다. 상세 본문에 자체 예약 폼은 노출되지 않았다.
- 개발 미리보기의 `/foreign-guide`도 상단 헤더에는 네이버 `bizes/209080`·카카오 `/_HNyGC`를 사용하고 각각 새 창 링크로 렌더링했다.
- 그러나 `/foreign-guide`의 하단 `Online Booking (Naver)`는 직접 URL `bizes/1122956`를 사용한다. 상단과 다른 네이버 비즈니스 ID이므로 실제 목적지 일치 여부를 운영자가 확인해야 한다.
- 같은 외국어 안내 페이지는 예약 보조 채널로 카카오톡·전화 외에 OTOMO Busan·다국어 통역 안내를 노출한다. 이 표기는 상담·통역 안내이며, 내부 예약 폼 노출과는 구분해 기록한다.
