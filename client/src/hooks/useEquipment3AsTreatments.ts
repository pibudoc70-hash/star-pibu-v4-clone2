/**
 * useEquipment3AsTreatments
 *
 * trpc.equipment3.list 에서 DB 데이터를 가져와
 * TreatmentsEquipmentSection 이 사용하는 Treatment 타입으로 변환한다.
 *
 * 이 훅을 사용하면 /equipment3 관리자에서 등록·수정한 내용이
 * 메인 홈의 "주요 시술 및 장비" 카드 섹션(모달)에도 자동 반영된다.
 *
 * 필드 매핑:
 *   equipment3.imageUrl    → Treatment.image
 *   equipment3.bgImageUrl  → Treatment.cardBannerImage
 *   equipment3.images (JSON 문자열) → Treatment.images (string[])
 *   equipment3.isBest      → Treatment.best
 *   equipment3.category    → 탭 ID
 */
import { useMemo } from "react";
import { trpc } from "@/lib/trpc";
import type { Treatment } from "@/types/treatment";

// Equipment3 페이지와 동일한 카테고리 번역 테이블
const CATEGORY_TRANS: Record<string, { en: string; ja: string; zh: string }> = {
  "Best 시술":     { en: "Best Treatments",           ja: "ベスト施術",          zh: "最佳项目" },
  "리프팅·탄력":   { en: "Lifting & Elasticity",       ja: "リフティング・弾力",   zh: "提升·弹力" },
  "눈밑지방재배치": { en: "Under-eye Fat Repositioning", ja: "目の下の脂肪再配置",   zh: "眼袋脂肪重置" },
  "백반증":        { en: "Vitiligo",                   ja: "白斑症",              zh: "白癜风" },
  "색소·문신":     { en: "Pigmentation·Tattoo",        ja: "色素・タトゥー",       zh: "色素·纹身" },
  "홍조·혈관":     { en: "Rosacea·Vascular",           ja: "紅潮・血管",           zh: "红斑·血管" },
  "여드름":        { en: "Acne",                       ja: "ニキビ",              zh: "痤疮" },
  "액취증·다한증": { en: "Osmidrosis·Hyperhidrosis",   ja: "腋臭症・多汗症",       zh: "腋臭·多汗症" },
  "손·발톱무좀":   { en: "Nail Fungus",                ja: "爪水虫",              zh: "灰指甲" },
  "건선·아토피":   { en: "Psoriasis·Atopy",            ja: "乾癬・アトピー",       zh: "银屑病·特应性" },
  "볼륨·부스터":   { en: "Volume·Booster",             ja: "ボリューム・ブースター", zh: "填充·促进" },
  "보톡스·필러":   { en: "Botox·Filler",               ja: "ボトックス・フィラー",  zh: "肉毒素·填充" },
  "줄기세포 치료": { en: "Stem Cell Therapy",          ja: "幹細胞治療",           zh: "干细胞治疗" },
  "흉터·모공":     { en: "Scar·Pores",                 ja: "傷跡・毛穴",           zh: "疤痕·毛孔" },
  "피부관리":      { en: "Skin Care",                  ja: "スキンケア",            zh: "皮肤护理" },
};

const BEST_CATEGORY_LABELS = new Set([
  "best", "Best", "Best 시술", "best 시술", "BEST", "BEST 시술",
]);

export interface Equipment3Tab {
  id: string;
  label: string;
  labelEn: string;
  labelJa: string;
  labelZh: string;
}

export interface UseEquipment3AsTreatmentsReturn {
  /** 카테고리 탭 목록 (Best 시술 탭 포함) */
  tabs: Equipment3Tab[];
  /** 탭 ID → Treatment[] 맵 */
  treatmentsByTab: Record<string, Treatment[]>;
  /** 전체 Treatment 목록 (탭 필터 없음) */
  allTreatments: Treatment[];
  isLoading: boolean;
}

/**
 * equipment3 DB 아이템 하나를 Treatment 타입으로 변환
 */
function toTreatment(item: {
  id: number;
  name: string;
  nameEn: string;
  nameJa?: string | null;
  nameZh?: string | null;
  desc: string;
  descEn?: string | null;
  descJa?: string | null;
  descZh?: string | null;
  detail?: string | null;
  detailEn?: string | null;
  detailJa?: string | null;
  detailZh?: string | null;
  effect?: string | null;
  effectEn?: string | null;
  effectJa?: string | null;
  effectZh?: string | null;
  caution?: string | null;
  cautionEn?: string | null;
  cautionJa?: string | null;
  cautionZh?: string | null;
  sessions?: string | null;
  sessionsEn?: string | null;
  sessionsJa?: string | null;
  sessionsZh?: string | null;
  time?: string | null;
  timeEn?: string | null;
  timeJa?: string | null;
  timeZh?: string | null;
  recovery?: string | null;
  recoveryEn?: string | null;
  recoveryJa?: string | null;
  recoveryZh?: string | null;
  badge?: string | null;
  badgeColor?: string | null;
  imageUrl?: string | null;
  bgImageUrl?: string | null;
  images?: string | null;
  youtubeUrl?: string | null;
  modalImage?: string | null;
  isBest?: string | null;
}): Treatment {
  // images JSON 문자열 → string[]
  let parsedImages: string[] | undefined;
  if (item.images && item.images !== "[]") {
    try {
      const arr = JSON.parse(item.images);
      if (Array.isArray(arr) && arr.length > 0) parsedImages = arr;
    } catch {
      // 파싱 실패 시 무시
    }
  }

  return {
    name: item.name,
    nameEn: item.nameEn ?? "",
    nameJa: item.nameJa ?? undefined,
    nameZh: item.nameZh ?? undefined,
    desc: item.desc ?? "",
    descEn: item.descEn ?? undefined,
    descJa: item.descJa ?? undefined,
    descZh: item.descZh ?? undefined,
    detail: item.detail ?? undefined,
    detailEn: item.detailEn ?? undefined,
    detailJa: item.detailJa ?? undefined,
    detailZh: item.detailZh ?? undefined,
    effect: item.effect ?? undefined,
    effectEn: item.effectEn ?? undefined,
    effectJa: item.effectJa ?? undefined,
    effectZh: item.effectZh ?? undefined,
    caution: item.caution ?? undefined,
    cautionEn: item.cautionEn ?? undefined,
    cautionJa: item.cautionJa ?? undefined,
    cautionZh: item.cautionZh ?? undefined,
    sessions: item.sessions ?? undefined,
    sessionsEn: item.sessionsEn ?? undefined,
    sessionsJa: item.sessionsJa ?? undefined,
    sessionsZh: item.sessionsZh ?? undefined,
    time: item.time ?? "",
    timeEn: item.timeEn ?? undefined,
    timeJa: item.timeJa ?? undefined,
    timeZh: item.timeZh ?? undefined,
    recovery: item.recovery ?? "",
    recoveryEn: item.recoveryEn ?? undefined,
    recoveryJa: item.recoveryJa ?? undefined,
    recoveryZh: item.recoveryZh ?? undefined,
    badge: item.badge ?? undefined,
    badgeColor: item.badgeColor ?? undefined,
    // 이미지 필드 매핑
    image: item.imageUrl ?? "",
    bgImageUrl: item.bgImageUrl ?? undefined,  // 비한국어 오버레이용
    cardBannerImage: item.bgImageUrl ?? undefined,
    images: parsedImages,
    youtubeUrl: item.youtubeUrl ?? undefined,
    modalImage: item.modalImage ?? undefined,
    best: String(item.isBest) === "1",
  };
}

export function useEquipment3AsTreatments(): UseEquipment3AsTreatmentsReturn {
  const { data: rawItems = [], isLoading } = trpc.equipment3.list.useQuery();

  // 탭 목록 생성 (Equipment3 페이지와 동일한 로직)
  const tabs = useMemo<Equipment3Tab[]>(() => {
    const seen = new Set<string>();
    const result: Equipment3Tab[] = [];

    // Best 시술 탭 (isBest=1인 항목이 있으면 추가)
    const hasBest = rawItems.some((item) => String(item.isBest) === "1");
    if (hasBest) {
      result.push({
        id: "best",
        label: "Best 시술",
        labelEn: "Best Treatments",
        labelJa: "ベスト施術",
        labelZh: "最佳项目",
      });
      seen.add("best");
    }

    // 카테고리 탭 (Best 카테고리 라벨 중복 제외)
    for (const item of rawItems) {
      const catId = item.category ?? "";
      if (!catId) continue;
      if (BEST_CATEGORY_LABELS.has(catId)) continue;
      if (!seen.has(catId)) {
        seen.add(catId);
        const fallback = CATEGORY_TRANS[catId] ?? { en: catId, ja: catId, zh: catId };
        result.push({
          id: catId,
          label: item.category ?? catId,
          labelEn: (item.categoryEn && item.categoryEn.trim()) ? item.categoryEn : fallback.en,
          labelJa: (item.categoryJa && item.categoryJa.trim()) ? item.categoryJa : fallback.ja,
          labelZh: (item.categoryZh && item.categoryZh.trim()) ? item.categoryZh : fallback.zh,
        });
      }
    }
    return result;
  }, [rawItems]);

  // 전체 Treatment 목록
  const allTreatments = useMemo<Treatment[]>(
    () => rawItems.map(toTreatment),
    [rawItems],
  );

  // 탭 ID → Treatment[] 맵
  const treatmentsByTab = useMemo<Record<string, Treatment[]>>(() => {
    const map: Record<string, Treatment[]> = {};
    for (const tab of tabs) {
      if (tab.id === "best") {
        map["best"] = allTreatments.filter((t) => t.best === true);
      } else {
        map[tab.id] = rawItems
          .filter((item) => (item.category ?? "") === tab.id)
          .map(toTreatment);
      }
    }
    return map;
  }, [tabs, allTreatments, rawItems]);

  return { tabs, treatmentsByTab, allTreatments, isLoading };
}
