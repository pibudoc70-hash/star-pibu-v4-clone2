#!/usr/bin/env python3
"""
effect/sessions 번역 누락 항목 패치 스크립트 v2
라인 기반으로 처리: effect: "..." 라인 다음에 effectEn/Ja/Zh 삽입
"""

with open('client/src/components/TreatmentsEquipmentSection.tsx', 'r') as f:
    lines = f.readlines()

effect_translations = {
    "피부 탄력 개선, 리프팅, 주름 감소": ("Improved skin elasticity, lifting, wrinkle reduction", "肌の弾力改善、リフティング、シワ軽減", "改善皮肤弹力、提升、减少皱纹"),
    "눈밑 지방 제거, 다크서클 개선, 자연스러운 윤곽": ("Under-eye fat removal, dark circle improvement, natural contour", "目の下の脂肪除去、クマ改善、自然な輪郭形成", "去除眼下脂肪、改善黑眼圈、自然轮廓"),
    "눈밑 지방 감소, 피부 탄력 개선, 다크서클 완화": ("Under-eye fat reduction, skin elasticity improvement, dark circle relief", "目の下の脂肪軽減、肌弾力改善、クマ緩和", "减少眼下脂肪、改善皮肤弹力、缓解黑眼圈"),
    "한관종 제거, 피부결 개선": ("Syringoma removal, skin texture improvement", "汗管腫除去、肌質改善", "去除汗管瘤、改善肌肤质感"),
    "색소 병변 제거, 피부 톤 균일화": ("Pigment lesion removal, skin tone evening", "色素病変除去、肌トーン均一化", "去除色素病变、均匀肤色"),
    "홍조 개선, 혈관 확장 치료, 피부 진정": ("Redness improvement, vascular dilation treatment, skin soothing", "赤み改善、血管拡張治療、肌鎮静", "改善潮红、治疗血管扩张、镇静肌肤"),
    "여드름 개선, 피지 조절, 피부 진정": ("Acne improvement, sebum control, skin soothing", "ニキビ改善、皮脂コントロール、肌鎮静", "改善痤疮、控制皮脂、镇静肌肤"),
    "흉터 개선, 피부 재생, 피부결 개선": ("Scar improvement, skin regeneration, skin texture improvement", "傷跡改善、肌再生、肌質改善", "改善疤痕、皮肤再生、改善肌肤质感"),
    "탈모 개선, 두피 건강 증진": ("Hair loss improvement, scalp health promotion", "抜け毛改善、頭皮健康促進", "改善脱发、促进头皮健康"),
    "체형 개선, 지방 감소, 피부 탄력 개선": ("Body shape improvement, fat reduction, skin elasticity improvement", "体型改善、脂肪軽減、肌弾力改善", "改善体型、减少脂肪、改善皮肤弹力"),
    "백반증 색소 재생, 피부 톤 균일화": ("Vitiligo pigment regeneration, skin tone evening", "白斑色素再生、肌トーン均一化", "白癜风色素再生、均匀肤色"),
    "피부 탄력 개선, 볼륨 보충, 주름 개선": ("Skin elasticity improvement, volume replenishment, wrinkle improvement", "肌弾力改善、ボリューム補充、シワ改善", "改善皮肤弹力、补充容量、改善皱纹"),
    "피부 탄력 및 리프팅 효과": ("Skin elasticity and lifting effect", "肌弾力とリフティング効果", "皮肤弹力和提升效果"),
    "피부 탄력 개선, 주름 감소, 리프팅": ("Skin elasticity improvement, wrinkle reduction, lifting", "肌弾力改善、シワ軽減、リフティング", "改善皮肤弹力、减少皱纹、提升"),
    "문신 제거, 색소 병변 치료": ("Tattoo removal, pigment lesion treatment", "タトゥー除去、色素病変治療", "去除纹身、治疗色素病变"),
    "피부 탄력 개선, 피부결 개선": ("Skin elasticity improvement, skin texture improvement", "肌弾力改善、肌質改善", "改善皮肤弹力、改善肌肤质感"),
    "피부 재생, 탄력 개선, 모공 축소": ("Skin regeneration, elasticity improvement, pore reduction", "肌再生、弾力改善、毛穴縮小", "皮肤再生、改善弹力、缩小毛孔"),
    "리프팅, 탄력 개선, 주름 완화": ("Lifting, elasticity improvement, wrinkle relief", "リフティング、弾力改善、シワ緩和", "提升、改善弹力、缓解皱纹"),
    "색소 침착 개선, 피부 톤 균일화": ("Pigmentation improvement, skin tone evening", "色素沈着改善、肌トーン均一化", "改善色素沉着、均匀肤色"),
    "피부 재생, 흉터 개선, 피부결 개선": ("Skin regeneration, scar improvement, skin texture improvement", "肌再生、傷跡改善、肌質改善", "皮肤再生、改善疤痕、改善肌肤质感"),
}

sessions_translations = {
    "1회 (수술)": ("1 session (surgery)", "1回（手術）", "1次（手术）"),
    "1~3회": ("1–3 sessions", "1〜3回", "1~3次"),
    "3~5회": ("3–5 sessions", "3〜5回", "3~5次"),
    "5~10회": ("5–10 sessions", "5〜10回", "5~10次"),
    "10~20회": ("10–20 sessions", "10〜20回", "10~20次"),
    "1~2회": ("1–2 sessions", "1〜2回", "1~2次"),
    "2~4회": ("2–4 sessions", "2〜4回", "2~4次"),
    "4~6회": ("4–6 sessions", "4〜6回", "4~6次"),
    "6~12회": ("6–12 sessions", "6〜12回", "6~12次"),
    "1회": ("1 session", "1回", "1次"),
    "2~3회": ("2–3 sessions", "2〜3回", "2~3次"),
    "3~6회": ("3–6 sessions", "3〜6回", "3~6次"),
    "6~10회": ("6–10 sessions", "6〜10回", "6~10次"),
    "4~8회": ("4–8 sessions", "4〜8回", "4~8次"),
    "1~4회": ("1–4 sessions", "1〜4回", "1~4次"),
    "3~4회": ("3–4 sessions", "3〜4回", "3~4次"),
    "5~8회": ("5–8 sessions", "5〜8回", "5~8次"),
    "8~12회": ("8–12 sessions", "8〜12回", "8~12次"),
    "개인별 상이": ("Varies by individual", "個人差あり", "因人而异"),
    "월 1회, 3~6개월": ("Once monthly, 3–6 months", "月1回、3〜6ヶ月", "每月1次，3~6个月"),
    "주 1~2회, 10~20회": ("1–2 times weekly, 10–20 sessions", "週1〜2回、10〜20回", "每周1~2次，10~20次"),
    "주 2~3회": ("2–3 times weekly", "週2〜3回", "每周2~3次"),
    "월 1~2회": ("1–2 times monthly", "月1〜2回", "每月1~2次"),
    "2~6회": ("2–6 sessions", "2〜6回", "2~6次"),
    "3~8회": ("3–8 sessions", "3〜8回", "3~8次"),
    "5~15회": ("5–15 sessions", "5〜15回", "5~15次"),
    "10~15회": ("10–15 sessions", "10〜15回", "10~15次"),
}

new_lines = []
i = 0
effect_patched = 0
sessions_patched = 0

while i < len(lines):
    line = lines[i]
    stripped = line.rstrip()
    indent = len(line) - len(line.lstrip())
    indent_str = ' ' * indent

    # effect: "..." 라인 처리
    if '        effect: "' in line and 'effectJa:' not in line:
        # 다음 라인에 effectJa가 없는지 확인
        next_line = lines[i+1] if i+1 < len(lines) else ''
        if 'effectJa:' not in next_line:
            # 값 추출
            import re
            m = re.search(r'effect: "([^"]+)"', line)
            if m:
                val = m.group(1)
                if val in effect_translations:
                    en, ja, zh = effect_translations[val]
                    new_lines.append(line)
                    new_lines.append(f'{indent_str}effectEn: "{en}",\n')
                    new_lines.append(f'{indent_str}effectJa: "{ja}",\n')
                    new_lines.append(f'{indent_str}effectZh: "{zh}",\n')
                    effect_patched += 1
                    i += 1
                    continue

    # sessions: "..." 라인 처리
    if '        sessions: "' in line and 'sessionsJa:' not in line:
        next_line = lines[i+1] if i+1 < len(lines) else ''
        if 'sessionsJa:' not in next_line:
            import re
            m = re.search(r'sessions: "([^"]+)"', line)
            if m:
                val = m.group(1)
                if val in sessions_translations:
                    en, ja, zh = sessions_translations[val]
                    new_lines.append(line)
                    new_lines.append(f'{indent_str}sessionsEn: "{en}",\n')
                    new_lines.append(f'{indent_str}sessionsJa: "{ja}",\n')
                    new_lines.append(f'{indent_str}sessionsZh: "{zh}",\n')
                    sessions_patched += 1
                    i += 1
                    continue

    new_lines.append(line)
    i += 1

with open('client/src/components/TreatmentsEquipmentSection.tsx', 'w') as f:
    f.writelines(new_lines)

print(f'effect 패치: {effect_patched}개')
print(f'sessions 패치: {sessions_patched}개')

# 결과 확인
import re
with open('client/src/components/TreatmentsEquipmentSection.tsx', 'r') as f:
    content = f.read()
effects = re.findall(r'effect: "([^"]+)"', content)
effects_ja = re.findall(r'effectJa: "([^"]+)"', content)
sessions = re.findall(r'sessions: "([^"]+)"', content)
sessions_ja = re.findall(r'sessionsJa: "([^"]+)"', content)
print(f'effect 총 {len(effects)}개, effectJa 총 {len(effects_ja)}개')
print(f'sessions 총 {len(sessions)}개, sessionsJa 총 {len(sessions_ja)}개')
