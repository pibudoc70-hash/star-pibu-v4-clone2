import { render } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import {
  EVENT_SKELETON_DURATION_MEASURE,
  EVENT_SKELETON_VISIBLE_MARK,
  useEventSkeletonTiming,
} from "./useEventSkeletonTiming";

const { trackEventSkeleton } = vi.hoisted(() => ({ trackEventSkeleton: vi.fn() }));

vi.mock("@/lib/webVitals", () => ({ trackEventSkeleton }));

function TimingProbe({ visible }: { visible: boolean }) {
  useEventSkeletonTiming(visible);
  return null;
}

describe("useEventSkeletonTiming", () => {
  afterEach(() => {
    trackEventSkeleton.mockReset();
    vi.restoreAllMocks();
  });

  it("initial skeleton이 query settled로 끝날 때 한 번만 익명 duration을 기록한다", () => {
    const mark = vi.spyOn(performance, "mark");
    const measure = vi.spyOn(performance, "measure");
    const { rerender } = render(<TimingProbe visible />);

    rerender(<TimingProbe visible={false} />);

    expect(mark).toHaveBeenCalledWith(EVENT_SKELETON_VISIBLE_MARK);
    expect(measure).toHaveBeenCalledWith(EVENT_SKELETON_DURATION_MEASURE, expect.objectContaining({
      start: EVENT_SKELETON_VISIBLE_MARK,
    }));
    expect(trackEventSkeleton).toHaveBeenCalledTimes(1);
    expect(trackEventSkeleton).toHaveBeenCalledWith(expect.any(Number));
  });

  it("unmount 때 local performance mark와 measure를 cleanup한다", () => {
    const clearMarks = vi.spyOn(performance, "clearMarks");
    const clearMeasures = vi.spyOn(performance, "clearMeasures");
    const { unmount } = render(<TimingProbe visible />);

    unmount();

    expect(clearMarks).toHaveBeenCalledWith(EVENT_SKELETON_VISIBLE_MARK);
    expect(clearMeasures).toHaveBeenCalledWith(EVENT_SKELETON_DURATION_MEASURE);
  });

  it("fresh 또는 stale cached data처럼 skeleton이 처음부터 없으면 metric을 전송하지 않는다", () => {
    render(<TimingProbe visible={false} />);

    expect(trackEventSkeleton).not.toHaveBeenCalled();
  });
});
