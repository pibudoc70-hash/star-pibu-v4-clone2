import { act, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { afterEach, describe, expect, it, vi } from "vitest";
import ConsultationFormSection from "./ConsultationFormSection";

type MutationOptions = {
  onError?: (error: Error) => void;
};

let mutationOptions: MutationOptions | undefined;

vi.mock("@/lib/trpc", () => ({
  trpc: {
    consultation: {
      submit: {
        useMutation: (options: MutationOptions) => {
          mutationOptions = options;
          return { mutate: vi.fn(), isPending: false };
        },
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

describe("ConsultationFormSection error redaction", () => {
  afterEach(() => {
    mutationOptions = undefined;
    document.body.innerHTML = "";
  });

  it.each([
    "mysql://admin:secret@db.internal:3306/clinic",
    "upstream failed with token=super-secret-token",
    "request failed at api.internal.example",
    "unexpected backend exception",
    "Turnstile token validation failed: internal detail",
  ])("shows the locale generic error without exposing raw backend detail: %s", async (rawMessage) => {
    render(<ConsultationFormSection />);

    await act(async () => {
      mutationOptions?.onError?.(new Error(rawMessage));
    });

    expect(screen.getByRole("alert")).toHaveTextContent("Unable to send your consultation. Please try again later.");
    expect(document.body).not.toHaveTextContent(rawMessage);
  });

  it("keeps the locale rate-limit message for clearly identifiable rate errors", async () => {
    render(<ConsultationFormSection />);

    await act(async () => {
      mutationOptions?.onError?.(new Error("too many requests"));
    });

    expect(screen.getByRole("alert")).toHaveTextContent("Too many requests. Please try again later.");
    expect(document.body).not.toHaveTextContent("too many requests");
  });
});
