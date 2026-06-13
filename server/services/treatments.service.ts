/**
 * treatments.service.ts — 시술 관리 유스케이스 비즈니스 로직
 *
 * 책임:
 *  - 시술 생성 payload 기본값 보정 (normalizeTreatmentCreatePayload)
 *  - 이미지 업로드 유스케이스 (uploadTreatmentImage)
 *    base64 파싱 → 크기 검증 → 파일명 생성 → storage 업로드
 *
 * 의존 방향: service → storage
 * 라우터는 zod 검증 + service 호출 + TRPCError 변환만 담당한다.
 */
import { storagePut } from "../storage";
import { DomainError, DOMAIN_ERROR_CODES } from "../shared/errors";

// ─── 상수 ─────────────────────────────────────────────────────────────────────
const MAX_IMAGE_BYTES = 5 * 1024 * 1024; // 5 MB

// ─── 시술 생성 payload 정규화 ─────────────────────────────────────────────────
export interface TreatmentCreateInput {
  categoryId: string;
  name: string;
  nameEn: string;
  nameJa?: string;
  nameZh?: string;
  desc: string;
  descEn?: string;
  descJa?: string;
  descZh?: string;
  time: string;
  timeEn?: string;
  timeJa?: string;
  timeZh?: string;
  recovery: string;
  recoveryEn?: string;
  recoveryJa?: string;
  recoveryZh?: string;
  slug?: string;
  slugEn?: string;
  slugJa?: string;
  slugZh?: string;
  badge?: string;
  badgeEn?: string;
  badgeJa?: string;
  badgeZh?: string;
  badgeColor?: string;
  image?: string;
  images?: string;
  imgBg?: string;
  cardBannerImage?: string;
  detail?: string;
  detailEn?: string;
  detailJa?: string;
  detailZh?: string;
  caution?: string;
  cautionEn?: string;
  cautionJa?: string;
  cautionZh?: string;
  sessions?: string;
  sessionsEn?: string;
  sessionsJa?: string;
  sessionsZh?: string;
  effect?: string;
  effectEn?: string;
  effectJa?: string;
  effectZh?: string;
  related?: string;
  steps?: string;
  youtubeUrl?: string;
  modalImage?: string;
  best?: "0" | "1";
  section?: "v1" | "v2";
  sortOrder?: number;
  isActive?: "0" | "1";
}

/**
 * 시술 생성 payload 기본값 보정.
 * 도메인 규칙: badge 미입력 시 빈 문자열, badgeColor 미입력 시 기본 색상,
 * best/section/sortOrder/isActive 미입력 시 안전한 기본값 적용.
 */
export function normalizeTreatmentCreatePayload(input: TreatmentCreateInput) {
  return {
    ...input,
    badge: input.badge ?? "",
    badgeColor: input.badgeColor ?? "#4A6FA5",
    images: input.images ?? "",
    imgBg: input.imgBg ?? "",
    sessions: input.sessions ?? "",
    related: input.related ?? "",
    steps: input.steps ?? "",
    best: input.best ?? "0",
    section: input.section ?? "v1",
    sortOrder: input.sortOrder ?? 0,
    isActive: input.isActive ?? "1",
  } as const;
}

// ─── 이미지 업로드 유스케이스 ─────────────────────────────────────────────────
export interface UploadTreatmentImageInput {
  base64: string;
  fileName: string;
  mimeType?: string;
}

/**
 * 시술 이미지 업로드 유스케이스.
 *
 * 흐름: base64 파싱 → 크기 검증(5MB) → 고유 파일명 생성 → storage 업로드
 */
export async function uploadTreatmentImage(
  input: UploadTreatmentImageInput,
): Promise<{ url: string }> {
  const mimeType = input.mimeType ?? "image/jpeg";

  const base64Data = input.base64.includes(",")
    ? input.base64.split(",")[1]
    : input.base64;
  const buffer = Buffer.from(base64Data, "base64");

  if (buffer.length > MAX_IMAGE_BYTES) {
    throw new DomainError(
      DOMAIN_ERROR_CODES.VALIDATION,
      "이미지 파일 크기는 5MB 이하여야 합니다.",
    );
  }

  const ext = mimeType.split("/")[1]?.replace("jpeg", "jpg") ?? "jpg";
  const uniqueName = `treatments/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  const { url } = await storagePut(uniqueName, buffer, mimeType);
  return { url };
}
