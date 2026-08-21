# PC EVENT First-Click Anchor QA

**확인일:** 2026-08-21  
**범위:** desktop homepage의 상단 `EVENT` 메뉴와 lazy-loaded Special Event section

## 재현과 원인

수정 전 새 homepage 진입 직후 상단 `EVENT` 메뉴를 한 번 클릭하면 viewport가 초기 hero 위치에 남았다. `#events` id는 `SpecialEventSection`이 mount된 뒤에만 존재하지만, 해당 `DeferredMount`에는 `anchorSelectors={["#events"]}`가 없었다. 따라서 `useAnchorScroll`의 `star-pibu:mount-anchor` 요청이 section mount로 연결되지 않았고, 이후 viewport observer가 우연히 mount한 뒤에야 재클릭이 동작했다.

## 수정과 확인

Home의 Special Event `DeferredMount`에 `anchorSelectors={["#events"]}`를 추가했다. 새 homepage 진입 뒤 첫 상단 `EVENT` 클릭에서 lazy section이 mount되고, viewport가 `SPECIAL EVENT` heading과 card grid 위치로 바로 이동하는 것을 desktop browser에서 확인했다. 이벤트 data, 가격, card detail, CTA, header 구현은 변경하지 않았다.
