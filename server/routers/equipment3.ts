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
  bgImageUrl: z.string().optional(),    // 배경 전용 이미지 (텍스트 오버레이용)
  images: z.string().optional(),       // JSON 배열 문자열
  youtubeUrl: z.string().optional(),
  modalImage: z.string().optional(),
  badge: z.string().max(100).optional(),
  badgeColor: z.string().max(20).optional(),
  sortOrder: z.number().optional(),
  isActive: z.enum(["0", "1"]).optional(),
  isBest: z.enum(["0", "1"]).optional(),
  // SEO 메타 정보
  seoTitle: z.string().max(120).optional(),
  seoDescription: z.string().optional(),
  seoKeywords: z.string().max(500).optional(),
  ogImageUrl: z.string().optional(),
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

  // ── 관리자: 전체 목록 (비활성 포함) — 관리자 전용으로 변경
  all: adminProcedure.query(async () => {
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
        bgImageUrl: input.bgImageUrl ?? null,
        images: input.images ?? "[]",
        youtubeUrl: input.youtubeUrl ?? null,
        modalImage: input.modalImage ?? null,
        badge: input.badge ?? "",
        badgeColor: input.badgeColor ?? "#4A6FA5",
        sortOrder: input.sortOrder ?? 0,
        isActive: input.isActive ?? "1",
        isBest: input.isBest ?? "0",
        seoTitle: input.seoTitle ?? "",
        seoDescription: input.seoDescription ?? "",
        seoKeywords: input.seoKeywords ?? "",
        ogImageUrl: input.ogImageUrl ?? null,
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

      // 필드 목록 — 번역할 키 순서 고정
      const fieldList = Object.keys(fieldsToTranslate);

      const prompt = `You are a professional medical/dermatology translator for a Korean dermatology clinic (Star Dermatology, Busan, Korea).
Translate ALL of the following Korean fields into English (en), Japanese (ja), and Chinese Simplified (zh).
You MUST include ALL fields in every language object — do not skip any field.
Return ONLY valid JSON with this exact structure (include every field listed below):
{
  "en": { ${fieldList.map(k => `"${k}": "...translated..."`).join(', ')} },
  "ja": { ${fieldList.map(k => `"${k}": "...translated..."`).join(', ')} },
  "zh": { ${fieldList.map(k => `"${k}": "...translated..."`).join(', ')} }
}
Rules:
- Keep medical brand names as-is (e.g. Ultherapy, Thermage FLX, AccuREP, HIFU, SMAS, FDA, RF, XERF)
- Use accurate dermatology/medical terminology
- Keep the same tone and length as the original
- For "time", "sessions", "recovery" fields, keep numeric values and units accurate
- NEVER omit any field — every field must appear in en, ja, and zh

Fields to translate:
${JSON.stringify(fieldsToTranslate, null, 2)}`;

      const response = await invokeLLM({
        messages: [
          { role: "system", content: "You are a professional medical translator. Respond with valid JSON only, no markdown, no explanation. Include ALL requested fields in your response." },
          { role: "user", content: prompt },
        ],
      });

      const rawContent = response.choices?.[0]?.message?.content;
      if (!rawContent) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "번역 응답이 없습니다." });

      // JSON 파싱 — 마크다운 코드블록 제거 후 파싱
      let content = typeof rawContent === "string" ? rawContent : JSON.stringify(rawContent);
      content = content.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "").trim();

      let parsed: { en: Record<string, string>; ja: Record<string, string>; zh: Record<string, string> };
      try {
        parsed = JSON.parse(content);
      } catch {
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "번역 결과 JSON 파싱 실패: " + content.slice(0, 200) });
      }

      // 누락 필드 보완 — LLM이 일부 필드를 생략한 경우 빈 문자열로 채움
      for (const lang of ["en", "ja", "zh"] as const) {
        if (!parsed[lang] || typeof parsed[lang] !== "object") parsed[lang] = {};
        for (const key of fieldList) {
          if (typeof parsed[lang][key] !== "string") {
            parsed[lang][key] = "";
          }
        }
      }

      return { translations: parsed };
    }),

  // ── 관리자: SEO 자동생성 (LLM) ─────────────────────────────────────────────────────
  autoGenerateSeo: adminProcedure
    .input(
      z.object({
        name: z.string().optional(),
        nameEn: z.string().optional(),
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
      const name = input.name?.trim() || "";
      const nameEn = input.nameEn?.trim() || "";
      const category = input.category?.trim() || "";
      const desc = input.desc?.trim() || "";
      const detail = input.detail?.trim() || "";
      const effect = input.effect?.trim() || "";
      const caution = input.caution?.trim() || "";
      const sessions = input.sessions?.trim() || "";
      const time = input.time?.trim() || "";
      const recovery = input.recovery?.trim() || "";

      if (!name) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "시술명을 먼저 입력해주세요." });
      }

      const prompt = `당신은 부산 서면 스타피부과의 검색엔진 전문가입니다.
다음 시술 정보를 바탕으로 네이버/구글 검색 최적화(SEO)를 위한 메타 정보를 한국어로 생성해주세요.

시술 정보:
- 시술명(한): ${name}
- 시술명(영): ${nameEn}
- 카테고리: ${category}
- 시술 설명: ${desc}
- 시술 상세: ${detail}
- 기대 효과: ${effect}
- 주의사항: ${caution}
- 권장 횟수: ${sessions}
- 시술 시간: ${time}
- 회복 기간: ${recovery}

다음 JSON 형식으로만 응답하세요 (마크다운, 설명 미포함):
{
  "seoTitle": "네이버/구글 검색 최적화 타이틀 (30-60자, 시술명+피부과+지역명 포함)",
  "seoDescription": "네이버 검색 기준 메타 설명문 (80-140자, 핵심 키워드와 혼신 문구 포함, 자연스러운 문장체)",
  "seoKeywords": "주요 키워드 8-10개 콤마 구분 (시술명, 지역명+피부과, 증상/효과 키워드 포함)"
}

작성 규칙:
- seoTitle: "[시술명] | 부산 서면 스타피부과" 형식 권장
- seoDescription: 시술 효과와 피부과 전문의 직접 시술 강조
- seoKeywords: 시술명, 부산피부과, 서면피부과, 스타피부과 등 지역 키워드 포함
- 의학 브랜드명(울써라피, 써마지 FLX 등)은 영문 원어 유지`;

      const response = await invokeLLM({
        messages: [
          { role: "system", content: "You are a Korean SEO specialist for a dermatology clinic. Respond with valid JSON only, no markdown, no explanation." },
          { role: "user", content: prompt },
        ],
        response_format: {
          type: "json_schema",
          json_schema: {
            name: "seo_meta",
            strict: true,
            schema: {
              type: "object",
              properties: {
                seoTitle: { type: "string", description: "SEO title (30-60 chars)" },
                seoDescription: { type: "string", description: "Meta description (80-140 chars)" },
                seoKeywords: { type: "string", description: "Comma-separated keywords (8-10)" },
              },
              required: ["seoTitle", "seoDescription", "seoKeywords"],
              additionalProperties: false,
            },
          },
        },
      });

      const rawContent = response.choices?.[0]?.message?.content;
      if (!rawContent) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "SEO 생성 응답이 없습니다." });

      let content = typeof rawContent === "string" ? rawContent : JSON.stringify(rawContent);
      content = content.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "").trim();

      let parsed: { seoTitle: string; seoDescription: string; seoKeywords: string };
      try {
        parsed = JSON.parse(content);
      } catch {
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "SEO JSON 파싱 실패: " + content.slice(0, 200) });
      }

      return {
        seoTitle: parsed.seoTitle || "",
        seoDescription: parsed.seoDescription || "",
        seoKeywords: parsed.seoKeywords || "",
      };
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
