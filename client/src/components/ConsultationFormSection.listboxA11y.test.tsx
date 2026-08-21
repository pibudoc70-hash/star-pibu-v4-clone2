import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import ConsultationFormSection from "./ConsultationFormSection";

vi.mock("@/lib/trpc", () => ({
  trpc: {
    consultation: {
      submit: {
        useMutation: () => ({ mutate: vi.fn(), isPending: false }),
      },
    },
  },
}));

vi.mock("@/contexts/LangContext", () => ({
  useLang: () => ({
    t: {
      consultation: {
        title: "Consultation",
        eyebrow: "Consultation",
        subtitle: "Tell us about your concern.",
        nameLabel: "Name",
        namePlaceholder: "Name",
        phoneLabel: "Phone",
        phonePlaceholder: "010-0000-0000",
        concernLabel: "Concern",
        concernPlaceholder: "Select a concern",
        concerns: ["Lifting"],
        messageLabel: "Message",
        messagePlaceholder: "Message",
        privacyLabel: "Privacy",
        privacyLink: "Privacy policy",
        errorRequired: "Required",
        errorPhone: "Invalid phone",
        errorMessage: "Please enter at least 5 characters.",
        errorPrivacy: "Privacy consent is required.",
        errorGeneric: "Unable to send your consultation. Please try again later.",
        errorRateLimit: "Too many requests. Please try again later.",
        submitBtn: "Send consultation",
        submitting: "Sending",
        successTitle: "Sent",
        successDesc: "Thank you",
        successNote: "We will contact you.",
        resetBtn: "Send another",
      },
    },
  }),
}));

describe("ConsultationFormSection concern listbox accessibility", () => {
  it("uses a native button option and preserves concern selection", async () => {
    const user = userEvent.setup();
    render(<ConsultationFormSection />);

    const combobox = screen.getByRole("combobox");
    await user.click(combobox);

    const option = screen.getByRole("option", { name: "Lifting" });
    expect(option.tagName).toBe("BUTTON");
    expect(option).toHaveAttribute("type", "button");

    await user.click(option);
    expect(combobox).toHaveTextContent("Lifting");
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });
});
