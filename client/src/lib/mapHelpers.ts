/**
 * mapHelpers.ts — Google Maps 관련 순수 헬퍼 함수
 *
 * [R19-P1-6] buildMarkerPinElement를 ContactSection.tsx에서 분리
 * - 의존 방향 역전 해소: useClinicMap → ContactSection (역방향) → lib/mapHelpers (정방향)
 * - 순수 함수 → 단위 테스트 가능
 */

/**
 * buildMarkerPinElement — Google Maps AdvancedMarkerElement의 content prop에 전달할 DOM 요소 생성
 *
 * @param params.clinicName 클리닉 이름
 * @param params.addrLine1 주소 1줄
 * @param params.addrLine2 주소 2줄
 * @param params.exitLabel 출구 안내 텍스트
 * @param params.walkLabel 도보 시간 텍스트
 * @param params.onToggle 팝업 토글 콜백 (React state 연동용)
 */
export function buildMarkerPinElement(params: {
  clinicName: string;
  addrLine1: string;
  addrLine2: string;
  exitLabel: string;
  walkLabel: string;
  onToggle?: (visible: boolean) => void;
}): HTMLElement {
  const { clinicName, addrLine1, addrLine2, exitLabel, walkLabel, onToggle } = params;
  const pinEl = document.createElement("div");
  pinEl.style.cssText = "position:relative;cursor:pointer;";
  pinEl.innerHTML = `
    <div style="width:44px;height:44px;background:#4A6FA5;border-radius:50% 50% 50% 0;transform:rotate(-45deg);display:flex;align-items:center;justify-content:center;box-shadow:0 2px 8px rgba(0,0,0,0.3);">
      <span style="transform:rotate(45deg);font-size:20px;">⭐</span>
    </div>
    <div id="star-map-popup" style="display:block;position:absolute;bottom:52px;left:50%;transform:translateX(-50%);background:white;border-radius:10px;box-shadow:0 4px 16px rgba(0,0,0,0.15);padding:10px 12px;min-width:200px;white-space:nowrap;z-index:9999;">
      <div style="display:flex;align-items:center;gap:6px;margin-bottom:6px;">
        <span style="font-size:16px;">⭐</span>
        <strong style="color:#1F2937;font-size:14px;">${clinicName}</strong>
      </div>
      <p style="color:#6B7280;font-size:12px;margin:0 0 4px;">${addrLine1}</p>
      <p style="color:#6B7280;font-size:12px;margin:0 0 8px;">${addrLine2}</p>
      <div style="display:flex;gap:6px;">
        <span style="background:#EEF7F7;color:#4A6FA5;font-size:11px;padding:2px 8px;border-radius:20px;font-weight:600;">${exitLabel}</span>
        <span style="background:#FFF3E0;color:#E65100;font-size:11px;padding:2px 8px;border-radius:20px;font-weight:600;">${walkLabel}</span>
      </div>
      <div style="position:absolute;bottom:-8px;left:50%;transform:translateX(-50%);width:0;height:0;border-left:8px solid transparent;border-right:8px solid transparent;border-top:8px solid white;"></div>
    </div>
  `;
  // CONTACT-P3-A: popupVisible을 클로저 변수로 유지하되 onToggle 콜백으로 React state와 연동
  let popupVisible = true;
  pinEl.addEventListener("click", () => {
    const popup = pinEl.querySelector("#star-map-popup") as HTMLElement | null;
    if (popup) {
      popupVisible = !popupVisible;
      popup.style.display = popupVisible ? "block" : "none";
      onToggle?.(popupVisible);
    }
  });
  return pinEl;
}
