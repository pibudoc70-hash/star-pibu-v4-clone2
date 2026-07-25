/**
 * useDoctorViewModel
 *
 * [R13-P1-2] DoctorsSection.tsx에서 뷰모델 로직 분리
 * [R15-P0-3] WAI-ARIA tablist 키보드 네비게이션 핸들러 추가
 * [R18-P0-3] 터치 스와이프 로직 → useDoctorSwipe 훅으로 분리
 *
 * 책임:
 * - 활성 의사 선택 상태 (activeDoctor)
 * - 학력·경력 펼침/접기 상태 (expandedCredentials)
 * - 이미지 로드 상태 (imagesLoaded)
 * - 터치 스와이프 핸들러 (useDoctorSwipe 위임)
 * - WAI-ARIA tablist 키보드 네비게이션 (handleTabKeyDown)
 * - i18n locale merge → mergedDoctors (id 기반, [R11-A] 패턴 유지)
 * - 현재 선택된 의사 뷰 데이터 (doctor)
 *
 * DoctorsSection 컴포넌트는 이 훅의 반환값을 받아 렌더링만 담당한다.
 */
import { useState, useEffect, useMemo, useCallback } from "react";
import React from "react";
import { doctors, type Doctor } from "@/lib/doctors-data";
import type { I18nContent } from "@/lib/i18n.types";
import { useDoctorSwipe } from "@/hooks/useDoctorSwipe";

// ── 타입 ─────────────────────────────────────────────────────────────────────

/** locale merge 후 최종 렌더링에 사용되는 의사 뷰 타입 */
export interface DoctorViewModel extends Doctor {
  /** i18n에서 병합된 badge 텍스트 */
  badge: string;
}

export interface UseDoctorViewModelReturn {
  /** locale merge된 의사 목록 */
  mergedDoctors: DoctorViewModel[];
  /** 현재 선택된 의사 뷰 데이터 */
  doctor: DoctorViewModel;
  /** 현재 선택된 의사 인덱스 */
  activeDoctor: number;
  /** 학력·경력 펼침 상태 */
  expandedCredentials: boolean;
  /** 이미지 로드 완료 여부 (id → boolean) */
  imagesLoaded: Record<number, boolean>;
  /** 의사 탭 선택 핸들러 */
  handleDoctorSelect: (i: number) => void;
  /** 이미지 로드 완료 핸들러 */
  handleImageLoad: (id: number) => void;
  /** 학력·경력 펼침/접기 토글 */
  toggleCredentials: () => void;
  /** 터치 시작 핸들러 */
  handleTouchStart: (e: React.TouchEvent) => void;
  /** 터치 종료 핸들러 (스와이프 감지) */
  handleTouchEnd: (e: React.TouchEvent) => void;
  /**
   * WAI-ARIA tablist 키보드 네비게이션 핸들러
   * - 세로 방향(vertical): ArrowUp/ArrowDown
   * - 가로 방향(horizontal): ArrowLeft/ArrowRight
   * - Home: 첫 번째 탭, End: 마지막 탭
   * - 방향키 입력 시 기본 스크롤 동작 방지 (preventDefault)
   */
  handleTabKeyDown: (e: React.KeyboardEvent, orientation?: "vertical" | "horizontal") => void;
}

// ── 이미지 프리로드 ──────────────────────────────────────────────────────────

function preloadDoctorImages() {
  doctors.forEach((d) => {
    const src = d.image;
    const img = new Image();
    img.src = src;
  });
}

// ── 훅 ───────────────────────────────────────────────────────────────────────

/**
 * @param t - useLang()에서 받은 번역 객체
 */
export function useDoctorViewModel(t: I18nContent): UseDoctorViewModelReturn {
  // 마운트 시 sessionStorage에서 의사 탭 인덱스 읽기 (#dr-{slug} 직접 접근 지원)
  const [activeDoctor, setActiveDoctor] = useState(() => {
    const stored = sessionStorage.getItem("__star_doctor_tab");
    if (stored !== null) {
      const idx = parseInt(stored, 10);
      if (!isNaN(idx) && idx >= 0 && idx < doctors.length) return idx;
    }
    return 0;
  });
  const [expandedCredentials, setExpandedCredentials] = useState(false);
  const [imagesLoaded, setImagesLoaded] = useState<Record<number, boolean>>({});

  // 이미지 프리로드 (마운트 시 1회) + sessionStorage 정리
  useEffect(() => {
    preloadDoctorImages();
    sessionStorage.removeItem("__star_doctor_tab");
  }, []);

  // [FIX v9] applyFromDrTarget: sessionStorage(__star_dr_target) 기반 의사 탭 자동 선택 + 스크롤
  //
  // 이전 방식의 근본 문제:
  //   URL에 #dr-* hash가 남아있으면 브라우저가 기본 hash 스크롤을 먼저 실행하고,
  //   이후 SpecialEventSection 이미지 로드 시 레이아웃 시프트로 위치가 밀려짐
  //   → 첫 번째 클릭에서 이벤트 섹션으로 튀어지는 버그
  //
  // FIX v9 전략:
  //   index.html에서 #dr-* hash를 sessionStorage에 저장 후 URL에서 즉시 제거
  //   → 브라우저 기본 hash 스크롤 완전 차단
  //   → useDoctorViewModel 마운트 후 sessionStorage에서 읽어 폴링 시작
  //   → 레이아웃 안정화 후 정확한 위치로 스크롤
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // sessionStorage에서 대상 slug 읽기 (index.html에서 저장한 값)
    const stored = sessionStorage.getItem('__star_dr_target');
    if (!stored) return;
    sessionStorage.removeItem('__star_dr_target');

    const m = stored.match(/^dr-(cho|woo|lee)$/);
    if (!m) return;
    const slug = m[1];
    const idx = doctors.findIndex((d) => d.slug === slug);
    if (idx < 0) return;

    // 1) 탭 상태 먼저 설정
    setActiveDoctor(idx);
    setExpandedCredentials(false);

    // 2) 레이아웃 안정화 폴링
    //    - 80ms 간격으로 #dr-{slug} 요소의 절대 위치 감시
    //    - 연속 4회 2px 이내 변화 시 레이아웃 안정으로 판단
    //    - 안정 후 window.scrollTo('instant')로 정확히 이동 (레이아웃 시프트 추가 발생 불가능)
    const STABLE_COUNT = 4;
    const POLL_MS = 80;
    const MAX_MS = 4000;
    let stableCount = 0;
    let lastTop = -1;
    let elapsed = 0;

    const poll = setInterval(() => {
      elapsed += POLL_MS;

      const el = document.getElementById(`dr-${slug}`);
      if (!el) {
        // 요소가 아직 마운트되지 않음 (레이지 로딩 중) — 대기
        if (elapsed > MAX_MS) clearInterval(poll);
        return;
      }

      const currentTop = el.getBoundingClientRect().top + window.scrollY;
      if (Math.abs(currentTop - lastTop) < 2) {
        stableCount++;
      } else {
        stableCount = 0;
      }
      lastTop = currentTop;

      if (stableCount >= STABLE_COUNT || elapsed > MAX_MS) {
        clearInterval(poll);
        scrollToEl(el);
      }
    }, POLL_MS);

    return () => clearInterval(poll);
  }, []);

  // hashchange 이벤트: 사용자가 주소상에 직접 hash 입력 시 실시간 처리
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const onHashChange = () => {
      const hash = window.location.hash;
      const m = hash.match(/^#dr-(cho|woo|lee)$/);
      if (!m) return;
      const slug = m[1];
      const idx = doctors.findIndex((d) => d.slug === slug);
      if (idx < 0) return;

      // hash URL에서 제거 (브라우저 기본 스크롤 차단)
      history.replaceState(null, '', window.location.pathname + window.location.search);

      setActiveDoctor(idx);
      setExpandedCredentials(false);

      // 레이아웃이 이미 안정된 상태이리므로 짧은 폴링으로 충분
      let attempts = 0;
      const iv = setInterval(() => {
        const el = document.getElementById(`dr-${slug}`);
        if (el) {
          clearInterval(iv);
          scrollToEl(el);
        } else if (++attempts > 20) {
          clearInterval(iv);
        }
      }, 50);
    };

    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  // 스크롤 헬퍼: 헤더 높이 보정 + 븷포트 중앙 정렬
  // (instant 사용: 레이아웃 안정 후 호출되므로 smooth 불필요)
  function scrollToEl(el: HTMLElement) {
    const header = document.querySelector('header[role="banner"]') as HTMLElement | null;
    const headerH = header ? header.offsetHeight : 64;
    const elRect = el.getBoundingClientRect();
    const elAbsTop = elRect.top + window.scrollY;
    const viewportH = window.innerHeight;
    // 요소를 븷포트 중앙에 놓으려면:
    // targetY = elAbsTop - viewportH/2 + elH/2 - headerH/2
    const elH = Math.max(el.offsetHeight, 1);
    const targetY = elAbsTop - (viewportH / 2) + (elH / 2) - (headerH / 2);
    window.scrollTo({ top: Math.max(0, targetY), behavior: 'instant' });
  }

  // 의사 전환 시 학력·경력 접기 초기화
  const handleDoctorSelect = useCallback((i: number) => {
    setActiveDoctor(i);
    setExpandedCredentials(false);
  }, []);

  const handleImageLoad = useCallback((id: number) => {
    setImagesLoaded((prev) => ({ ...prev, [id]: true }));
  }, []);

  const toggleCredentials = useCallback(() => {
    setExpandedCredentials((prev) => !prev);
  }, []);

  // [R18-P0-3] 터치 스와이프 로직 → useDoctorSwipe 훅으로 위임
  const { handleTouchStart, handleTouchEnd } = useDoctorSwipe({
    onSwipeLeft: () => {
      setActiveDoctor((prev) => (prev + 1) % doctors.length);
      setExpandedCredentials(false);
    },
    onSwipeRight: () => {
      setActiveDoctor((prev) => (prev - 1 + doctors.length) % doctors.length);
      setExpandedCredentials(false);
    },
  });

  /**
   * [R15-P0-3] WAI-ARIA tablist 키보드 네비게이션
   * ARIA Authoring Practices Guide (APG) Tab Pattern 준수:
   * - vertical tablist: ArrowUp(이전), ArrowDown(다음)
   * - horizontal tablist: ArrowLeft(이전), ArrowRight(다음)
   * - Home: 첫 번째 탭 포커스, End: 마지막 탭 포커스
   */
  const handleTabKeyDown = useCallback(
    (e: React.KeyboardEvent, orientation: "vertical" | "horizontal" = "vertical") => {
      const total = doctors.length;
      let next: number | null = null;

      if (orientation === "vertical") {
        if (e.key === "ArrowUp") {
          e.preventDefault();
          next = (activeDoctor - 1 + total) % total;
        } else if (e.key === "ArrowDown") {
          e.preventDefault();
          next = (activeDoctor + 1) % total;
        }
      } else {
        if (e.key === "ArrowLeft") {
          e.preventDefault();
          next = (activeDoctor - 1 + total) % total;
        } else if (e.key === "ArrowRight") {
          e.preventDefault();
          next = (activeDoctor + 1) % total;
        }
      }

      if (e.key === "Home") {
        e.preventDefault();
        next = 0;
      } else if (e.key === "End") {
        e.preventDefault();
        next = total - 1;
      }

      if (next !== null) {
        handleDoctorSelect(next);
        // 포커스를 새 탭 버튼으로 이동 (DOM에서 tablist 내 tab 버튼 탐색)
        const tablist = (e.currentTarget as HTMLElement).closest("[role='tablist']");
        if (tablist) {
          const tabs = tablist.querySelectorAll<HTMLElement>("[role='tab']");
          tabs[next]?.focus();
        }
      }
    },
    [activeDoctor, handleDoctorSelect],
  );

  const badgeLabel = t.doctors.badge;

  // [D항목] index 기반 merge → id 기반 find로 전환 (의사 순서 변경 시 불일치 방지)
  // [R11-A] locale.careers 텍스트만 교체, icon/label은 원본 credentials에서 유지
  const mergedDoctors = useMemo<DoctorViewModel[]>(() => {
    return doctors.map((d) => {
      const locale = t.doctors.list.find((item: { id: number }) => item.id === d.id);
      return {
        ...d,
        name: locale?.name ?? d.name,
        title: locale?.title ?? d.title,
        intro: Array.isArray(locale?.intro)
          ? locale.intro
          : locale?.intro
          ? [locale.intro]
          : d.intro,
        credentials: locale?.careers
          ? d.credentials.map((cred, i) => ({
              ...cred,
              text: locale.careers![i] ?? cred.text,
            }))
          : d.credentials,
        specialties: locale?.specialties ?? d.specialties,
        badge: badgeLabel,
      };
    });
  }, [t.doctors, badgeLabel]);

  const doctor = mergedDoctors[activeDoctor];

  return {
    mergedDoctors,
    doctor,
    activeDoctor,
    expandedCredentials,
    imagesLoaded,
    handleDoctorSelect,
    handleImageLoad,
    toggleCredentials,
    handleTouchStart,
    handleTouchEnd,
    handleTabKeyDown,
  };
}
