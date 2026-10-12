import { beforeEach, describe, expect, it, vi } from "vitest";
import type { TrpcContext } from "../_core/context";

const { invokeLLM } = vi.hoisted(() => ({ invokeLLM: vi.fn() }));

vi.mock("../_core/llm", () => ({ invokeLLM }));

import { equipment3Router } from "./equipment3";

function createAdminContext(): TrpcContext {
  return {
    user: {
      id: 1,
      openId: "admin-test",
      name: "Admin",
      email: "admin@example.com",
      loginMethod: "manus",
      role: "admin",
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    },
    req: {} as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

const sourceFaqs = JSON.stringify([
  {
    question: "시술 후 바로 일상생활이 가능한가요?",
    answer: "개인 상태에 따라 다를 수 있으며 상담 후 결정합니다.",
  },
]);

const translatedFaqs = {
  en: [{ question: "Can I return to daily activities right after treatment?", answer: "This may vary depending on your condition and is determined after consultation." }],
  ja: [{ question: "施術後すぐに日常生活へ戻れますか？", answer: "個人の状態により異なり、診察後に決定します。" }],
  zh: [{ question: "治疗后可以马上恢复日常生活吗？", answer: "因个人情况而异，需在咨询后决定。" }],
  zhTw: [{ question: "療程後可以立即恢復日常生活嗎？", answer: "會因個人狀況而異，需於諮詢後決定。" }],
};

describe("equipment3.autoTranslate FAQ translations", () => {
  beforeEach(() => {
    invokeLLM.mockReset();
  });

  it("translates Korean FAQ entries to all four localized FAQ fields with a structured response", async () => {
    invokeLLM.mockResolvedValueOnce({
      choices: [{ message: { content: JSON.stringify(translatedFaqs) } }],
    });
    const caller = equipment3Router.createCaller(createAdminContext());

    const result = await caller.autoTranslate({ faqs: sourceFaqs });

    expect(result.translations).toEqual({ en: {}, ja: {}, zh: {} });
    expect(result.faqTranslations).toEqual({
      en: JSON.stringify(translatedFaqs.en),
      ja: JSON.stringify(translatedFaqs.ja),
      zh: JSON.stringify(translatedFaqs.zh),
      zhTw: JSON.stringify(translatedFaqs.zhTw),
    });
    expect(invokeLLM).toHaveBeenCalledWith(expect.objectContaining({
      response_format: expect.objectContaining({ type: "json_schema" }),
    }));
  });

  it("clears every localized FAQ value without an LLM call when the Korean FAQ list is empty", async () => {
    const caller = equipment3Router.createCaller(createAdminContext());

    const result = await caller.autoTranslate({ faqs: "[]" });

    expect(result.faqTranslations).toEqual({ en: "[]", ja: "[]", zh: "[]", zhTw: "[]" });
    expect(invokeLLM).not.toHaveBeenCalled();
  });
});
