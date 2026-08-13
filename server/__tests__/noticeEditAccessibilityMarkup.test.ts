import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";

const source = fs.readFileSync(
  path.resolve(__dirname, "../../client/src/pages/NoticeEdit.tsx"),
  "utf-8",
);

describe("공지 편집 접근성 마크업", () => {
  it("이미지 업로드 드롭 영역은 키보드 조작 가능한 button을 사용한다", () => {
    expect(source).toContain('<button\n                type="button"\n                onDragOver={handleDragOver}');
    expect(source).toContain('id="notice-image-upload"');
    expect(source).toContain('onClick={() => fileInputRef.current?.click()}');
    expect(source).toContain('</button>\n              <input\n                id="notice-image-upload"');
  });

  it("상단 고정 설명은 switch button과 연결되고 독립 클릭 핸들러를 두지 않는다", () => {
    expect(source).toContain('id="notice-pinned"');
    expect(source).toContain('<Label htmlFor="notice-pinned"');
    expect(source).not.toContain('<label\n                onClick={() => setIsPinned(!isPinned)}');
  });
});
