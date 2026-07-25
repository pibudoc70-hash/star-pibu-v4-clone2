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

/**
 * 의료진 이미지 프리로드.
 *
 * 최적화 원칙:
 * - 뷰포트에 맞는 소스만 프리로드 (모바일에서 데스크톱 PNG 를 받지 않도록)
 * - 첫 화면에 실제로 보이는 활성 원장(index 0) 1장만 프리로드
 *   → 나머지는 탭 전환 시 브라우저가 자연스럽게 로드
 * - 홈 진입 시 hero 이미지와의 대역폭 경쟁을 최소화
 */
function preloadDoctorImages() {
  if (typeof window === "undefined") return;

  const isMobileViewport = window.matchMedia("(max-width: 1023px)").matches;
  const first = doctors[0];
  if (!first) return;

  const src = isMobileViewport ? (first.mobileImage ?? first.image) : first.image;
  const img = new Image();
  img.src = src;
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

  // [FIX v10] applyFromDrTarget: sessionStorage(__star_dr_target) 기반 의사 탭 자동 선택 + 스크롤
  //
  // 근본 원인 분석:
  //   1) index.html에서 hash를 sessionStorage에 저장하고 URL에서 제거하면
  //      브라우저 기본 hash 스크롤은 차단됨
  //   2) 그러나 DoctorsSection은 lazy로 로드되므로 useDoctorViewModel이
  //      마운트될 때 이미 스크롤이 의사 섹션 근처로 이동해 있음
  //   3) 이 상태에서 SpecialEventSection의 이미지들이 lazy load되면
  //      레이아웃 시프트 발생 → 스크롤 위치가 밀림
  //
  // FIX v11 전략:
  //   - scrollTo(0,0) 제거: 브라우저 scroll restoration이 덮어쓰는 문제 해결
  //   - 즉시 스크롤 실행 (requestAnimationFrame 3회 후)
  //   - ResizeObserver로 레이아웃 변경 감지 시 재보정 (최대 2초)
  //     → 이미지 로드/데이터 fetch로 인한 레이아웃 시프트 대응
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

    // 2) 브라우저 scroll restoration 비활성화
    //    → 페이지 로드 시 이전 스크롤 위치 복원 방지
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }

    // 3) 요소 찾기 + 스크롤 실행
    const doScrollOnce = (el: HTMLElement) => {
      scrollToEl(el);
    };

    // 4) #dr-{slug} 요소가 DOM에 나타날 때까지 MutationObserver로 대기
    //    (DoctorsSection이 lazy 번들이라 스크롤 시점에 아직 마운트 안 되었을 수 있음)
    let rafId = 0;
    let roCleanup: (() => void) | null = null;
    let deadlineId: ReturnType<typeof setTimeout>;
    let mo: MutationObserver | null = null;

    const onElFound = (el: HTMLElement) => {
      // 요소 발견 즉시 스크롤
      doScrollOnce(el);

      // ResizeObserver로 레이아웃 변경 감지 시 재보정 (최대 2초)
      const deadline = Date.now() + 2000;
      const ro = new ResizeObserver(() => {
        if (Date.now() > deadline) {
          ro.disconnect();
          roCleanup = null;
          return;
        }
        const freshEl = document.getElementById(`dr-${slug}`);
        if (freshEl) doScrollOnce(freshEl);
      });

      // #doctors 섹션과 #events 섹션 높이 변화 관찰
      const doctorsSection = document.getElementById('doctors');
      const eventsSection = document.getElementById('events');
      if (doctorsSection) ro.observe(doctorsSection);
      if (eventsSection) ro.observe(eventsSection);
      ro.observe(document.body);

      roCleanup = () => ro.disconnect();
      deadlineId = setTimeout(() => {
        ro.disconnect();
        roCleanup = null;
      }, 2000);
    };

    const tryScroll = () => {
      const el = document.getElementById(`dr-${slug}`);
      if (el) {
        onElFound(el);
        return;
      }
      // 요소가 없으면 MutationObserver로 DOM 업데이트 대기 (최대 8초)
      mo = new MutationObserver(() => {
        const found = document.getElementById(`dr-${slug}`);
        if (found) {
          mo!.disconnect();
          mo = null;
          clearTimeout(deadlineId);
          onElFound(found);
        }
      });
      mo.observe(document.body, { childList: true, subtree: true });
      // 8초 후 포기
      deadlineId = setTimeout(() => {
        if (mo) { mo.disconnect(); mo = null; }
      }, 8000);
    };

    // requestAnimationFrame 3회 후 실행 (React 렌더 완료 보장)
    const raf3 = (cb: () => void) => {
      requestAnimationFrame(() => requestAnimationFrame(() => requestAnimationFrame(cb)));
    };
    raf3(tryScroll);

    return () => {
      cancelAnimationFrame(rafId);
      clearTimeout(deadlineId);
      if (mo) { mo.disconnect(); mo = null; }
      if (roCleanup) roCleanup();
    };
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
    // 앵커 요소(w-0 h-0)인 경우 부모 패널 높이를 사용
    // 앵커가 카드 상단에 위치하므로 카드 전체를 중앙에 오게 하려면 카드 높이 필요
    let elH = el.offsetHeight;
    if (elH === 0) {
      // 부모 tabpanel 또는 가장 가까운 실제 높이를 가진 조상 사용
      const panel = el.closest('[role="tabpanel"]') as HTMLElement | null;
      if (panel) {
        elH = panel.offsetHeight;
      } else {
        // fallback: #doctors 섹션 높이의 절반
        const doctorsSection = document.getElementById('doctors');
        elH = doctorsSection ? doctorsSection.offsetHeight / 2 : 400;
      }
    }
    // targetY = elAbsTop - viewportH/2 + elH/2 - headerH/2
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
