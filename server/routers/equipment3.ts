/**
 * equipment3 tRPC 라우터
 * - 공개: list (활성 목록), bySlug (단건 조회)
 * - 관리자: all (전체 목록), create, update, delete, reorder, uploadImage
 */
import { adminProcedure, publicProcedure, protectedProcedure, router } from "../_core/trpc";
import { invokeLLM } from "../_core/llm";
import {
  getEquipment3List,
  getEquipment3All,
  getEquipment3BySlug,
  getEquipment3ById,
  createEquipment3Item,
  updateEquipment3Item,
  deleteEquipment3Item,
  reorderEquipment3Items,
} from "../db";
import { z } from "zod/v4";
import { storagePut } from "../storage";
import { TRPCError } from "@trpc/server";

// 공통 시술 필드 스키마 (생성/수정 공용)
const itemFieldsSchema = z.object({
  slug: z.string().min(1).max(200).optional(),
  name: z.string().min(1).max(200).optional(),
  nameEn: z.string().max(200).optional(),
  nameJa: z.string().max(200).optional(),
  nameZh: z.string().max(200).optional(),
  category: z.string().max(100).optional(),
  categoryEn: z.string().max(100).optional(),
  categoryJa: z.string().max(100).optional(),
  categoryZh: z.string().max(100).optional(),
  desc: z.string().optional(),
  descEn: z.string().optional(),
  descJa: z.string().optional(),
  descZh: z.string().optional(),
  detail: z.string().optional(),
  detailEn: z.string().optional(),
  detailJa: z.string().optional(),
  detailZh: z.string().optional(),
  effect: z.string().optional(),
  effectEn: z.string().optional(),
  effectJa: z.string().optional(),
  effectZh: z.string().optional(),
  caution: z.string().optional(),
  cautionEn: z.string().optional(),
  cautionJa: z.string().optional(),
  cautionZh: z.string().optional(),
  sessions: z.string().max(200).optional(),
  sessionsEn: z.string().max(200).optional(),
  sessionsJa: z.string().max(200).optional(),
  sessionsZh: z.string().max(200).optional(),
  time: z.string().max(50).optional(),
  timeEn: z.string().max(50).optional(),
  timeJa: z.string().max(50).optional(),
  timeZh: z.string().max(50).optional(),
  recovery: z.string().max(50).optional(),
  recoveryEn: z.string().max(50).optional(),
  recoveryJa: z.string().max(50).optional(),
  recoveryZh: z.string().max(50).optional(),
  imageUrl: z.string().optional(),
  images: z.string().optional(),       // JSON 배열 문자열
  youtubeUrl: z.string().optional(),
  modalImage: z.string().optional(),
  badge: z.string().max(100).optional(),
  badgeColor: z.string().max(20).optional(),
  sortOrder: z.number().optional(),
  isActive: z.enum(["0", "1"]).optional(),
  isBest: z.enum(["0", "1"]).optional(),
});

export const equipment3Router = router({
  // ── 공개: 활성 목록 ──────────────────────────────────────────────────────────
  list: publicProcedure.query(async () => {
    return getEquipment3List();
  }),

  // ── 공개: slug로 단건 조회 ────────────────────────────────────────────────────
  bySlug: publicProcedure
    .input(z.object({ slug: z.string().min(1).max(200) }))
    .query(async ({ input }) => {
      return getEquipment3BySlug(input.slug);
    }),

  // ── 공개: 전체 목록 (비활성 포함) ──────────────────────────────────────────
  all: publicProcedure.query(async () => {
    return getEquipment3All();
  }),

  // ── 관리자: id로 단건 조회 ────────────────────────────────────────────────────
  byId: adminProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      return getEquipment3ById(input.id);
    }),

  // ── 관리자: 생성 ──────────────────────────────────────────────────────────────
  create: adminProcedure
    .input(
      itemFieldsSchema.extend({
        name: z.string().min(1).max(200),
        slug: z.string().min(1).max(200),
      })
    )
    .mutation(async ({ input }) => {
      const { id } = await createEquipment3Item({
        slug: input.slug,
        name: input.name,
        nameEn: input.nameEn ?? "",
        nameJa: input.nameJa ?? "",
        nameZh: input.nameZh ?? "",
        category: input.category ?? "",
        categoryEn: input.categoryEn ?? "",
        categoryJa: input.categoryJa ?? "",
        categoryZh: input.categoryZh ?? "",
        desc: input.desc ?? "",
        descEn: input.descEn ?? "",
        descJa: input.descJa ?? "",
        descZh: input.descZh ?? "",
        detail: input.detail ?? "",
        detailEn: input.detailEn ?? "",
        detailJa: input.detailJa ?? "",
        detailZh: input.detailZh ?? "",
        effect: input.effect ?? "",
        effectEn: input.effectEn ?? "",
        effectJa: input.effectJa ?? "",
        effectZh: input.effectZh ?? "",
        caution: input.caution ?? "",
        cautionEn: input.cautionEn ?? "",
        cautionJa: input.cautionJa ?? "",
        cautionZh: input.cautionZh ?? "",
        sessions: input.sessions ?? "",
        sessionsEn: input.sessionsEn ?? "",
        sessionsJa: input.sessionsJa ?? "",
        sessionsZh: input.sessionsZh ?? "",
        time: input.time ?? "",
        timeEn: input.timeEn ?? "",
        timeJa: input.timeJa ?? "",
        timeZh: input.timeZh ?? "",
        recovery: input.recovery ?? "",
        recoveryEn: input.recoveryEn ?? "",
        recoveryJa: input.recoveryJa ?? "",
        recoveryZh: input.recoveryZh ?? "",
        imageUrl: input.imageUrl ?? null,
        images: input.images ?? "[]",
        youtubeUrl: input.youtubeUrl ?? null,
        modalImage: input.modalImage ?? null,
        badge: input.badge ?? "",
        badgeColor: input.badgeColor ?? "#4A6FA5",
        sortOrder: input.sortOrder ?? 0,
        isActive: input.isActive ?? "1",
        isBest: input.isBest ?? "0",
      });
      return { success: true, id };
    }),

  // ── 관리자: 수정 ──────────────────────────────────────────────────────────────
  update: adminProcedure
    .input(itemFieldsSchema.extend({ id: z.number() }))
    .mutation(async ({ input }) => {
      const { id, ...data } = input;
      await updateEquipment3Item(id, data);
      return { success: true };
    }),

  // ── 관리자: 삭제 ──────────────────────────────────────────────────────────────
  delete: adminProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      await deleteEquipment3Item(input.id);
      return { success: true };
    }),

  // ── 관리자: 순서 변경 ─────────────────────────────────────────────────────────
  reorder: adminProcedure
    .input(
      z.object({
        items: z.array(z.object({ id: z.number(), sortOrder: z.number() })),
      })
    )
    .mutation(async ({ input }) => {
      await reorderEquipment3Items(input.items);
      return { success: true };
    }),

  // ── 관리자: 자동 번역 (LLM) ───────────────────────────────────────────────
  autoTranslate: adminProcedure
    .input(
      z.object({
        name: z.string().optional(),
        category: z.string().optional(),
        desc: z.string().optional(),
        detail: z.string().optional(),
        effect: z.string().optional(),
        caution: z.string().optional(),
        sessions: z.string().optional(),
        time: z.string().optional(),
        recovery: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      // 빈 문자열 제외하고 번역할 필드만 추출
      const fieldsToTranslate: Record<string, string> = {};
      const fieldKeys = ["name", "category", "desc", "detail", "effect", "caution", "sessions", "time", "recovery"] as const;
      for (const key of fieldKeys) {
        const val = input[key];
        if (val && val.trim()) fieldsToTranslate[key] = val.trim();
      }
      if (Object.keys(fieldsToTranslate).length === 0) {
        return { translations: { en: {}, ja: {}, zh: {} } };
      }

      const prompt = `You are a professional medical/dermatology translator for a Korean dermatology clinic (Star Dermatology, Busan, Korea).
Translate the following Korean fields into English (en), Japanese (ja), and Chinese Simplified (zh).
Return ONLY valid JSON with this exact structure:
{
  "en": { "fieldName": "translated string", ... },
  "ja": { "fieldName": "translated string", ... },
  "zh": { "fieldName": "translated string", ... }
}
Rules:
- Keep medical brand names as-is (e.g. Ultherapy, Thermage FLX, AccuREP, HIFU, SMAS, FDA, RF)
- Use accurate dermatology/medical terminology
- Keep the same tone and length as the original
- For "time" and "sessions" fields, keep numeric values and units accurate

Fields to translate:
${JSON.stringify(fieldsToTranslate, null, 2)}`;

      const response = await invokeLLM({
        messages: [
          { role: "system", content: "You are a professional medical translator. Respond with valid JSON only, no markdown, no explanation." },
          { role: "user", content: prompt },
        ],
        response_format: {
          type: "json_schema",
          json_schema: {
            name: "translations",
            strict: true,
            schema: {
              type: "object",
              properties: {
                en: { type: "object", additionalProperties: { type: "string" } },
                ja: { type: "object", additionalProperties: { type: "string" } },
                zh: { type: "object", additionalProperties: { type: "string" } },
              },
              required: ["en", "ja", "zh"],
              additionalProperties: false,
            },
          },
        },
      });

      const rawContent = response.choices?.[0]?.message?.content;
      if (!rawContent) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "번역 응답이 없습니다." });
      const content = typeof rawContent === "string" ? rawContent : JSON.stringify(rawContent);
      const parsed = JSON.parse(content) as {
        en: Record<string, string>;
        ja: Record<string, string>;
        zh: Record<string, string>;
      };
      return { translations: parsed };
    }),

  // ── 관리자: 이미지 업로드 ─────────────────────────────────────────────────────
  uploadImage: adminProcedure
    .input(
      z.object({
        base64: z.string().min(1),
        fileName: z.string().min(1).max(200),
        mimeType: z.string().default("image/jpeg"),
      })
    )
    .mutation(async ({ input }) => {
      const base64Data = input.base64.includes(",")
        ? input.base64.split(",")[1]
        : input.base64;
      const buffer = Buffer.from(base64Data, "base64");

      if (buffer.length > 5 * 1024 * 1024) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "이미지 파일 크기는 5MB 이하여야 합니다." });
      }

      const ext =
        input.mimeType.split("/")[1]?.replace("jpeg", "jpg") ?? "jpg";
      const uniqueName = `equipment3/${Date.now()}-${Math.random()
        .toString(36)
        .slice(2)}.${ext}`;

      const { url } = await storagePut(uniqueName, buffer, input.mimeType);
      return { url };
    }),
});
