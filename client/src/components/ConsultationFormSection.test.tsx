import { fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import ConsultationFormSection from "./ConsultationFormSection";

const rawError = "Database connection failed: mysql://user:secret@internal-host";
let onError: ((error: Error) => void) | undefined;

vi.mock("@/lib/trpc", () => ({
  trpc: {
    consultation: {
      submit: {
        useMutation: (options: { onError: (error: Error) => void }) => {
          onError = options.onError;
          return { isPending: false, mutate: vi.fn(() => onError?.(new Error(rawError))) };
        },
      },
    },
  },
}));

vi.mock("@/contexts/LangContext", () => ({
  useLang: () => ({
    t: {
      consultation: {
        eyebrow: "Consultation",
        title: "Consultation form",
        subtitle: "Tell us about your concern",
        nameLabel: "Name",
        namePlaceholder: "Your name",
        phoneLabel: "Phone",
        phonePlaceholder: "010-0000-0000",
        concernLabel: "Concern",
        concernPlaceholder: "Choose a concern",
        concerns: ["Skin"],
        messageLabel: "Message",
        messagePlaceholder: "Your message",
        privacyLabel: "Privacy consent",
        privacyLink: "Privacy policy",
        submitBtn: "Submit",
        submitting: "Submitting",
        errorRequired: "Required",
        errorPhone: "Invalid phone",
        errorMessage: "Message is too short",
        errorPrivacy: "Privacy consent is required",
        errorGeneric: "A safe generic error occurred.",
        errorRateLimit: "Too many requests.",
        successTitle: "Sent",
        successDesc: "Success",
        successNote: "Note",
        resetBtn: "Reset",
      },
    },
  }),
}));

describe("ConsultationFormSection error safety", () => {
  beforeEach(() => {
    window.turnstile = {
      render: vi.fn((_container: string | HTMLElement, options: { callback?: (token: string) => void }) => {
        options.callback?.("test-turnstile-token");
        return "widget";
      }),
      reset: vi.fn(),
      remove: vi.fn(),
    };
  });

  it("never renders an unknown server error message after a valid submission", () => {
    render(<ConsultationFormSection />);

    fireEvent.change(screen.getByLabelText(/Name/), { target: { value: "Jane" } });
    fireEvent.change(screen.getByLabelText(/Phone/), { target: { value: "01012345678" } });
    fireEvent.click(screen.getByRole("combobox", { name: "Concern" }));
    fireEvent.click(screen.getByRole("option", { name: "Skin" }));
    fireEvent.change(screen.getByLabelText(/Message/), { target: { value: "Please contact me." } });
    fireEvent.click(screen.getByRole("checkbox"));
    fireEvent.click(screen.getByRole("button", { name: "Submit" }));

    expect(screen.getByRole("alert")).toHaveTextContent("A safe generic error occurred.");
    expect(document.body).not.toHaveTextContent(rawError);
    expect(document.body).not.toHaveTextContent("mysql://");
    expect(document.body).not.toHaveTextContent("secret");
    expect(document.body).not.toHaveTextContent("internal-host");
  });
});
