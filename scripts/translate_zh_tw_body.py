"""Translate Korea-source equipment3 bodies into Taiwan Traditional Chinese with strict JSON QA."""

from __future__ import annotations

import concurrent.futures
import json
import os
import re
import sys
import time
from pathlib import Path

from openai import OpenAI

SOURCE_FIELDS = ["desc", "detail", "effect", "caution", "sessions", "time", "recovery"]
KOREAN_RE = re.compile(r"[\uac00-\ud7af]")
NUMBER_RE = re.compile(r"\d+")
SIMPLIFIED_ONLY_RE = re.compile(r"[疗术肤医复适发诊际为与后会个这时无开关处见过还让说读门间阳阴]", re.IGNORECASE)
PROHIBITED_RE = re.compile(r"保证|最佳|最有效|永久|百分之百")


def field_schema() -> dict:
    return {
        "type": "object",
        "properties": {field: {"type": "string"} for field in SOURCE_FIELDS},
        "required": SOURCE_FIELDS,
        "additionalProperties": False,
    }


SYSTEM_PROMPT = """You are a senior Taiwan Traditional Chinese medical-content localizer for Star Dermatology in Busan, Korea.
Translate Korean dermatology treatment copy for readers in Taiwan. This is localization, not mechanical Simplified-to-Traditional conversion.
Use Taiwan medical terms, such as 皮膚科、療程、雷射、諮詢、恢復期、乾癬, where appropriate.
Keep the supplied Taiwan treatment name exactly as written when it appears in the source or needs to be referenced.
Never add claims, rankings, guarantees, new indications, durations, adverse effects, or anesthesia details not present in the Korean source.
Preserve every number, range, unit, frequency, wavelength, and percentage exactly. Preserve Markdown structure and line breaks where meaningful.
Keep device model codes exactly, including every numeric character (for example, RE20 must remain RE20, never RE2O).
Do not output 永久, 完全, 保證, 最佳, 最有效, or equivalent guarantee/superlative wording. If the Korean source has certainty or superiority wording, neutralize it as a factual, non-guarantee medical explanation and state that suitability or outcomes may vary individually when appropriate.
Do not leave Korean or Simplified Chinese characters. Keep any individual-difference qualification in the source.
Return only the requested JSON object."""


def translate_one(client: OpenAI, item: dict) -> dict:
    request = {
        "treatment_name_ko": item["nameKo"],
        "treatment_name_zh_tw": item["nameZhTw"],
        "fields": item["source"],
        "required_numeric_tokens_by_field": {
            field: NUMBER_RE.findall(item["source"].get(field, "") or "")
            for field in SOURCE_FIELDS
        },
    }
    for attempt in range(3):
        try:
            response = client.chat.completions.create(
                model=os.environ.get("TRANSLATION_MODEL", "gpt-5-mini"),
                messages=[
                    {"role": "system", "content": SYSTEM_PROMPT},
                    {"role": "user", "content": json.dumps(request, ensure_ascii=False)},
                ],
                response_format={
                    "type": "json_schema",
                    "json_schema": {
                        "name": "taiwan_equipment_body",
                        "strict": True,
                        "schema": field_schema(),
                    },
                },
                max_completion_tokens=4000,
            )
            content = response.choices[0].message.content
            if not content:
                raise ValueError("empty model response")
            translated = json.loads(content)
            return {"id": item["id"], "slug": item["slug"], "source": item["source"], "translation": translated}
        except Exception as exc:  # retry only bounded transient model failures
            if attempt == 2:
                raise RuntimeError(f"id={item['id']} failed after retries: {exc}") from exc
            time.sleep(2 ** attempt)
    raise AssertionError("unreachable")


def validate_item(item: dict) -> list[str]:
    errors: list[str] = []
    for field in SOURCE_FIELDS:
        source = item["source"].get(field, "") or ""
        translated = item["translation"].get(field, "") or ""
        if not source.strip() and translated:
            errors.append(f"{field}: expected empty translation for empty source")
        if source.strip() and not translated.strip():
            errors.append(f"{field}: missing translation")
        if KOREAN_RE.search(translated):
            errors.append(f"{field}: Korean character remains")
        if SIMPLIFIED_ONLY_RE.search(translated):
            errors.append(f"{field}: Simplified Chinese character remains")
        if PROHIBITED_RE.search(translated):
            errors.append(f"{field}: prohibited guarantee/superlative expression")
        if NUMBER_RE.findall(source) != NUMBER_RE.findall(translated):
            errors.append(f"{field}: numeric tokens differ {NUMBER_RE.findall(source)} != {NUMBER_RE.findall(translated)}")
    return errors


def main() -> None:
    if len(sys.argv) not in (3, 4):
        raise SystemExit("Usage: translate_zh_tw_body.py INPUT_JSON OUTPUT_JSON [PRIOR_OUTPUT_JSON]")
    source_path = Path(sys.argv[1])
    output_path = Path(sys.argv[2])
    source_items = json.loads(source_path.read_text())
    if len(source_items) != 72:
        raise ValueError(f"Expected 72 items, received {len(source_items)}")

    prior_output = json.loads(Path(sys.argv[3]).read_text()) if len(sys.argv) == 4 else None
    retry_ids = {int(item_id) for item_id in (prior_output or {}).get("qaErrors", {})}
    if prior_output and not retry_ids:
        raise ValueError("Prior output contains no QA failures to retry")
    retained = [] if not prior_output else [item for item in prior_output["items"] if item["id"] not in retry_ids]
    pending_items = source_items if not prior_output else [item for item in source_items if item["id"] in retry_ids]

    client = OpenAI()
    results: list[dict] = retained
    with concurrent.futures.ThreadPoolExecutor(max_workers=3) as executor:
        futures = {executor.submit(translate_one, client, item): item["id"] for item in pending_items}
        for future in concurrent.futures.as_completed(futures):
            results.append(future.result())

    results.sort(key=lambda item: item["id"])
    qa_errors = {str(item["id"]): validate_item(item) for item in results}
    qa_errors = {item_id: errors for item_id, errors in qa_errors.items() if errors}
    output = {"itemCount": len(results), "items": results, "qaErrors": qa_errors}
    output_path.write_text(json.dumps(output, ensure_ascii=False, indent=2) + "\n")
    print(json.dumps({"outputPath": str(output_path), "itemCount": len(results), "qaFailureCount": len(qa_errors)}, ensure_ascii=False))
    if qa_errors:
        raise SystemExit(1)


if __name__ == "__main__":
    main()
