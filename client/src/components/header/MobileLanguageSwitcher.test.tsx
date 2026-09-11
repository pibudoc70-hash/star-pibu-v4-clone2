import { createRef } from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { describe, expect, it, vi } from "vitest";
import MobileLanguageSwitcher from "./MobileLanguageSwitcher";

const options = [
  { lang: "ko" as const, label: "한국어", flag: "🇰🇷" },
  { lang: "en" as const, label: "English", flag: "🇺🇸" },
  { lang: "ja" as const, label: "日本語", flag: "🇯🇵" },
  { lang: "zh" as const, label: "中文(简)", flag: "🇨🇳" },
  { lang: "zh-TW" as const, label: "繁體中文", flag: "🇹🇼" },
];

function renderSwitcher(overrides: Partial<React.ComponentProps<typeof MobileLanguageSwitcher>> = {}) {
  const setLangDropOpen = vi.fn();
  const handleLangChange = vi.fn();
  render(
    <MobileLanguageSwitcher
      lang="ko"
      langOptions={options}
      currentLangOption={options[0]}
      langDropOpen={false}
      setLangDropOpen={setLangDropOpen}
      langDropRef={createRef<HTMLDivElement>()}
      langTriggerRef={createRef<HTMLButtonElement>()}
      handleLangChange={handleLangChange}
      scrolled={false}
      {...overrides}
    />,
  );
  return { setLangDropOpen, handleLangChange };
}

describe("MobileLanguageSwitcher", () => {
  it("provides a 44px independent mobile trigger and requests its disclosure to open", () => {
    const { setLangDropOpen } = renderSwitcher();
    const trigger = screen.getByRole("button", { name: "언어 선택" });

    expect(trigger).toHaveAttribute("aria-controls", "mobile-language-menu");
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(trigger).toHaveStyle({ minWidth: "44px", height: "44px" });

    fireEvent.click(trigger);
    expect(setLangDropOpen).toHaveBeenCalledWith(true);
  });

  it("shows each language outside the drawer and delegates the chosen locale", () => {
    const { handleLangChange } = renderSwitcher({ langDropOpen: true });
    const listbox = screen.getByRole("listbox", { name: "언어 목록" });

    expect(listbox).toHaveAttribute("id", "mobile-language-menu");
    expect(screen.getByRole("option", { name: /한국어/ })).toHaveAttribute("aria-selected", "true");
    const english = screen.getByRole("option", { name: /English/ });
    fireEvent.click(english);
    expect(handleLangChange).toHaveBeenCalledWith(options[1]);
  });
});
