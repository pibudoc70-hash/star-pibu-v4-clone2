# 다국어 schema 브라우저 검증 기록

## 영문 홈

- 확인 URL: `https://3000-im20a3q5seumfbg9vncc0-87625d81.sg1.manus.computer/en`
- 초기 로딩 화면 해제 후 제목이 `Star Dermatology Busan | Ultherapy · Thermage FLX · Under-Eye Fat Repositioning | Seomyeon`으로 렌더링되었습니다.
- 영문 navigation, hero, 진료 안내, 장비 카드, 통증 관리 FAQ가 실제 화면에 렌더링되었습니다.
- 브라우저가 저장한 HTML: `/home/ubuntu/browser_html/3000-im20a3q5seumfbg9vncc0-87625d81_sg1_manus_computer_en_1787916596332.html`

이 기록은 client-side locale route가 로딩 실패 없이 정상 렌더링됨을 확인하기 위한 것입니다. JSON-LD 객체 수와 `inLanguage` 값은 원시 프리렌더 생성기·공유 builder 단위 테스트 및 후속 DOM 검사로 별도 확인합니다.

## 일문·번체 중국어 홈

| 경로 | 실제 제목 | 렌더링 확인 |
|---|---|---|
| `/ja` | `釜山スター皮膚科 | ウルセラ・サーマジFLX・目の下の脂肪再配置 | 西面クリニック` | 일본어 navigation, hero, FAQ, 장비/시설 메뉴와 로컬 안내가 로딩 완료 뒤 표시됨 |
| `/zh-tw` | `釜山STAR皮膚科 | 超聲刀·熱瑪吉FLX·眼袋脂肪重置 | 西面診所` | 번체 navigation, hero, FAQ, 장비/시설 메뉴, 주소 복사 버튼 `複製地址`가 로딩 완료 뒤 표시됨 |

두 경로 모두 초기 로더 해제 후 client-side route가 정상 동작했습니다. 원시 프리렌더의 BCP 47 `inLanguage` 값과 누락 번역의 한국어 폴백은 home/equipment prerender 및 shared schema helper 회귀 테스트로 별도 검증합니다.

## 개발 서버 재시작 후 영문 schema 확인

개발 서버를 재시작해 이전 HMR의 오래된 named-export 오류를 제거한 뒤 `/en`을 재확인했습니다. 초기 로더가 해제된 후 영문 title, navigation, FAQ, 장비 목록이 정상적으로 표시됐고, 하이드레이션 DOM의 `WebSite` JSON-LD는 `name: "Star Dermatology Busan"`, `description: "Star Dermatology is a dermatologist-led clinic in Seomyeon, Busan, providing individualized dermatologic care plans."`, `inLanguage: "en"`으로 확인됐습니다.
