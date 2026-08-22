import { render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import ErrorBoundary from "./ErrorBoundary";

const sensitiveStack = [
  "Error: database connection failed",
  "    at /home/ubuntu/star-pibu-v4-clone/server/db/connection.ts:42:11",
  "    DATABASE_URL=mysql://user:secret@internal.example/private",
].join("\n");

function ThrowingChild(): never {
  const error = new Error("database connection failed");
  error.stack = sensitiveStack;
  throw error;
}

describe("ErrorBoundary", () => {
  const consoleError = vi.spyOn(console, "error").mockImplementation(() => undefined);

  afterEach(() => {
    consoleError.mockClear();
  });

  it("renders an accessible generic recovery UI without exposing the thrown stack", () => {
    render(
      <ErrorBoundary>
        <ThrowingChild />
      </ErrorBoundary>,
    );

    expect(screen.getByRole("alert").textContent).toContain("예기치 않은 오류가 발생했습니다.");
    expect(screen.getByRole("button", { name: "페이지 새로고침" })).not.toBeNull();
    expect(document.body.textContent).not.toContain("DATABASE_URL=mysql://");
    expect(document.body.textContent).not.toContain("connection.ts:42:11");
  });
});
