/**
 * notices.ts — 공지사항 라우터
 * 공개: 목록 조회(언어 필터), 단건 조회 (+ 조회수 증가), 이미지 조회
 * 관리자: 작성, 수정, 삭제, 이미지 업로드, 이미지 삭제, LLM 자동번역
 */
import { z } from "zod/v4";
import { adminProcedure, publicProcedure, router } from "../_core/trpc";
import {
  getAllNotices,
  getNoticeById,
  createNotice,
  updateNotice,
  deleteNotice,
  incrementNoticeViews,
  getNoticeImages,
  addNoticeImage,
  deleteNoticeImage,
  getNoticeImagesByNoticeIds,
} from "../db";
import { storagePut } from "../storage";
import { invokeLLM } from "../_core/llm";
import { TRPCError } from "@trpc/server";

const LANG_LABELS: Record<string, string> = {
  en: "English",
  ja: "日本語",
  zh: "中文(简体)",
};

export const noticesRouter = router({
  /** 공개: 공지사항 목록 (고정글 먼저, 최신순, 언어 필터) */
  list: publicProcedure
    .input(z.object({ lang: z.string().optional() }).optional())
    .query(async ({ input }) => {
      const lang = input?.lang;
      const noticeList = await getAllNotices(lang);
      if (noticeList.length === 0) return [];
      // 각 공지사항의 첫 번째 이미지(썸네일)도 함께 반환
      const ids = noticeList.map((n) => n.id);
      const allImages = await getNoticeImagesByNoticeIds(ids);
      return noticeList.map((n) => ({
        ...n,
        thumbnail: allImages.find((img) => img.noticeId === n.id)?.url ?? null,
      }));
    }),

  /** 관리자: 전체 목록 (언어 필터 없이 전체 조회) */
  adminList: adminProcedure.query(async () => {
    const noticeList = await getAllNotices();
    if (noticeList.length === 0) return [];
    const ids = noticeList.map((n) => n.id);
    const allImages = await getNoticeImagesByNoticeIds(ids);
    return noticeList.map((n) => ({
      ...n,
      thumbnail: allImages.find((img) => img.noticeId === n.id)?.url ?? null,
    }));
  }),

  /** 공개: 공지사항 단건 조회 + 조회수 증가 */
  getById: publicProcedure
    .input(z.object({ id: z.number().int().positive() }))
    .query(async ({ input }) => {
      const notice = await getNoticeById(input.id);
      if (!notice) throw new TRPCError({ code: "NOT_FOUND", message: "공지사항을 찾을 수 없습니다." });
      // 조회수 비동기 증가 (응답 지연 없음)
      incrementNoticeViews(input.id).catch(() => {});
      const images = await getNoticeImages(input.id);
      return { ...notice, images };
    }),

  /** 공개: 공지사항 이미지 목록 조회 */
  getImages: publicProcedure
    .input(z.object({ noticeId: z.number().int().positive() }))
    .query(async ({ input }) => getNoticeImages(input.noticeId)),

  /** 관리자: 공지사항 작성 */
  create: adminProcedure
    .input(z.object({
      title: z.string().min(1).max(300),
      content: z.string().min(1),
      isPinned: z.enum(["0", "1"]).default("0"),
      targetLang: z.enum(["all", "ko", "en", "ja", "zh"]).default("all"),
      sourceNoticeId: z.number().int().optional(),
    }))
    .mutation(async ({ input }) => {
      const result = await createNotice({
        title: input.title,
        content: input.content,
        isPinned: input.isPinned,
        targetLang: input.targetLang,
        sourceNoticeId: input.sourceNoticeId ?? null,
      });
      // insertId 반환 (이미지 연결용)
      const insertId = (result as any).insertId as number;
      return { success: true, id: insertId };
    }),

  /** 관리자: 공지사항 수정 */
  update: adminProcedure
    .input(z.object({
      id: z.number().int().positive(),
      title: z.string().min(1).max(300).optional(),
      content: z.string().min(1).optional(),
      isPinned: z.enum(["0", "1"]).optional(),
      targetLang: z.enum(["all", "ko", "en", "ja", "zh"]).optional(),
    }))
    .mutation(async ({ input }) => {
      const { id, ...data } = input;
      const existing = await getNoticeById(id);
      if (!existing) throw new TRPCError({ code: "NOT_FOUND", message: "공지사항을 찾을 수 없습니다." });
      await updateNotice(id, data);
      return { success: true };
    }),

  /** 관리자: 공지사항 삭제 */
  delete: adminProcedure
    .input(z.object({ id: z.number().int().positive() }))
    .mutation(async ({ input }) => {
      const existing = await getNoticeById(input.id);
      if (!existing) throw new TRPCError({ code: "NOT_FOUND", message: "공지사항을 찾을 수 없습니다." });
      await deleteNotice(input.id);
      return { success: true };
    }),

  /**
   * 관리자: LLM 자동번역 — 한글 공지사항을 지정 언어로 번역하여 새 공지사항으로 등록
   * targetLangs: 번역할 언어 배열 (예: ["en", "ja", "zh"])
   * 반환: 생성된 공지사항 ID 목록
   */
  autoTranslate: adminProcedure
    .input(z.object({
      sourceId: z.number().int().positive(),
      targetLangs: z.array(z.enum(["en", "ja", "zh"])).min(1),
    }))
    .mutation(async ({ input }) => {
      const source = await getNoticeById(input.sourceId);
      if (!source) throw new TRPCError({ code: "NOT_FOUND", message: "원본 공지사항을 찾을 수 없습니다." });

      const results: { lang: string; id: number; title: string }[] = [];

      for (const lang of input.targetLangs) {
        const langLabel = LANG_LABELS[lang] ?? lang;
        try {
          // LLM으로 제목과 본문 번역
          const response = await invokeLLM({
            messages: [
              {
                role: "system",
                content: `You are a professional medical clinic translator. Translate the given Korean notice into ${langLabel}. Return ONLY valid JSON with "title" and "content" fields. Preserve HTML tags if any. Keep the tone professional and friendly.`,
              },
              {
                role: "user",
                content: `Translate this Korean notice to ${langLabel}:\n\nTitle: ${source.title}\n\nContent: ${source.content}`,
              },
            ],
            response_format: {
              type: "json_schema",
              json_schema: {
                name: "translation",
                strict: true,
                schema: {
                  type: "object",
                  properties: {
                    title: { type: "string", description: "Translated title" },
                    content: { type: "string", description: "Translated content" },
                  },
                  required: ["title", "content"],
                  additionalProperties: false,
                },
              },
            },
          });

          const raw = response?.choices?.[0]?.message?.content ?? "{}";
          const translated = JSON.parse(typeof raw === "string" ? raw : JSON.stringify(raw)) as { title: string; content: string };

          if (!translated.title || !translated.content) {
            throw new Error("번역 결과가 비어 있습니다.");
          }

          // 번역된 공지사항 등록
          const result = await createNotice({
            title: translated.title,
            content: translated.content,
            isPinned: source.isPinned,
            targetLang: lang,
            sourceNoticeId: source.id,
          });
          const insertId = (result as any).insertId as number;
          results.push({ lang, id: insertId, title: translated.title });
        } catch (err) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: `${langLabel} 번역 실패: ${err instanceof Error ? err.message : String(err)}`,
          });
        }
      }

      return { success: true, created: results };
    }),

  /** 관리자: 이미지 업로드 (base64 → S3) */
  uploadImage: adminProcedure
    .input(z.object({
      noticeId: z.number().int().positive(),
      base64: z.string(), // data:image/jpeg;base64,... 또는 순수 base64
      mimeType: z.string().default("image/jpeg"),
      sortOrder: z.number().int().default(0),
    }))
    .mutation(async ({ input }) => {
      // base64 디코딩
      const base64Data = input.base64.replace(/^data:[^;]+;base64,/, "");
      const buffer = Buffer.from(base64Data, "base64");

      // 파일 크기 제한: 10MB
      if (buffer.length > 10 * 1024 * 1024) {
        throw new TRPCError({ code: "PAYLOAD_TOO_LARGE", message: "이미지 크기는 10MB 이하여야 합니다." });
      }

      const ext = input.mimeType.split("/")[1] ?? "jpg";
      const fileKey = `notices/${input.noticeId}/${Date.now()}.${ext}`;
      const { key, url } = await storagePut(fileKey, buffer, input.mimeType);

      await addNoticeImage({
        noticeId: input.noticeId,
        fileKey: key,
        url,
        sortOrder: input.sortOrder,
      });

      return { success: true, url, key };
    }),

  /** 관리자: 이미지 삭제 */
  deleteImage: adminProcedure
    .input(z.object({ imageId: z.number().int().positive() }))
    .mutation(async ({ input }) => {
      await deleteNoticeImage(input.imageId);
      return { success: true };
    }),
});
