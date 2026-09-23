import MainLayout from "@/components/MainLayout";
import OptimizedImage from "@/components/OptimizedImage";
import SeoHead, { buildHreflangs, LANG_TO_OG_LOCALE } from "@/components/SeoHead";
import { useLang } from "@/contexts/LangContext";
import { useLocalizedText } from "@/hooks/useLocalizedText";
import { MANAGEMENT_DEVICES, MANAGEMENT_DEVICE_IMAGES } from "@/lib/clinic-data";
import { getLocalizedUrl } from "@/lib/localizedPath";

const pageCopy = {
  ko: { eyebrow: "MANAGEMENT DEVICE FAQ", purpose: "관리 목적", effect: "기대 효과", tagLabel: "주요 관리 목적과 기대 효과" },
  en: { eyebrow: "MANAGEMENT DEVICE FAQ", purpose: "Purpose", effect: "Expected effect", tagLabel: "Primary care purpose and expected effect" },
  ja: { eyebrow: "MANAGEMENT DEVICE FAQ", purpose: "ケア目的", effect: "期待できる効果", tagLabel: "主なケア目的と期待できる効果" },
  zh: { eyebrow: "MANAGEMENT DEVICE FAQ", purpose: "护理目的", effect: "预期效果", tagLabel: "主要护理目的和预期效果" },
  "zh-TW": { eyebrow: "MANAGEMENT DEVICE FAQ", purpose: "護理目的", effect: "預期效果", tagLabel: "主要護理目的和預期效果" },
} as const;

type DeviceTag = { purpose: string; effect: string };

const DEVICE_TAGS: Record<string, Record<keyof typeof pageCopy, DeviceTag>> = {
  "1": {
    ko: { purpose: "각질 케어", effect: "영양 성분 침투" }, en: { purpose: "Exfoliation", effect: "Active ingredient delivery" }, ja: { purpose: "角質ケア", effect: "美容成分の浸透" }, zh: { purpose: "去角质", effect: "营养成分渗透" }, "zh-TW": { purpose: "去角質", effect: "營養成分滲透" },
  },
  "2": {
    ko: { purpose: "비타민 전달", effect: "무침 관리" }, en: { purpose: "Vitamin delivery", effect: "Needle-free care" }, ja: { purpose: "ビタミン導入", effect: "針なしケア" }, zh: { purpose: "维生素导入", effect: "无针护理" }, "zh-TW": { purpose: "維生素導入", effect: "無針護理" },
  },
  "3": {
    ko: { purpose: "노폐물 케어", effect: "혈액순환 개선" }, en: { purpose: "Waste removal", effect: "Circulation support" }, ja: { purpose: "老廃物ケア", effect: "血行改善" }, zh: { purpose: "废物清洁", effect: "改善血液循环" }, "zh-TW": { purpose: "廢物清潔", effect: "改善血液循環" },
  },
  "4": {
    ko: { purpose: "수분 케어", effect: "광채 개선" }, en: { purpose: "Moisture care", effect: "Radiance improvement" }, ja: { purpose: "保湿ケア", effect: "ツヤ改善" }, zh: { purpose: "保湿护理", effect: "改善光泽" }, "zh-TW": { purpose: "保濕護理", effect: "改善光澤" },
  },
  "5": {
    ko: { purpose: "콜라겐 재생", effect: "탄력·리프팅" }, en: { purpose: "Collagen regeneration", effect: "Elasticity and lifting" }, ja: { purpose: "コラーゲン再生", effect: "弾力・リフティング" }, zh: { purpose: "促进胶原再生", effect: "弹力与提升" }, "zh-TW": { purpose: "促進膠原再生", effect: "彈力與提升" },
  },
  "6": {
    ko: { purpose: "처짐 케어", effect: "주름 개선" }, en: { purpose: "Sagging care", effect: "Wrinkle improvement" }, ja: { purpose: "たるみケア", effect: "しわ改善" }, zh: { purpose: "改善松弛", effect: "改善皱纹" }, "zh-TW": { purpose: "改善鬆弛", effect: "改善皺紋" },
  },
  "7": {
    ko: { purpose: "피부 재생", effect: "시술 후 회복" }, en: { purpose: "Skin regeneration", effect: "Post-treatment recovery" }, ja: { purpose: "肌再生", effect: "施術後の回復" }, zh: { purpose: "皮肤再生", effect: "术后恢复" }, "zh-TW": { purpose: "皮膚再生", effect: "術後恢復" },
  },
  "8": {
    ko: { purpose: "3D 피부 분석", effect: "전후 데이터 확인" }, en: { purpose: "3D skin analysis", effect: "Before-and-after data" }, ja: { purpose: "3D肌分析", effect: "施術前後データ" }, zh: { purpose: "3D皮肤分析", effect: "前后数据确认" }, "zh-TW": { purpose: "3D皮膚分析", effect: "前後數據確認" },
  },
  "9": {
    ko: { purpose: "비타민 침투", effect: "미백·항산화" }, en: { purpose: "Vitamin delivery", effect: "Whitening and antioxidant care" }, ja: { purpose: "ビタミン浸透", effect: "美白・抗酸化" }, zh: { purpose: "维生素渗透", effect: "美白与抗氧化" }, "zh-TW": { purpose: "維生素滲透", effect: "美白與抗氧化" },
  },
  "10": {
    ko: { purpose: "진피 치유", effect: "시술 후 회복" }, en: { purpose: "Dermal healing", effect: "Post-treatment recovery" }, ja: { purpose: "真皮治癒", effect: "施術後の回復" }, zh: { purpose: "真皮愈合", effect: "术后恢复" }, "zh-TW": { purpose: "真皮癒合", effect: "術後恢復" },
  },
  "11": {
    ko: { purpose: "영양 성분 침투", effect: "콜라겐 생성" }, en: { purpose: "Active ingredient delivery", effect: "Collagen production" }, ja: { purpose: "美容成分の浸透", effect: "コラーゲン生成" }, zh: { purpose: "营养成分渗透", effect: "促进胶原生成" }, "zh-TW": { purpose: "營養成分滲透", effect: "促進膠原生成" },
  },
  "12": {
    ko: { purpose: "수분 개선", effect: "탄력 개선" }, en: { purpose: "Moisture improvement", effect: "Elasticity improvement" }, ja: { purpose: "水分改善", effect: "弾力改善" }, zh: { purpose: "改善水分", effect: "改善弹力" }, "zh-TW": { purpose: "改善水分", effect: "改善彈力" },
  },
  "13": {
    ko: { purpose: "수분 집중 공급", effect: "콜라겐 형성 지원" }, en: { purpose: "Intensive moisture supply", effect: "Collagen formation support" }, ja: { purpose: "水分集中供給", effect: "コラーゲン形成支援" }, zh: { purpose: "集中补水", effect: "支持胶原形成" }, "zh-TW": { purpose: "集中補水", effect: "支持膠原形成" },
  },
  "14": {
    ko: { purpose: "수분 보유력 강화", effect: "피부 톤 개선" }, en: { purpose: "Moisture retention", effect: "Skin-tone improvement" }, ja: { purpose: "水分保持力強化", effect: "肌トーン改善" }, zh: { purpose: "增强保湿力", effect: "改善肤色" }, "zh-TW": { purpose: "增強保濕力", effect: "改善膚色" },
  },
  "15": {
    ko: { purpose: "색소 침착 예방", effect: "피부 안정화" }, en: { purpose: "Hyperpigmentation prevention", effect: "Skin stabilization" }, ja: { purpose: "色素沈着予防", effect: "肌の安定化" }, zh: { purpose: "预防色素沉着", effect: "稳定皮肤" }, "zh-TW": { purpose: "預防色素沉著", effect: "穩定皮膚" },
  },
  "16": {
    ko: { purpose: "피부 손상 회복", effect: "탄력 강화" }, en: { purpose: "Skin-damage recovery", effect: "Elasticity support" }, ja: { purpose: "肌ダメージ回復", effect: "弾力強化" }, zh: { purpose: "修复皮肤损伤", effect: "强化弹力" }, "zh-TW": { purpose: "修復皮膚損傷", effect: "強化彈力" },
  },
};

export default function ManagementDeviceFaq() {
  const { lang } = useLang();
  const { getText } = useLocalizedText();

  const copy = pageCopy[lang];
  const pageTitle = getText("관리장비 소개", "Management Devices", "管理機器のご案内", "管理设备介绍", "管理設備介紹");
  const firstDescription = getText(
    MANAGEMENT_DEVICES[0].shortDesc,
    MANAGEMENT_DEVICES[0].shortDescEn,
    MANAGEMENT_DEVICES[0].shortDescJa,
    MANAGEMENT_DEVICES[0].shortDescZh,
    MANAGEMENT_DEVICES[0].shortDescZhTw,
  );
  const canonicalPath = getLocalizedUrl(lang, "/management-device-faq");
  const hreflangs = buildHreflangs(
    "/management-device-faq",
    "/en/management-device-faq",
    "/ja/management-device-faq",
    "/zh/management-device-faq",
  );

  return (
    <MainLayout>
      <SeoHead
        title={`${pageTitle} | 스타피부과`}
        description={firstDescription}
        canonical={canonicalPath}
        ogUrl={canonicalPath}
        ogLocale={LANG_TO_OG_LOCALE[lang]}
        hreflangs={hreflangs}
      />

      <section className="bg-[var(--color-star-navy)] px-4 py-16 text-center md:py-24">
        <p className="mb-3 text-sm font-semibold tracking-[0.2em] text-[var(--color-gold-primary)]">{copy.eyebrow}</p>
        <h1 className="text-3xl font-bold text-white md:text-5xl">{pageTitle}</h1>
      </section>

      <section className="bg-[#f7f5f0] px-4 py-12 md:py-20">
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-8" data-testid="management-device-faq-grid">
            {MANAGEMENT_DEVICES.map((device) => {
              const displayName = getText(device.name, device.nameEn, device.nameJa, device.nameZh, device.nameZhTw);
              const description = getText(
                device.shortDesc,
                device.shortDescEn,
                device.shortDescJa,
                device.shortDescZh,
                device.shortDescZhTw,
              );
              const tags = DEVICE_TAGS[device.id][lang];

              return (
                <article key={device.id} className="h-full overflow-hidden rounded-2xl bg-white shadow-[0_12px_34px_rgba(39,30,20,0.10)]">
                  <div className="flex flex-col gap-6 border-b border-black/5 p-6 sm:flex-row sm:items-center md:p-8">
                    <div className="size-24 shrink-0 overflow-hidden rounded-full bg-[#eee7dc] sm:size-28">
                      <OptimizedImage
                        src={MANAGEMENT_DEVICE_IMAGES[device.imgId]}
                        alt={displayName}
                        className="h-full w-full object-cover"
                        width={112}
                        height={112}
                      />
                    </div>
                    <div>
                      <p className="text-xs font-semibold tracking-[0.16em] text-[var(--color-gold-primary)]">{device.nameEn}</p>
                      <h2 className="mt-1 text-2xl font-bold text-[#2c1f0e]">{displayName}</h2>
                      <ul className="mt-3 flex flex-wrap gap-2" aria-label={copy.tagLabel}>
                        <li className="rounded-full bg-[#f3ece2] px-3 py-1.5 text-xs font-semibold text-[#6c4f26]">
                          <span className="mr-1 text-[#9b7a43]">{copy.purpose}</span>{tags.purpose}
                        </li>
                        <li className="rounded-full bg-[#eef2ed] px-3 py-1.5 text-xs font-semibold text-[#48614d]">
                          <span className="mr-1 text-[#6b8a70]">{copy.effect}</span>{tags.effect}
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div className="px-6 py-5 md:px-8 md:py-6">
                    <p className="text-sm leading-7 text-[#62584e]">{description}</p>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>
    </MainLayout>
  );
}
