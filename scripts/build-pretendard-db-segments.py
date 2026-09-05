from __future__ import annotations

import json
import subprocess
from pathlib import Path

from fontTools.ttLib import TTFont

PROJECT_ROOT = Path(__file__).resolve().parents[1]
ASSET_DIR = Path("/home/ubuntu/webdev-static-assets")
FONT_PATH = ASSET_DIR / "PretendardVariable-original.woff2"
AUDIT_PATH = PROJECT_ROOT / "reports/korean-glyph-audit.json"
REPORT_PATH = PROJECT_ROOT / "reports/pretendard-db-segment-manifest.json"
PRIMARY_OUTPUT = ASSET_DIR / "PretendardVariable-korean-primary.woff2"
SECONDARY_OUTPUT = ASSET_DIR / "PretendardVariable-korean-secondary.woff2"
CSS_OUTPUT = ASSET_DIR / "PretendardVariable-korean-db-segments.css"
PRIMARY_URL = "/manus-storage/PretendardVariable-korean-primary_693508b2.woff2"
SECONDARY_URL = "/manus-storage/PretendardVariable-korean-secondary_441758ac.woff2"

HANGUL_START = 0xAC00
HANGUL_END = 0xD7A3
COMPAT_JAMO = range(0x3130, 0x3190)
JAMO = range(0x1100, 0x1200)


def compress_ranges(codepoints: set[int]) -> list[str]:
    ranges: list[str] = []
    ordered = sorted(codepoints)
    if not ordered:
        return ranges
    start = previous = ordered[0]
    for codepoint in ordered[1:]:
        if codepoint == previous + 1:
            previous = codepoint
            continue
        ranges.append(format_range(start, previous))
        start = previous = codepoint
    ranges.append(format_range(start, previous))
    return ranges


def format_range(start: int, end: int) -> str:
    if start == end:
        return f"U+{start:04X}"
    return f"U+{start:04X}-{end:04X}"


def write_charset(path: Path, codepoints: set[int]) -> None:
    path.write_text("".join(chr(codepoint) for codepoint in sorted(codepoints)), encoding="utf-8")


def font_face(url: str, unicode_ranges: list[str]) -> str:
    return "\n".join([
        "@font-face {",
        '  font-family: "Pretendard Web";',
        "  font-weight: 45 920;",
        "  font-style: normal;",
        "  font-display: swap;",
        f'  src: url("{url}") format("woff2-variations");',
        f"  unicode-range: {', '.join(unicode_ranges)};",
        "}",
    ])


def subset(source: Path, output: Path, codepoints: set[int]) -> None:
    unicodes = ",".join(f"U+{codepoint:04X}" for codepoint in sorted(codepoints))
    subprocess.run(
        [
            "pyftsubset",
            str(source),
            f"--output-file={output}",
            "--flavor=woff2",
            f"--unicodes={unicodes}",
            "--layout-features=*",
            "--name-IDs=*",
            "--name-legacy",
            "--name-languages=*",
            "--glyph-names",
            "--symbol-cmap",
            "--legacy-cmap",
            "--notdef-glyph",
            "--notdef-outline",
            "--recommended-glyphs",
        ],
        check=True,
    )


def output_codepoints(path: Path) -> set[int]:
    font = TTFont(path)
    return {
        point
        for table in font["cmap"].tables
        if table.isUnicode()
        for point in table.cmap
    }


def main() -> None:
    if not FONT_PATH.exists():
        raise FileNotFoundError(f"Missing Pretendard source font: {FONT_PATH}")
    audit = json.loads(AUDIT_PATH.read_text(encoding="utf-8"))
    audited_primary = set(audit["primarySubset"]["codePoints"])
    primary_syllables = {point for point in audited_primary if HANGUL_START <= point <= HANGUL_END}
    if primary_syllables != audited_primary:
        raise ValueError("Glyph audit contains non-Hangul code points in primarySubset.codePoints")

    all_syllables = set(range(HANGUL_START, HANGUL_END + 1))
    secondary_syllables = all_syllables - primary_syllables
    if primary_syllables & secondary_syllables:
        raise ValueError("Primary and secondary Hangul sets overlap")
    if primary_syllables | secondary_syllables != all_syllables:
        raise ValueError("Primary and secondary Hangul sets do not cover the full syllable block")

    # Preserve only jamo that the source font actually owns; do not declare unsupported codepoints.
    source_supported = output_codepoints(FONT_PATH)
    supported_jamo = (set(COMPAT_JAMO) | set(JAMO)) & source_supported
    primary_codepoints = primary_syllables | supported_jamo
    primary_charset = ASSET_DIR / "PretendardVariable-korean-primary.charset.txt"
    secondary_charset = ASSET_DIR / "PretendardVariable-korean-secondary.charset.txt"
    write_charset(primary_charset, primary_codepoints)
    write_charset(secondary_charset, secondary_syllables)
    subset(FONT_PATH, PRIMARY_OUTPUT, primary_codepoints)
    subset(FONT_PATH, SECONDARY_OUTPUT, secondary_syllables)
    primary_output_missing = primary_codepoints - output_codepoints(PRIMARY_OUTPUT)
    secondary_output_missing = secondary_syllables - output_codepoints(SECONDARY_OUTPUT)
    if primary_output_missing or secondary_output_missing:
        raise ValueError("Generated font output does not cover its declared codepoints")

    primary_ranges = compress_ranges(primary_syllables)
    jamo_ranges = compress_ranges(supported_jamo)
    secondary_ranges = compress_ranges(secondary_syllables)
    primary_unicode_ranges = [*jamo_ranges, *primary_ranges]
    CSS_OUTPUT.write_text(
        "/* Generated from reports/korean-glyph-audit.json. Do not hand-edit. */\n\n"
        + font_face(PRIMARY_URL, primary_unicode_ranges)
        + "\n\n"
        + font_face(SECONDARY_URL, secondary_ranges)
        + "\n",
        encoding="utf-8",
    )
    manifest = {
        "sourceFont": str(FONT_PATH),
        "audit": str(AUDIT_PATH),
        "hangulSyllableRange": "U+AC00-D7A3",
        "primary": {
            "file": str(PRIMARY_OUTPUT),
            "hangulSyllables": len(primary_syllables),
            "jamoCodePoints": len(supported_jamo),
            "unicodeRange": primary_unicode_ranges,
            "sizeBytes": PRIMARY_OUTPUT.stat().st_size,
        },
        "secondary": {
            "file": str(SECONDARY_OUTPUT),
            "hangulSyllables": len(secondary_syllables),
            "unicodeRange": secondary_ranges,
            "sizeBytes": SECONDARY_OUTPUT.stat().st_size,
        },
        "validation": {
            "overlapHangulSyllables": len(primary_syllables & secondary_syllables),
            "missingHangulSyllables": len(all_syllables - (primary_syllables | secondary_syllables)),
            "primaryAuditCoverageMissing": len(primary_syllables - audited_primary),
            "primaryOutputCoverageMissing": len(primary_output_missing),
            "secondaryOutputCoverageMissing": len(secondary_output_missing),
        },
    }
    REPORT_PATH.write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(json.dumps({
        "primaryBytes": manifest["primary"]["sizeBytes"],
        "secondaryBytes": manifest["secondary"]["sizeBytes"],
        "primaryHangulSyllables": manifest["primary"]["hangulSyllables"],
        "secondaryHangulSyllables": manifest["secondary"]["hangulSyllables"],
        "primaryRanges": len(manifest["primary"]["unicodeRange"]),
        "secondaryRanges": len(manifest["secondary"]["unicodeRange"]),
        "validation": manifest["validation"],
    }, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
