# Google Ads·GA4 전환 추적 설정 절차

이 문서는 현재 GA4·Google Ads·Google Tag Manager 태그가 없는 스타피부과 사이트에 **전환 측정을 안전하게 도입하기 위한 계정 설정 순서**입니다. 사이트 구현은 필요한 식별자를 받은 뒤 별도 단계에서 진행합니다. 외부 네이버 예약·KakaoTalk·WeChat·전화 연결은 사용자가 실제 예약 또는 상담을 완료했음을 보장하지 않으므로, 초기에는 **클릭 전환**으로만 측정합니다.

## 1. 먼저 결정할 전환 기준

광고 자동 입찰에는 하나의 신뢰도 높은 대표 전환만 Primary로 사용해야 합니다. 현재 구조에서는 서버에서 상담 완료를 확정할 수 없으므로, 첫 도입에서는 모든 전환을 Secondary로 관찰한 뒤 데이터가 쌓이면 상담폼 성공과 같이 완료가 명확한 이벤트만 Primary로 승격하는 방식을 권장합니다.

| 이벤트 이름 | 사용자가 한 행동 | 초기 Google Ads 분류 | 비고 |
|---|---|---|---|
| `external_reservation_click` | 네이버 등 외부 예약으로 이동 | Secondary | 예약 완료가 아닌 outbound click |
| `phone_click` | 전화 연결 버튼 선택 | Secondary | 통화 완료·상담 성사와 구분 |
| `kakao_consultation_click` | Kakao 상담으로 이동 | Secondary | 외부 서비스 handoff |
| `wechat_consultation_click` | WeChat 상담으로 이동 | Secondary | zh·zh-TW 전용 가능 |
| `consultation_form_submit` | 유효성 검사를 통과한 내부 상담폼 제출 | 향후 Primary 후보 | 실제 성공 화면/응답이 있을 때만 발화 |

이벤트 파라미터에는 **이름, 전화번호, 건강 상태, 시술 관심사, 메시지 본문, 예약 일시, 해시된 연락처**를 보내지 않습니다. URL도 쿼리스트링의 개인정보를 제거한 경로만 기록합니다.

## 2. GA4 속성 만들기

Google Analytics에 로그인한 뒤 관리(Admin)에서 새 GA4 속성을 만들고, 데이터 스트림에 `https://star-pibu.com`을 추가합니다. 완료 화면에 표시되는 웹 측정 ID를 복사합니다. 값은 `G-XXXXXXXXXX` 형식입니다.

그 다음 실시간 보고서 또는 DebugView에서 페이지 조회가 보이는지 확인합니다. 아직 사이트 태그를 삽입하지 않았으므로 이 시점에는 데이터가 보이지 않는 것이 정상입니다. 사이트 반영 후에는 GA4 **관리 → Data display → Events**에서 실제 수신한 이벤트를 확인하고, 필요할 경우 해당 이벤트만 Key event로 표시합니다. 새 이벤트는 한 번 이상 수신돼야 목록에서 관리할 수 있습니다.[1]

## 3. Google Ads 계정과 GA4 연결

Google Ads에서 auto-tagging을 켜고, GA4 관리의 제품 연결(Google Ads links) 또는 Google Ads의 연결 계정 화면에서 동일한 Ads 계정을 GA4 속성과 연결합니다. 이 과정에는 Google Ads 관리자 권한과 GA4 Marketer 이상 권한이 필요합니다.[1]

연결이 완료되면 Google Ads **Goals → Conversions → Summary → Create conversion action**에서 GA4 속성과 이벤트를 선택해 가져올 수 있습니다. GA4 이벤트를 Ads 전환으로 만들 때 기존 데이터는 소급 반영되지 않으며, 가져온 전환 데이터가 Ads에 표시되기까지 최대 24시간이 걸릴 수 있습니다.[1]

## 4. Google Ads 웹사이트 전환 액션 만들기

GA4 가져오기와 함께 Google Ads native 태그를 병행하고 싶다면, Google Ads **Goals → Conversions → Summary**에서 웹사이트 전환 액션을 하나씩 만듭니다. 첫 도입에는 `external_reservation_click`과 `phone_click`을 **Secondary**로 두는 것이 안전합니다. 예약 완료 또는 실제 의료 상담 완료로 이름을 붙이지 마십시오.

각 전환 액션의 **Tag setup → Use Google Tag Manager** 화면에서 다음 두 값을 복사합니다.

| 필요한 값 | 형식 | 의미 |
|---|---|---|
| Google Ads Conversion ID | `AW-123456789` | Ads 계정 단위 식별자 |
| Conversion label | 영문·숫자 혼합 문자열 | 전환 액션별 식별자 |

Conversion ID는 Ads 계정마다 하나이고 Conversion label은 전환 액션마다 다릅니다.[2] 사이트에 내부 예약 완료 번호가 없는 현재 구조에서는 Transaction ID를 억지로 만들지 않습니다. 향후 서버가 성공 응답과 안정적인 고유 ID를 제공할 때만 중복 방지용 transaction ID를 추가합니다.[2]

## 5. 사이트 반영을 위해 보내주실 값

아래 값은 광고 태그 식별자이며 결제수단·로그인 비밀번호가 아닙니다. 채팅으로 전달하면 사이트에만 설정하고 공개 저장소나 화면에는 표시하지 않습니다.

| 전달 항목 | 예시 | 필수 여부 |
|---|---|---|
| GA4 측정 ID | `G-XXXXXXXXXX` | 필수 |
| Google Ads Conversion ID | `AW-123456789` | Ads 전환 측정 시 필수 |
| 외부 예약 클릭 전환 label | `AbCdEf...` | 선택한 경우 필수 |
| 전화 클릭 전환 label | `GhIjKl...` | 선택한 경우 필수 |
| Kakao/WeChat 클릭 전환 label | `MnOpQr...` | 선택한 경우 필수 |
| Primary로 둘 이벤트 | 위 표의 이벤트명 1개 또는 “모두 Secondary” | 필수 |

## 6. 반영 후 검증 순서

사이트 반영 뒤 Chrome Tag Assistant에서 `star-pibu.com`을 열어 GA4 Google tag와 Google Ads destination이 로드되는지 확인합니다. 이어서 테스트용으로 전화·외부 예약·상담 링크를 각각 한 번만 선택하고 GA4 DebugView에서 event name과 개인정보 없는 파라미터만 수신됐는지 확인합니다. Google Ads에서는 전환 진단 화면의 태그 상태를 확인하되, 보고 지연을 고려해 즉시 0건이라고 실패로 판단하지 않습니다.

GA4와 Ads가 서로 다른 집계·기여·보고 시간대를 사용하므로 수치가 완전히 같지 않을 수 있습니다. 추적이 정상인지의 1차 기준은 **한 사용자 동작당 한 번의 event**와 올바른 전환 분류이며, 실적 판단은 충분한 데이터가 축적된 뒤에 합니다.[1]

## References

[1]: https://support.google.com/google-ads/answer/2375435?hl=en "Create conversions from Google Analytics events in Google Ads — Google Ads Help"
[2]: https://support.google.com/tagmanager/answer/6105160?hl=en "Google Ads conversions — Tag Manager Help"
