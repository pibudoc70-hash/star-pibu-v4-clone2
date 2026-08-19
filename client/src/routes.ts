/**
 * routes.ts — 라우트 설정 모듈
 *
 * App.tsx에서 라우트 선언을 분리한다.
 * 다국어 라우트는 withLangPrefixes() 헬퍼로 4개 언어 경로를 한 번에 생성한다.
 *
 * PAGE LIFECYCLE POLICY
 * Only pages registered here are live and canonical.
 * Files in client/src/pages/ that are NOT listed below are:
 *   - dormant  : kept for potential activation after route and Header review (Facilities, Events)
 *   - legacy   : superseded implementation retained only for compatibility or migration
 *   - candidate: dev-only or removal candidate (ComponentShowcase, MyPage)
 * To activate a dormant page, add its entry here and update Header.tsx.
 * Do NOT connect page files to routes without reviewing their status comment.
 */

import { lazy } from "react";

// ─── Lazy imports ─────────────────────────────────────────────────────────────

export const pages = {
  NotFound:            () => import("@/pages/NotFound"),
  Notice:              () => import("@/pages/Notice"),
  NoticeDetail:        () => import("@/pages/NoticeDetail"),
  NoticeEdit:          () => import("@/pages/NoticeEdit"),
  LandingEN:          () => import("@/pages/LandingEN"),
  LandingJA:          () => import("@/pages/LandingJA"),
  LandingZH:          () => import("@/pages/LandingZH"),
  LandingZHTW:        () => import("@/pages/LandingZHTW"),
  EventDetail:        () => import("@/pages/EventDetail"),
  TreatmentRedirect:  () => import("@/pages/TreatmentRedirect"),
  TreatmentPage:      () => import("@/pages/TreatmentPage"),
  Equipment2:         () => import("@/pages/Equipment2"),
  Equipment2Detail:   () => import("@/pages/Equipment2Detail"),
  Equipment3:         () => import("@/pages/Equipment3"),
  Equipment3Detail:   () => import("@/pages/Equipment3Detail"),
  About:              () => import("@/pages/About"),
  ForeignGuide:       () => import("@/pages/ForeignGuide"),
  ForeignPriceList:   () => import("@/pages/ForeignPriceList"),
  Research:           () => import("@/pages/Research"),
  Privacy:            () => import("@/pages/Privacy"),
  NonCoveredGuide:    () => import("@/pages/NonCoveredGuide"),
  MyReservations:     () => import("@/pages/MyReservations"),
  AdminDashboard:     () => import("@/pages/AdminDashboard"),
  AdminNotices:       () => import("@/pages/AdminNotices"),
  AdminYouTube:       () => import("@/pages/AdminYouTube"),
  AdminEquipment2New: () => import("@/pages/AdminEquipment2New"),
  AdminEquipment2Edit:() => import("@/pages/AdminEquipment2Edit"),
  AdminEquipment3:    () => import("@/pages/AdminEquipment3"),
  AdminEquipment3New: () => import("@/pages/AdminEquipment3New"),
  AdminEquipment3Edit:() => import("@/pages/AdminEquipment3Edit"),
  Doctors:            () => import("@/pages/Doctors"),
  Directions:         () => import("@/pages/Directions"),
} as const;

// ─── Lazy components ──────────────────────────────────────────────────────────

export const ForeignGuide       = lazy(pages.ForeignGuide);
export const ForeignPriceList   = lazy(pages.ForeignPriceList);
export const NotFound           = lazy(pages.NotFound);
export const Notice             = lazy(pages.Notice);
export const NoticeDetail       = lazy(pages.NoticeDetail);
export const NoticeEdit         = lazy(pages.NoticeEdit);
export const EventDetail        = lazy(pages.EventDetail);
export const TreatmentRedirect  = lazy(pages.TreatmentRedirect);
export const AdminDashboard     = lazy(pages.AdminDashboard);
export const AdminNotices       = lazy(pages.AdminNotices);
export const AdminYouTube       = lazy(pages.AdminYouTube);
export const MyReservations     = lazy(pages.MyReservations);
export const Privacy            = lazy(pages.Privacy);
export const NonCoveredGuide    = lazy(pages.NonCoveredGuide);
export const About              = lazy(pages.About);
export const Equipment2         = lazy(pages.Equipment2);
export const Equipment2Detail   = lazy(pages.Equipment2Detail);
export const AdminEquipment2New = lazy(pages.AdminEquipment2New);
export const AdminEquipment2Edit= lazy(pages.AdminEquipment2Edit);
export const Equipment3         = lazy(pages.Equipment3);
export const Equipment3Detail   = lazy(pages.Equipment3Detail);
export const AdminEquipment3    = lazy(pages.AdminEquipment3);
export const AdminEquipment3New = lazy(pages.AdminEquipment3New);
export const AdminEquipment3Edit= lazy(pages.AdminEquipment3Edit);
export const TreatmentPage      = lazy(pages.TreatmentPage);
export const LandingEN          = lazy(pages.LandingEN);
export const LandingJA          = lazy(pages.LandingJA);
export const LandingZH          = lazy(pages.LandingZH);
export const LandingZHTW        = lazy(pages.LandingZHTW);
export const Research           = lazy(pages.Research);
export const Doctors            = lazy(pages.Doctors);
export const Directions         = lazy(pages.Directions);

// ─── 다국어 경로 헬퍼 ─────────────────────────────────────────────────────────

/**
 * 단일 경로 패턴을 5개 언어 접두사(/, /en/, /ja/, /zh/, /zh-tw/)로 확장한다.
 * 예: withLangPrefixes("about") → ["/about", "/en/about", "/ja/about", "/zh/about", "/zh-tw/about"]
 */
export function withLangPrefixes(path: string): string[] {
  return [`/${path}`, `/en/${path}`, `/ja/${path}`, `/zh/${path}`, `/zh-tw/${path}`];
}

/**
 * 다국어 라우트 그룹 정의.
 * path: 언어 접두사 없는 경로 (예: "treatments/:slug")
 * component: lazy 컴포넌트
 */
export interface LangRoute {
  path: string;
  component: ReturnType<typeof lazy>;
}

export const LANG_ROUTES: LangRoute[] = [
  { path: "treatments/:slug",  component: TreatmentPage },
  { path: "equipment3/:slug",  component: Equipment3Detail },
  { path: "equipment3",        component: Equipment3 },
  { path: "about",             component: About },
  { path: "foreign-guide",     component: ForeignGuide },
  { path: "research",          component: Research },
  { path: "privacy",           component: Privacy },
  { path: "non-covered",       component: NonCoveredGuide },
  { path: "doctors",           component: Doctors },
];
