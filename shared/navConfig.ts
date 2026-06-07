/**
 * shared/navConfig.ts
 * 네비게이션 관련 공유 타입 정의.
 * client/ 의존성 없이 server/shared 계층에서 재사용 가능.
 *
 * NAV-P2-1: useHeaderState.ts에서 분리하여 단일 책임 원칙 준수
 */

/**
 * 언어 선택 옵션 타입.
 * lang은 string으로 선언하여 shared 계층이 client/lib/i18n.types.ts에 의존하지 않도록 한다.
 */
export interface LangOption {
  lang: string;
  label: string;
  flag: string;
}

/**
 * 네비게이션 아이템 타입.
 * sectionId가 null이면 href로 직접 이동, 아니면 해당 섹션으로 스크롤.
 */
export interface NavItem {
  label: string;
  href: string;
  sectionId: string | null;
}
