from __future__ import annotations

import json
import sys
from pathlib import Path

from translate_zh_tw_body import validate_item


if len(sys.argv) != 3:
    raise SystemExit("Usage: validate_zh_tw_body_translations.py INPUT_JSON OUTPUT_JSON")

input_path = Path(sys.argv[1])
output_path = Path(sys.argv[2])
payload = json.loads(input_path.read_text())
errors = {str(item["id"]): validate_item(item) for item in payload["items"]}
payload["qaErrors"] = {item_id: failures for item_id, failures in errors.items() if failures}
output_path.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n")
print(json.dumps({"itemCount": len(payload["items"]), "qaFailureCount": len(payload["qaErrors"])}, ensure_ascii=False))
if payload["qaErrors"]:
    raise SystemExit(1)
