from __future__ import annotations

import json
from pathlib import Path

from fontTools.ttLib import TTFont

ASSET_DIR = Path("/home/ubuntu/webdev-static-assets")
SYMBOLS = ["─", "々", "✅", "❌", "⚕", "✨", "⚡", "✦", "⭐", "⏳", "☰", "✈", "⏱"]
FONTS = {
    "latin": ASSET_DIR / "PretendardVariable-latin-subset.woff2",
    "primary": ASSET_DIR / "PretendardVariable-korean-primary.woff2",
    "secondary": ASSET_DIR / "PretendardVariable-korean-secondary.woff2",
}


def codepoints(path: Path) -> set[int]:
    font = TTFont(path)
    return {
        point
        for table in font["cmap"].tables
        if table.isUnicode()
        for point in table.cmap
    }


print(json.dumps({
    name: {symbol: ord(symbol) in codepoints(path) for symbol in SYMBOLS}
    for name, path in FONTS.items()
}, ensure_ascii=False, indent=2))
