#!/usr/bin/env python3
"""
effect/sessions 번역 누락 항목 패치 스크립트
- effect가 있지만 effectJa가 없는 항목에 JA/ZH 번역 추가
- sessions가 있지만 sessionsJa가 없는 항목에 JA/ZH 번역 추가
"""
import re

with open('client/src/components/TreatmentsEquipmentSection.tsx', 'r') as f:
    content = f.read()

# effect 번역 데이터 (한국어 → JA/ZH)
effect_translations = {
    "피부 탄력 개선, 리프팅, 주름 감소": {
        "en": "Improved skin elasticity, lifting, wrinkle reduction",
        "ja": "肌の弾力改善、リフティング、シワ軽減",
        "zh": "改善皮肤弹力、提升、减少皱纹"
    },
    "눈밑 지방 제거, 다크서클 개선, 자연스러운 윤곽": {
        "en": "Under-eye fat removal, dark circle improvement, natural contour",
        "ja": "目の下の脂肪除去、クマ改善、自然な輪郭形成",
        "zh": "去除眼下脂肪、改善黑眼圈、自然轮廓"
    },
    "눈밑 지방 감소, 피부 탄력 개선, 다크서클 완화": {
        "en": "Under-eye fat reduction, skin elasticity improvement, dark circle relief",
        "ja": "目の下の脂肪軽減、肌弾力改善、クマ緩和",
        "zh": "减少眼下脂肪、改善皮肤弹力、缓解黑眼圈"
    },
    "한관종 제거, 피부결 개선": {
        "en": "Syringoma removal, skin texture improvement",
        "ja": "汗管腫除去、肌質改善",
        "zh": "去除汗管瘤、改善肌肤质感"
    },
    "색소 병변 제거, 피부 톤 균일화": {
        "en": "Pigment lesion removal, skin tone evening",
        "ja": "色素病変除去、肌トーン均一化",
        "zh": "去除色素病变、均匀肤色"
    },
    "홍조 개선, 혈관 확장 치료, 피부 진정": {
        "en": "Redness improvement, vascular dilation treatment, skin soothing",
        "ja": "赤み改善、血管拡張治療、肌鎮静",
        "zh": "改善潮红、治疗血管扩张、镇静肌肤"
    },
    "여드름 개선, 피지 조절, 피부 진정": {
        "en": "Acne improvement, sebum control, skin soothing",
        "ja": "ニキビ改善、皮脂コントロール、肌鎮静",
        "zh": "改善痤疮、控制皮脂、镇静肌肤"
    },
    "흉터 개선, 피부 재생, 피부결 개선": {
        "en": "Scar improvement, skin regeneration, skin texture improvement",
        "ja": "傷跡改善、肌再生、肌質改善",
        "zh": "改善疤痕、皮肤再生、改善肌肤质感"
    },
    "탈모 개선, 두피 건강 증진": {
        "en": "Hair loss improvement, scalp health promotion",
        "ja": "抜け毛改善、頭皮健康促進",
        "zh": "改善脱发、促进头皮健康"
    },
    "체형 개선, 지방 감소, 피부 탄력 개선": {
        "en": "Body shape improvement, fat reduction, skin elasticity improvement",
        "ja": "体型改善、脂肪軽減、肌弾力改善",
        "zh": "改善体型、减少脂肪、改善皮肤弹力"
    },
    "백반증 색소 재생, 피부 톤 균일화": {
        "en": "Vitiligo pigment regeneration, skin tone evening",
        "ja": "白斑色素再生、肌トーン均一化",
        "zh": "白癜风色素再生、均匀肤色"
    },
    "피부 탄력 개선, 볼륨 보충, 주름 개선": {
        "en": "Skin elasticity improvement, volume replenishment, wrinkle improvement",
        "ja": "肌弾力改善、ボリューム補充、シワ改善",
        "zh": "改善皮肤弹力、补充容量、改善皱纹"
    },
    "피부 탄력 및 리프팅 효과": {
        "en": "Skin elasticity and lifting effect",
        "ja": "肌弾力とリフティング効果",
        "zh": "皮肤弹力和提升效果"
    },
    "피부 탄력 개선, 주름 감소, 리프팅": {
        "en": "Skin elasticity improvement, wrinkle reduction, lifting",
        "ja": "肌弾力改善、シワ軽減、リフティング",
        "zh": "改善皮肤弹力、减少皱纹、提升"
    },
    "문신 제거, 색소 병변 치료": {
        "en": "Tattoo removal, pigment lesion treatment",
        "ja": "タトゥー除去、色素病変治療",
        "zh": "去除纹身、治疗色素病变"
    },
}

# sessions 번역 데이터 (한국어 → JA/ZH)
sessions_translations = {
    "1회 (수술)": {
        "en": "1 session (surgery)",
        "ja": "1回（手術）",
        "zh": "1次（手术）"
    },
    "1~3회": {
        "en": "1–3 sessions",
        "ja": "1〜3回",
        "zh": "1~3次"
    },
    "3~5회": {
        "en": "3–5 sessions",
        "ja": "3〜5回",
        "zh": "3~5次"
    },
    "5~10회": {
        "en": "5–10 sessions",
        "ja": "5〜10回",
        "zh": "5~10次"
    },
    "10~20회": {
        "en": "10–20 sessions",
        "ja": "10〜20回",
        "zh": "10~20次"
    },
    "1~2회": {
        "en": "1–2 sessions",
        "ja": "1〜2回",
        "zh": "1~2次"
    },
    "2~4회": {
        "en": "2–4 sessions",
        "ja": "2〜4回",
        "zh": "2~4次"
    },
    "4~6회": {
        "en": "4–6 sessions",
        "ja": "4〜6回",
        "zh": "4~6次"
    },
    "6~12회": {
        "en": "6–12 sessions",
        "ja": "6〜12回",
        "zh": "6~12次"
    },
    "1회": {
        "en": "1 session",
        "ja": "1回",
        "zh": "1次"
    },
    "2~3회": {
        "en": "2–3 sessions",
        "ja": "2〜3回",
        "zh": "2~3次"
    },
    "3~6회": {
        "en": "3–6 sessions",
        "ja": "3〜6回",
        "zh": "3~6次"
    },
    "6~10회": {
        "en": "6–10 sessions",
        "ja": "6〜10回",
        "zh": "6~10次"
    },
    "4~8회": {
        "en": "4–8 sessions",
        "ja": "4〜8回",
        "zh": "4~8次"
    },
    "1~4회": {
        "en": "1–4 sessions",
        "ja": "1〜4回",
        "zh": "1~4次"
    },
    "3~4회": {
        "en": "3–4 sessions",
        "ja": "3〜4回",
        "zh": "3~4次"
    },
    "5~8회": {
        "en": "5–8 sessions",
        "ja": "5〜8回",
        "zh": "5~8次"
    },
    "8~12회": {
        "en": "8–12 sessions",
        "ja": "8〜12回",
        "zh": "8~12次"
    },
    "개인별 상이": {
        "en": "Varies by individual",
        "ja": "個人差あり",
        "zh": "因人而异"
    },
    "월 1회, 3~6개월": {
        "en": "Once monthly, 3–6 months",
        "ja": "月1回、3〜6ヶ月",
        "zh": "每月1次，3~6个月"
    },
    "주 1~2회, 10~20회": {
        "en": "1–2 times weekly, 10–20 sessions",
        "ja": "週1〜2回、10〜20回",
        "zh": "每周1~2次，10~20次"
    },
}

patch_count = 0

def patch_effect(match):
    global patch_count
    block = match.group(0)
    effect_val_match = re.search(r'effect: "([^"]+)"', block)
    if not effect_val_match:
        return block
    effect_val = effect_val_match.group(1)
    if 'effectJa:' in block:
        return block
    if effect_val not in effect_translations:
        return block
    tr = effect_translations[effect_val]
    # effect: "..." 다음에 effectEn/Ja/Zh 삽입
    new_block = re.sub(
        r'(effect: "[^"]+",)',
        lambda m: m.group(0) + f'\n        effectEn: "{tr["en"]}",\n        effectJa: "{tr["ja"]}",\n        effectZh: "{tr["zh"]}",',
        block,
        count=1
    )
    if new_block != block:
        patch_count += 1
    return new_block

def patch_sessions(match):
    global patch_count
    block = match.group(0)
    sessions_val_match = re.search(r'sessions: "([^"]+)"', block)
    if not sessions_val_match:
        return block
    sessions_val = sessions_val_match.group(1)
    if 'sessionsJa:' in block:
        return block
    if sessions_val not in sessions_translations:
        return block
    tr = sessions_translations[sessions_val]
    # sessions: "..." 다음에 sessionsEn/Ja/Zh 삽입
    new_block = re.sub(
        r'(sessions: "[^"]+",)',
        lambda m: m.group(0) + f'\n        sessionsEn: "{tr["en"]}",\n        sessionsJa: "{tr["ja"]}",\n        sessionsZh: "{tr["zh"]}",',
        block,
        count=1
    )
    if new_block != block:
        patch_count += 1
    return new_block

# Treatment 블록을 찾아서 패치
# effect 패치
treatment_pattern = re.compile(r'\{[^{}]*?effect: "[^"]*"[^{}]*?\}', re.DOTALL)
content = treatment_pattern.sub(patch_effect, content)

# sessions 패치
patch_count = 0
treatment_pattern2 = re.compile(r'\{[^{}]*?sessions: "[^"]*"[^{}]*?\}', re.DOTALL)
content = treatment_pattern2.sub(patch_sessions, content)

with open('client/src/components/TreatmentsEquipmentSection.tsx', 'w') as f:
    f.write(content)

# 결과 확인
with open('client/src/components/TreatmentsEquipmentSection.tsx', 'r') as f:
    new_content = f.read()

effects = re.findall(r'effect: "([^"]+)"', new_content)
effects_ja = re.findall(r'effectJa: "([^"]+)"', new_content)
sessions = re.findall(r'sessions: "([^"]+)"', new_content)
sessions_ja = re.findall(r'sessionsJa: "([^"]+)"', new_content)
print(f'패치 완료')
print(f'effect 총 {len(effects)}개, effectJa 총 {len(effects_ja)}개')
print(f'sessions 총 {len(sessions)}개, sessionsJa 총 {len(sessions_ja)}개')
