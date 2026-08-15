import { useEffect } from "react";
import { useAnchorScroll } from "@/hooks/useAnchorScroll";

/** 홈 진입 시 sessionStorage 기반 섹션·의료진 스크롤 복원을 담당한다. */
export function useHomeInitialScrollRestore() {
  const { scrollToSelector } = useAnchorScroll();

  useEffect(() => {
    const forceScrollTop = sessionStorage.getItem("__star_force_scroll_top");
    if (forceScrollTop) {
      sessionStorage.removeItem("__star_force_scroll_top");
      history.scrollRestoration = "manual";
      window.scrollTo({ top: 0, behavior: "instant" });
      return;
    }

    const storedTab = sessionStorage.getItem("__star_doctor_tab");
    if (storedTab) {
      sessionStorage.removeItem("__star_doctor_tab");
      const slugMap = ["cho", "woo", "lee"];
      const slug = slugMap[parseInt(storedTab, 10)];
      if (slug) {
        sessionStorage.setItem("__star_dr_target", `dr-${slug}`);
        return;
      }
    }

    if (window.location.hash) {
      history.replaceState(null, "", window.location.pathname + window.location.search);
      window.scrollTo({ top: 0, behavior: "instant" });
    }

    if (sessionStorage.getItem("__star_dr_target")) return;

    const sessionTarget = sessionStorage.getItem("__star_scroll_to");
    if (!sessionTarget) {
      window.scrollTo({ top: 0, behavior: "instant" });
      return;
    }
    sessionStorage.removeItem("__star_scroll_to");
    scrollToSelector(`#${sessionTarget}`, { block: "start" });
  }, []); // 마운트 시 1회만 실행
}
