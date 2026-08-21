# PC EVENT First-Click Anchor QA

**확인일:** 2026-08-21  
**범위:** desktop homepage의 상단 `EVENT` 메뉴와 lazy-loaded Special Event section

## 재현과 원인

수정 전 새 homepage 진입 직후 상단 `EVENT` 메뉴를 한 번 클릭하면 viewport가 초기 hero 위치에 남았다. `#events` id는 `SpecialEventSection`이 mount된 뒤에만 존재하지만, 해당 `DeferredMount`에는 `anchorSelectors={["#events"]}`가 없었다. 따라서 `useAnchorScroll`의 `star-pibu:mount-anchor` 요청이 section mount로 연결되지 않았고, 이후 viewport observer가 우연히 mount한 뒤에야 재클릭이 동작했다.

## 수정과 확인

Home의 Special Event `DeferredMount`에 `anchorSelectors={["#events"]}`를 추가했다. 새 homepage 진입 뒤 첫 상단 `EVENT` 클릭에서 lazy section이 mount되고, viewport가 `SPECIAL EVENT` heading과 card grid 위치로 바로 이동하는 것을 desktop browser에서 확인했다. 이벤트 data, 가격, card detail, CTA, header 구현은 변경하지 않았다.

## Header first-click 확대 확인

PC Header의 시술·장비소개, 피부과전문의, 피부과 소개, 오시는 길은 모두 해당 standalone route로 이동하므로 deferred anchor mount와 무관하다. Header More의 시설 안내만 `#facility` hash를 사용하며, Facility section도 lazy mount되는 구조였다. 해당 `DeferredMount`에 `anchorSelectors={["#facility"]}`를 추가한 뒤, 새 desktop homepage에서 More → 시설 안내를 첫 클릭해 Facility section의 heading·gallery controls가 렌더되고 해당 위치로 이동하는 것을 확인했다.

실제 Chromium debug session에서 각 항목마다 새 homepage target을 열어 Header button을 첫 클릭한 결과, 시술·장비소개는 `/equipment3`, 피부과전문의는 `/doctors`, 피부과 소개는 `/about`, 오시는 길은 `/directions`으로 모두 전환됐다. 이 four menu는 route navigation이므로 lazy section mount selector를 추가하지 않았다.
