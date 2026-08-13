export type EquipmentFaq = {
  question: string;
  answer: string;
};

type EquipmentFaqSource = {
  faqs?: string | null;
  faqsEn?: string | null;
  faqsJa?: string | null;
  faqsZh?: string | null;
  faqsZhTw?: string | null;
};

export const MAX_EQUIPMENT_FAQS = 20;
const MAX_FIELD_LENGTH = 4_000;

export function parseEquipmentFaqs(raw: string | null | undefined): EquipmentFaq[] {
  if (!raw?.trim()) return [];

  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    const seenQuestions = new Set<string>();
    return parsed
      .slice(0, MAX_EQUIPMENT_FAQS)
      .flatMap((entry): EquipmentFaq[] => {
        if (!entry || typeof entry !== "object") return [];
        const { question, answer } = entry as Record<string, unknown>;
        if (typeof question !== "string" || typeof answer !== "string") return [];
        const normalizedQuestion = question.trim();
        const normalizedAnswer = answer.trim();
        if (!normalizedQuestion || !normalizedAnswer) return [];
        if (normalizedQuestion.length > MAX_FIELD_LENGTH || normalizedAnswer.length > MAX_FIELD_LENGTH) return [];
        const questionKey = normalizedQuestion.replace(/\s+/g, " ").toLocaleLowerCase();
        if (seenQuestions.has(questionKey)) return [];
        seenQuestions.add(questionKey);
        return [{ question: normalizedQuestion, answer: normalizedAnswer }];
      });
  } catch {
    return [];
  }
}

export function parseEquipmentFaqDrafts(raw: string | null | undefined): EquipmentFaq[] {
  if (!raw?.trim()) return [];

  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    return parsed.slice(0, MAX_EQUIPMENT_FAQS).flatMap((entry): EquipmentFaq[] => {
      if (!entry || typeof entry !== "object") return [];
      const { question, answer } = entry as Record<string, unknown>;
      if (typeof question !== "string" || typeof answer !== "string") return [];
      if (question.length > MAX_FIELD_LENGTH || answer.length > MAX_FIELD_LENGTH) return [];
      return [{ question, answer }];
    });
  } catch {
    return [];
  }
}

export function isEquipmentFaqJson(raw: string): boolean {
  return raw.length <= 120_000 && (raw.trim() === "" || parseEquipmentFaqs(raw).length > 0 || raw.trim() === "[]");
}

export function getLocalizedEquipmentFaqs(item: EquipmentFaqSource, lang: "ko" | "en" | "ja" | "zh" | "zh-TW"): EquipmentFaq[] {
  const localizedRaw = {
    ko: item.faqs,
    en: item.faqsEn,
    ja: item.faqsJa,
    zh: item.faqsZh,
    "zh-TW": item.faqsZhTw,
  }[lang];
  const localizedFaqs = parseEquipmentFaqs(localizedRaw);
  return localizedFaqs.length > 0 ? localizedFaqs : parseEquipmentFaqs(item.faqs);
}
