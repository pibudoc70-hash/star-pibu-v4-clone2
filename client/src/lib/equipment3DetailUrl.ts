/** 활성 Equipment3 항목의 실제 slug와 카테고리로 상세 페이지 URL을 생성한다. */
export function buildEquipment3DetailUrl(slug: string, category: string | null | undefined): string {
  const path = `/equipment3/${encodeURIComponent(slug)}`;
  const normalizedCategory = category?.trim();

  if (!normalizedCategory) return path;

  return `${path}?${new URLSearchParams({ tab: normalizedCategory }).toString()}`;
}
