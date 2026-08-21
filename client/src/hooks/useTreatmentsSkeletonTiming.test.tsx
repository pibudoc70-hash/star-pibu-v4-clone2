import { render } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import {
  TREATMENTS_SKELETON_DURATION_MEASURE,
  TREATMENTS_SKELETON_VISIBLE_MARK,
  useTreatmentsSkeletonTiming,
} from "./useTreatmentsSkeletonTiming";

const { trackTreatmentsSkeleton } = vi.hoisted(() => ({ trackTreatmentsSkeleton: vi.fn() }));

vi.mock("@/lib/webVitals", () => ({ trackTreatmentsSkeleton }));

function TimingProbe({ visible }: { visible: boolean }) {
  useTreatmentsSkeletonTiming(visible);
  return null;
}

describe("useTreatmentsSkeletonTiming", () => {
  afterEach(() => {
    trackTreatmentsSkeleton.mockReset();
    vi.restoreAllMocks();
  });

  it("initial skeleton이 query settled로 끝날 때 한 번만 익명 duration을 기록한다", () => {
    const mark = vi.spyOn(performance, "mark");
    const measure = vi.spyOn(performance, "measure");
    const { rerender } = render(<TimingProbe visible />);

    rerender(<TimingProbe visible={false} />);

    expect(mark).toHaveBeenCalledWith(TREATMENTS_SKELETON_VISIBLE_MARK);
    expect(measure).toHaveBeenCalledWith(TREATMENTS_SKELETON_DURATION_MEASURE, expect.objectContaining({
      start: TREATMENTS_SKELETON_VISIBLE_MARK,
    }));
    expect(trackTreatmentsSkeleton).toHaveBeenCalledTimes(1);
    expect(trackTreatmentsSkeleton).toHaveBeenCalledWith(expect.any(Number));
  });

  it("unmount 때 local performance mark와 measure를 cleanup한다", () => {
    const clearMarks = vi.spyOn(performance, "clearMarks");
    const clearMeasures = vi.spyOn(performance, "clearMeasures");
    const { unmount } = render(<TimingProbe visible />);

    unmount();

    expect(clearMarks).toHaveBeenCalledWith(TREATMENTS_SKELETON_VISIBLE_MARK);
    expect(clearMeasures).toHaveBeenCalledWith(TREATMENTS_SKELETON_DURATION_MEASURE);
  });
});
