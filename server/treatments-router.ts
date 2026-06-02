import { adminProcedure, publicProcedure, router } from "./_core/trpc";
import { getAllTreatmentCategories, getTreatmentsByCategory, getAllTreatments, getTreatmentById, createTreatment, updateTreatment, deleteTreatment, getTreatmentsByBest } from "./db";
import { z } from "zod/v4";
import { storagePut } from "./storage";

export const treatmentsRouter = router({
  // 공개: 모든 시술 카테고리 조회
  categories: publicProcedure.query(async () => {
    return getAllTreatmentCategories();
  }),

  // 공개: 특정 카테고리의 시술 조회
  byCategory: publicProcedure
    .input(z.object({ categoryId: z.string(), section: z.string().optional() }))
    .query(async ({ input }) => {
      return getTreatmentsByCategory(input.categoryId, input.section);
    }),

  // 공개: 모든 시술 조회
  all: publicProcedure
    .input(z.object({ section: z.string().optional() }).optional())
    .query(async ({ input }) => {
      return getAllTreatments(input?.section);
    }),

  // 공개: Best 시술 조회
  best: publicProcedure
    .input(z.object({ section: z.string().optional() }).optional())
    .query(async ({ input }) => {
      return getTreatmentsByBest(input?.section);
    }),

  // 공개: 특정 시술 조회
  byId: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      return getTreatmentById(input.id);
    }),

  // 관리자: 시술 생성
  create: adminProcedure
    .input(z.object({
      categoryId: z.string(),
      name: z.string().min(1).max(200),
      nameEn: z.string().min(1).max(200),
      nameJa: z.string().max(200).optional(),
      nameZh: z.string().max(200).optional(),
      desc: z.string().min(1),
      descEn: z.string().optional(),
      descJa: z.string().optional(),
      descZh: z.string().optional(),
      time: z.string().min(1).max(50),
      timeEn: z.string().max(50).optional(),
      timeJa: z.string().max(50).optional(),
      timeZh: z.string().max(50).optional(),
      recovery: z.string().min(1).max(50),
      recoveryEn: z.string().max(50).optional(),
      recoveryJa: z.string().max(50).optional(),
      recoveryZh: z.string().max(50).optional(),
      slug: z.string().min(1).max(200).optional(),
      slugEn: z.string().max(200).optional(),
      slugJa: z.string().max(200).optional(),
      slugZh: z.string().max(200).optional(),
      badge: z.string().max(100).optional(),
      badgeEn: z.string().max(100).optional(),
      badgeJa: z.string().max(100).optional(),
      badgeZh: z.string().max(100).optional(),
      badgeColor: z.string().max(20).optional(),
      image: z.string().optional(),
      images: z.string().optional(),
      imgBg: z.string().max(20).optional(),
      cardBannerImage: z.string().optional(),
      detail: z.string().optional(),
      detailEn: z.string().optional(),
      detailJa: z.string().optional(),
      detailZh: z.string().optional(),
      caution: z.string().optional(),
      cautionEn: z.string().optional(),
      cautionJa: z.string().optional(),
      cautionZh: z.string().optional(),
      sessions: z.string().max(200).optional(),
      sessionsEn: z.string().max(200).optional(),
      sessionsJa: z.string().max(200).optional(),
      sessionsZh: z.string().max(200).optional(),
      effect: z.string().optional(),
      effectEn: z.string().optional(),
      effectJa: z.string().optional(),
      effectZh: z.string().optional(),
      related: z.string().optional(),
      steps: z.string().optional(),
      youtubeUrl: z.string().optional(),
      modalImage: z.string().optional(),
      best: z.enum(["0", "1"]).optional(),
      section: z.enum(["v1", "v2"]).optional(),
      sortOrder: z.number().optional(),
      isActive: z.enum(["0", "1"]).optional(),
    }))
    .mutation(async ({ input }) => {
      await createTreatment({
        categoryId: input.categoryId,
        name: input.name,
        nameEn: input.nameEn,
        nameJa: input.nameJa,
        nameZh: input.nameZh,
        desc: input.desc,
        descEn: input.descEn,
        descJa: input.descJa,
        descZh: input.descZh,
        time: input.time,
        timeEn: input.timeEn,
        timeJa: input.timeJa,
        timeZh: input.timeZh,
        recovery: input.recovery,
        recoveryEn: input.recoveryEn,
        recoveryJa: input.recoveryJa,
        recoveryZh: input.recoveryZh,
        slug: input.slug,
        slugEn: input.slugEn,
        slugJa: input.slugJa,
        slugZh: input.slugZh,
        badge: input.badge || "",
        badgeEn: input.badgeEn,
        badgeJa: input.badgeJa,
        badgeZh: input.badgeZh,
        badgeColor: input.badgeColor || "#4A6FA5",
        image: input.image,
        images: input.images || "",
        imgBg: input.imgBg || "",
        cardBannerImage: input.cardBannerImage,
        detail: input.detail,
        detailEn: input.detailEn,
        detailJa: input.detailJa,
        detailZh: input.detailZh,
        caution: input.caution,
        cautionEn: input.cautionEn,
        cautionJa: input.cautionJa,
        cautionZh: input.cautionZh,
        sessions: input.sessions || "",
        sessionsEn: input.sessionsEn,
        sessionsJa: input.sessionsJa,
        sessionsZh: input.sessionsZh,
        effect: input.effect,
        effectEn: input.effectEn,
        effectJa: input.effectJa,
        effectZh: input.effectZh,
        related: input.related || "",
        steps: input.steps || "",
        youtubeUrl: input.youtubeUrl,
        modalImage: input.modalImage,
        best: input.best || "0",
        section: input.section || "v1",
        sortOrder: input.sortOrder || 0,
        isActive: input.isActive || "1",
      });
      return { success: true };
    }),

  // 관리자: 시술 수정
  update: adminProcedure
    .input(z.object({
      id: z.number(),
      categoryId: z.string().optional(),
      name: z.string().max(200).optional(),
      nameEn: z.string().max(200).optional(),
      nameJa: z.string().max(200).optional(),
      nameZh: z.string().max(200).optional(),
      desc: z.string().optional(),
      descEn: z.string().optional(),
      descJa: z.string().optional(),
      descZh: z.string().optional(),
      time: z.string().max(50).optional(),
      timeEn: z.string().max(50).optional(),
      timeJa: z.string().max(50).optional(),
      timeZh: z.string().max(50).optional(),
      recovery: z.string().max(50).optional(),
      recoveryEn: z.string().max(50).optional(),
      recoveryJa: z.string().max(50).optional(),
      recoveryZh: z.string().max(50).optional(),
      slug: z.string().max(200).optional(),
      slugEn: z.string().max(200).optional(),
      slugJa: z.string().max(200).optional(),
      slugZh: z.string().max(200).optional(),
      badge: z.string().max(100).optional(),
      badgeEn: z.string().max(100).optional(),
      badgeJa: z.string().max(100).optional(),
      badgeZh: z.string().max(100).optional(),
      badgeColor: z.string().max(20).optional(),
      image: z.string().optional(),
      images: z.string().optional(),
      imgBg: z.string().max(20).optional(),
      cardBannerImage: z.string().optional(),
      detail: z.string().optional(),
      detailEn: z.string().optional(),
      detailJa: z.string().optional(),
      detailZh: z.string().optional(),
      caution: z.string().optional(),
      cautionEn: z.string().optional(),
      cautionJa: z.string().optional(),
      cautionZh: z.string().optional(),
      sessions: z.string().max(200).optional(),
      sessionsEn: z.string().max(200).optional(),
      sessionsJa: z.string().max(200).optional(),
      sessionsZh: z.string().max(200).optional(),
      effect: z.string().optional(),
      effectEn: z.string().optional(),
      effectJa: z.string().optional(),
      effectZh: z.string().optional(),
      related: z.string().optional(),
      steps: z.string().optional(),
      youtubeUrl: z.string().optional(),
      modalImage: z.string().optional(),
      best: z.enum(["0", "1"]).optional(),
      sortOrder: z.number().optional(),
      isActive: z.enum(["0", "1"]).optional(),
    }))
    .mutation(async ({ input }) => {
      const { id, ...updateData } = input;
      await updateTreatment(id, updateData);
      return { success: true };
    }),

  // 관리자: 시술 삭제
  delete: adminProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      await deleteTreatment(input.id);
      return { success: true };
    }),

  // 관리자: 이미지 업로드
  uploadImage: adminProcedure
    .input(z.object({
      base64: z.string().min(1),
      fileName: z.string().min(1).max(200),
      mimeType: z.string().default("image/jpeg"),
    }))
    .mutation(async ({ input }) => {
      const base64Data = input.base64.includes(",")
        ? input.base64.split(",")[1]
        : input.base64;
      const buffer = Buffer.from(base64Data, "base64");

      if (buffer.length > 5 * 1024 * 1024) {
        throw new Error("이미지 파일 크기는 5MB 이하여야 합니다.");
      }

      const ext = input.mimeType.split("/")[1]?.replace("jpeg", "jpg") ?? "jpg";
      const uniqueName = `treatments/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

      const { url } = await storagePut(uniqueName, buffer, input.mimeType);
      return { url };
    }),
});
