import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { describe, expect, it, vi } from "vitest";
import AdminYouTube from "./AdminYouTube";

const videoData = [{
  id: 1,
  title: "관리자 테스트 영상",
  videoId: "dQw4w9WgXcQ",
  type: "video" as const,
  sortOrder: 1,
  isActive: "1",
}];

const mutationState = { mutate: vi.fn(), isPending: false };

vi.mock("@/_core/hooks/useAuth", () => ({
  useAuth: () => ({ user: { id: 1, role: "admin" } }),
}));

vi.mock("wouter", () => ({
  useLocation: () => ["/admin/youtube", vi.fn()],
}));

vi.mock("@/lib/trpc", () => ({
  trpc: {
    youtube: {
      getAll: {
        useQuery: () => ({ data: videoData, refetch: vi.fn() }),
      },
    },
    admin: {
      youtube: {
        create: { useMutation: () => mutationState },
        update: { useMutation: () => mutationState },
        delete: { useMutation: () => mutationState },
        reorder: { useMutation: () => mutationState },
      },
    },
  },
}));

describe("AdminYouTube 렌더 안정성", () => {
  it("Dnd accessibility wrapper를 tbody 밖에 두고 노출 제어 행을 안정적으로 렌더한다", async () => {
    const { container } = render(<AdminYouTube />);

    expect(await screen.findByRole("button", { name: "관리자 테스트 영상 노출 숨기기" })).toBeInTheDocument();
    expect(container.querySelector("tbody > div")).toBeNull();
    expect(container.querySelectorAll("tbody > tr")).toHaveLength(1);
    expect(screen.getByRole("columnheader", { name: "노출" })).toBeInTheDocument();
  });
});
