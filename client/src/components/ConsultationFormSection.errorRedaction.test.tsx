import { act, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { afterEach, describe, expect, it, vi } from "vitest";
import ConsultationFormSection from "./ConsultationFormSection";

type MutationOptions = {
  onError?: (error: Error) => void;
  onSuccess?: () => void;
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
    window.turnstile = undefined;
    document.body.innerHTML = "";
  });

  it.each([
    {
      rawMessage: "Failed to connect mysql://admin:secret@internal-db:3306/production",
      prohibited: ["mysql://", "internal-db", "secret"],
    },
    {
      rawMessage: "TURNSTILE_SECRET_KEY invalid: sk-secret-value",
      prohibited: ["TURNSTILE_SECRET_KEY", "sk-secret-value"],
    },
    {
      rawMessage: "Error at /app/server/routers/consultation.ts:205",
      prohibited: ["/app/server/", "consultation.ts:205"],
    },
    {
      rawMessage: "upstream failed with token=super-secret-token",
      prohibited: ["super-secret-token"],
    },
  ])("shows the locale generic error without exposing raw backend detail: $rawMessage", async ({ rawMessage, prohibited }) => {
    render(<ConsultationFormSection />);

    await act(async () => {
      mutationOptions?.onError?.(new Error(rawMessage));
    });

    expect(screen.getByRole("alert")).toHaveTextContent("Unable to send your consultation. Please try again later.");
    expect(document.body).not.toHaveTextContent(rawMessage);
    for (const value of prohibited) {
      expect(document.body).not.toHaveTextContent(value);
    }
  });

  it("resets Turnstile while keeping its raw security failure detail out of the DOM", async () => {
    const reset = vi.fn();
    window.turnstile = {
      render: vi.fn(() => "turnstile-widget"),
      reset,
      remove: vi.fn(),
    };

    render(<ConsultationFormSection />);

    await act(async () => {
      mutationOptions?.onError?.(new Error("TURNSTILE_SECRET_KEY invalid: sk-secret-value"));
    });

    expect(reset).toHaveBeenCalledWith("turnstile-widget");
    expect(screen.getByRole("alert")).toHaveTextContent("Unable to send your consultation. Please try again later.");
    expect(document.body).not.toHaveTextContent("sk-secret-value");
  });

  it("keeps the locale rate-limit message for clearly identifiable rate errors", async () => {
    render(<ConsultationFormSection />);

    await act(async () => {
      mutationOptions?.onError?.(new Error("too many requests"));
    });

    expect(screen.getByRole("alert")).toHaveTextContent("Too many requests. Please try again later.");
    expect(document.body).not.toHaveTextContent("too many requests");
  });

  it("keeps the existing success UI when the consultation mutation succeeds", async () => {
    render(<ConsultationFormSection />);

    await act(async () => {
      mutationOptions?.onSuccess?.();
    });

    expect(screen.getByRole("heading", { name: "Sent" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Send another" })).toBeInTheDocument();
  });
});
