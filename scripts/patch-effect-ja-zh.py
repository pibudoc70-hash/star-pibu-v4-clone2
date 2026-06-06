#!/usr/bin/env python3
"""
effectEn이 있지만 effectJa/effectZh가 없는 항목에 JA/ZH 번역 추가
sessionsEn이 있지만 sessionsJa/sessionsZh가 없는 항목에 JA/ZH 번역 추가
"""

# 한국어 effect 값 → JA/ZH 번역 매핑
effect_ja_zh = {
    "얼굴 리프팅, 피부 탄력 개선, 주름 완화, 피부 재생, 수분 보충": ("顔のリフティング、肌弾力改善、シワ緩和、肌再生、水分補充", "面部提升、改善皮肤弹力、缓解皱纹、皮肤再生、补充水分"),
    "피부 탄력 개선, 얼굴 리프팅, 콜라겐·엘라스틴 생성, 주름 완화, 피부 조직 강화": ("肌弾力改善、顔リフティング、コラーゲン・エラスチン生成、シワ緩和、肌組織強化", "改善皮肤弹力、面部提升、促进胶原蛋白和弹性蛋白生成、缓解皱纹、强化皮肤组织"),
    "볼 볼륨 회복, 팔자주름 개선, 피부 탄력 향상, 콜라겐 생성 유도, 2년 이상 효과 지속": ("頬ボリューム回復、法令線改善、肌弾力向上、コラーゲン生成誘導、2年以上効果持続", "恢复面颊容量、改善法令纹、提升皮肤弹力、诱导胶原蛋白生成、效果持续2年以上"),
    "피부 재생, 탄력 개선, 수분 보충, 피부결 정돈, 노화 개선": ("肌再生、弾力改善、水分補充、肌質整頓、老化改善", "皮肤再生、改善弹力、补充水分、整理肌肤质感、改善老化"),
    "여드름 흉터 개선, 패인 흉터 볼륨 회복, 피부 재생, 콜라겐 생성 유도": ("ニキビ跡改善、陥没傷跡ボリューム回復、肌再生、コラーゲン生成誘導", "改善痤疮疤痕、恢复凹陷疤痕容量、皮肤再生、诱导胶原蛋白生成"),
    "안면홍조 개선, 모세혈관 확장 감소, 피부 붉기 완화, 주사비(로사세아) 치료": ("顔面紅潮改善、毛細血管拡張軽減、肌の赤み緩和、酒さ（ロザセア）治療", "改善面部潮红、减少毛细血管扩张、缓解皮肤发红、治疗玫瑰痤疮"),
    "기미·잡티 개선, 피부 톤 밝기, 색소 침착 방지, 혈관 트러블 동시 개선": ("シミ・くすみ改善、肌トーン明るく、色素沈着防止、血管トラブル同時改善", "改善黄褐斑和色斑、提亮肤色、防止色素沉着、同时改善血管问题"),
    "얼굴 리프팅, 턱선 개선, 피부 탄력 향상, 주름 완화, SMAS층 자극": ("顔リフティング、フェイスライン改善、肌弾力向上、シワ緩和、SMAS層刺激", "面部提升、改善下颌线、提升皮肤弹力、缓解皱纹、刺激SMAS层"),
    "피부 탄력 개선, 얼굴 리프팅, 주름 완화, 콜라겐 재생, 눈가·목 탄력 개선": ("肌弾力改善、顔リフティング、シワ緩和、コラーゲン再生、目元・首の弾力改善", "改善皮肤弹力、面部提升、缓解皱纹、胶原蛋白再生、改善眼角和颈部弹力"),
    "얼굴 리프팅, 피부 탄력 개선, 주름 완화, 턱선 개선": ("顔リフティング、肌弾力改善、シワ緩和、フェイスライン改善", "面部提升、改善皮肤弹力、缓解皱纹、改善下颌线"),
    "얼굴 리프팅, 턱선 개선, 피부 탄력 향상, SMAS층 자극, 주름 완화": ("顔リフティング、フェイスライン改善、肌弾力向上、SMAS層刺激、シワ緩和", "面部提升、改善下颌线、提升皮肤弹力、刺激SMAS层、缓解皱纹"),
    "피부 탄력 개선, 얼굴 리프팅, 콜라겐·엘라스틴 생성, 주름 완화": ("肌弾力改善、顔リフティング、コラーゲン・エラスチン生成、シワ緩和", "改善皮肤弹力、面部提升、促进胶原蛋白和弹性蛋白生成、缓解皱纹"),
    "얼굴 리프팅, 피부 탄력 개선, 얼굴 윤곽 개선, 주름 완화": ("顔リフティング、肌弾力改善、顔の輪郭改善、シワ緩和", "面部提升、改善皮肤弹力、改善面部轮廓、缓解皱纹"),
    "피부 탄력 개선, 모공 축소, 콜라겐 생성 유도, 여드름 흉터 개선": ("肌弾力改善、毛穴縮小、コラーゲン生成誘導、ニキビ跡改善", "改善皮肤弹力、缩小毛孔、诱导胶原蛋白生成、改善痤疮疤痕"),
    "피부 재생, 탄력 개선, 모공 축소, 여드름 흉터 개선, 피부결 개선": ("肌再生、弾力改善、毛穴縮小、ニキビ跡改善、肌質改善", "皮肤再生、改善弹力、缩小毛孔、改善痤疮疤痕、改善肌肤质感"),
    "색소 병변 제거, 피부 재생, 피부결 개선": ("色素病変除去、肌再生、肌質改善", "去除色素病变、皮肤再生、改善肌肤质感"),
    "여드름 치료, 피지 조절, 염증 완화, 피부 재생": ("ニキビ治療、皮脂コントロール、炎症緩和、肌再生", "治疗痤疮、控制皮脂、缓解炎症、皮肤再生"),
    "흉터 개선, 피부 재생, 피부결 개선, 모공 축소": ("傷跡改善、肌再生、肌質改善、毛穴縮小", "改善疤痕、皮肤再生、改善肌肤质感、缩小毛孔"),
    "색소 침착 개선, 피부 톤 균일화, 피부 재생": ("色素沈着改善、肌トーン均一化、肌再生", "改善色素沉着、均匀肤色、皮肤再生"),
    "두피 혈액순환 개선, 탈모 완화, 모발 성장 촉진": ("頭皮血液循環改善、抜け毛緩和、毛髪成長促進", "改善头皮血液循环、缓解脱发、促进毛发生长"),
    "체지방 감소, 피부 탄력 개선, 셀룰라이트 감소": ("体脂肪軽減、肌弾力改善、セルライト軽減", "减少体脂肪、改善皮肤弹力、减少橘皮组织"),
    "백반증 색소 재생, 피부 톤 균일화, 면역 조절": ("白斑色素再生、肌トーン均一化、免疫調節", "白癜风色素再生、均匀肤色、调节免疫"),
    "문신 제거, 색소 병변 치료, 피부 재생": ("タトゥー除去、色素病変治療、肌再生", "去除纹身、治疗色素病变、皮肤再生"),
    "피부 탄력 개선, 리프팅, 주름 감소": ("肌弾力改善、リフティング、シワ軽減", "改善皮肤弹力、提升、减少皱纹"),
    "눈밑 지방 제거, 다크서클 개선, 자연스러운 윤곽": ("目の下の脂肪除去、クマ改善、自然な輪郭形成", "去除眼下脂肪、改善黑眼圈、自然轮廓"),
    "눈밑 지방 감소, 피부 탄력 개선, 다크서클 완화": ("目の下の脂肪軽減、肌弾力改善、クマ緩和", "减少眼下脂肪、改善皮肤弹力、缓解黑眼圈"),
    "한관종 제거, 피부결 개선": ("汗管腫除去、肌質改善", "去除汗管瘤、改善肌肤质感"),
    "색소 병변 제거, 피부 톤 균일화": ("色素病変除去、肌トーン均一化", "去除色素病变、均匀肤色"),
    "홍조 개선, 혈관 확장 치료, 피부 진정": ("赤み改善、血管拡張治療、肌鎮静", "改善潮红、治疗血管扩张、镇静肌肤"),
    "여드름 개선, 피지 조절, 피부 진정": ("ニキビ改善、皮脂コントロール、肌鎮静", "改善痤疮、控制皮脂、镇静肌肤"),
    "흉터 개선, 피부 재생, 피부결 개선": ("傷跡改善、肌再生、肌質改善", "改善疤痕、皮肤再生、改善肌肤质感"),
    "탈모 개선, 두피 건강 증진": ("抜け毛改善、頭皮健康促進", "改善脱发、促进头皮健康"),
    "체형 개선, 지방 감소, 피부 탄력 개선": ("体型改善、脂肪軽減、肌弾力改善", "改善体型、减少脂肪、改善皮肤弹力"),
    "백반증 색소 재생, 피부 톤 균일화": ("白斑色素再生、肌トーン均一化", "白癜风色素再生、均匀肤色"),
    "피부 탄력 개선, 볼륨 보충, 주름 개선": ("肌弾力改善、ボリューム補充、シワ改善", "改善皮肤弹力、补充容量、改善皱纹"),
    "피부 탄력 및 리프팅 효과": ("肌弾力とリフティング効果", "皮肤弹力和提升效果"),
    "피부 탄력 개선, 주름 감소, 리프팅": ("肌弾力改善、シワ軽減、リフティング", "改善皮肤弹力、减少皱纹、提升"),
    "문신 제거, 색소 병변 치료": ("タトゥー除去、色素病変治療", "去除纹身、治疗色素病变"),
    "피부 탄력 개선, 피부결 개선": ("肌弾力改善、肌質改善", "改善皮肤弹力、改善肌肤质感"),
    "리프팅, 탄력 개선, 주름 완화": ("リフティング、弾力改善、シワ緩和", "提升、改善弹力、缓解皱纹"),
    "색소 침착 개선, 피부 톤 균일화": ("色素沈着改善、肌トーン均一化", "改善色素沉着、均匀肤色"),
    "피부 재생, 흉터 개선, 피부결 개선": ("肌再生、傷跡改善、肌質改善", "皮肤再生、改善疤痕、改善肌肤质感"),
}

sessions_ja_zh = {
    "1회 (수술)": ("1回（手術）", "1次（手术）"),
    "1~3회": ("1〜3回", "1~3次"),
    "3~5회": ("3〜5回", "3~5次"),
    "5~10회": ("5〜10回", "5~10次"),
    "10~20회": ("10〜20回", "10~20次"),
    "1~2회": ("1〜2回", "1~2次"),
    "2~4회": ("2〜4回", "2~4次"),
    "4~6회": ("4〜6回", "4~6次"),
    "6~12회": ("6〜12回", "6~12次"),
    "1회": ("1回", "1次"),
    "2~3회": ("2〜3回", "2~3次"),
    "3~6회": ("3〜6回", "3~6次"),
    "6~10회": ("6〜10回", "6~10次"),
    "4~8회": ("4〜8回", "4~8次"),
    "1~4회": ("1〜4回", "1~4次"),
    "3~4회": ("3〜4回", "3~4次"),
    "5~8회": ("5〜8回", "5~8次"),
    "8~12회": ("8〜12回", "8~12次"),
    "개인별 상이": ("個人差あり", "因人而异"),
    "월 1회, 3~6개월": ("月1回、3〜6ヶ月", "每月1次，3~6个月"),
    "주 1~2회, 10~20회": ("週1〜2回、10〜20回", "每周1~2次，10~20次"),
    "주 2~3회": ("週2〜3回", "每周2~3次"),
    "월 1~2회": ("月1〜2回", "每月1~2次"),
    "2~6회": ("2〜6回", "2~6次"),
    "3~8회": ("3〜8回", "3~8次"),
    "5~15회": ("5〜15回", "5~15次"),
    "10~15회": ("10〜15回", "10~15次"),
    "2~5회": ("2〜5回", "2~5次"),
    "4~10회": ("4〜10回", "4~10次"),
    "6~8회": ("6〜8回", "6~8次"),
    "12~24회": ("12〜24回", "12~24次"),
}

with open('client/src/components/TreatmentsEquipmentSection.tsx', 'r') as f:
    lines = f.readlines()

new_lines = []
i = 0
effect_patched = 0
sessions_patched = 0

import re

while i < len(lines):
    line = lines[i]

    # effectEn이 있지만 effectJa가 없는 경우
    if '        effectEn: "' in line:
        # 다음 라인에 effectJa가 없는지 확인
        next_line = lines[i+1] if i+1 < len(lines) else ''
        if 'effectJa:' not in next_line:
            # 이전 라인에서 effect 한국어 값 찾기
            # effectEn 라인 앞에 effect: "..." 라인이 있어야 함
            ko_val = None
            for j in range(max(0, i-3), i):
                m = re.search(r'effect: "([^"]+)"', lines[j])
                if m:
                    ko_val = m.group(1)
                    break
            if ko_val and ko_val in effect_ja_zh:
                ja, zh = effect_ja_zh[ko_val]
                new_lines.append(line)
                indent = len(line) - len(line.lstrip())
                indent_str = ' ' * indent
                new_lines.append(f'{indent_str}effectJa: "{ja}",\n')
                new_lines.append(f'{indent_str}effectZh: "{zh}",\n')
                effect_patched += 1
                i += 1
                continue

    # sessionsEn이 있지만 sessionsJa가 없는 경우
    if '        sessionsEn: "' in line:
        next_line = lines[i+1] if i+1 < len(lines) else ''
        if 'sessionsJa:' not in next_line:
            ko_val = None
            for j in range(max(0, i-3), i):
                m = re.search(r'sessions: "([^"]+)"', lines[j])
                if m:
                    ko_val = m.group(1)
                    break
            if ko_val and ko_val in sessions_ja_zh:
                ja, zh = sessions_ja_zh[ko_val]
                new_lines.append(line)
                indent = len(line) - len(line.lstrip())
                indent_str = ' ' * indent
                new_lines.append(f'{indent_str}sessionsJa: "{ja}",\n')
                new_lines.append(f'{indent_str}sessionsZh: "{zh}",\n')
                sessions_patched += 1
                i += 1
                continue

    # effect: "..." 라인이 있고 effectEn도 effectJa도 없는 경우
    if '        effect: "' in line and 'effectEn' not in line:
        next_line = lines[i+1] if i+1 < len(lines) else ''
        if 'effectEn:' not in next_line and 'effectJa:' not in next_line:
            m = re.search(r'effect: "([^"]+)"', line)
            if m:
                ko_val = m.group(1)
                if ko_val in effect_ja_zh:
                    ja, zh = effect_ja_zh[ko_val]
                    # EN도 추가
                    en_map = {
                        "얼굴 리프팅, 피부 탄력 개선, 주름 완화, 피부 재생, 수분 보충": "Facial lifting, skin elasticity improvement, wrinkle reduction, skin regeneration, hydration",
                        "피부 탄력 개선, 얼굴 리프팅, 콜라겐·엘라스틴 생성, 주름 완화, 피부 조직 강화": "Skin elasticity improvement, facial lifting, collagen & elastin production, wrinkle reduction, skin tissue strengthening",
                        "볼 볼륨 회복, 팔자주름 개선, 피부 탄력 향상, 콜라겐 생성 유도, 2년 이상 효과 지속": "Cheek volume restoration, nasolabial fold improvement, skin elasticity enhancement, collagen production induction, effects lasting 2+ years",
                        "피부 재생, 탄력 개선, 수분 보충, 피부결 정돈, 노화 개선": "Skin regeneration, elasticity improvement, hydration, skin texture refinement, aging improvement",
                        "여드름 흉터 개선, 패인 흉터 볼륨 회복, 피부 재생, 콜라겐 생성 유도": "Acne scar improvement, sunken scar volume restoration, skin regeneration, collagen production induction",
                        "안면홍조 개선, 모세혈관 확장 감소, 피부 붉기 완화, 주사비(로사세아) 치료": "Facial redness improvement, telangiectasia reduction, skin redness relief, rosacea treatment",
                        "기미·잡티 개선, 피부 톤 밝기, 색소 침착 방지, 혈관 트러블 동시 개선": "Melasma & age spot improvement, skin tone brightening, pigmentation prevention, simultaneous vascular problem improvement",
                        "얼굴 리프팅, 턱선 개선, 피부 탄력 향상, 주름 완화, SMAS층 자극": "Facial lifting, jawline improvement, skin elasticity enhancement, wrinkle reduction, SMAS layer stimulation",
                        "피부 탄력 개선, 얼굴 리프팅, 주름 완화, 콜라겐 재생, 눈가·목 탄력 개선": "Skin elasticity improvement, facial lifting, wrinkle reduction, collagen regeneration, eye and neck elasticity improvement",
                        "얼굴 리프팅, 피부 탄력 개선, 주름 완화, 턱선 개선": "Facial lifting, skin elasticity improvement, wrinkle reduction, jawline improvement",
                        "얼굴 리프팅, 턱선 개선, 피부 탄력 향상, SMAS층 자극, 주름 완화": "Facial lifting, jawline improvement, skin elasticity enhancement, SMAS layer stimulation, wrinkle reduction",
                        "피부 탄력 개선, 얼굴 리프팅, 콜라겐·엘라스틴 생성, 주름 완화": "Skin elasticity improvement, facial lifting, collagen & elastin production, wrinkle reduction",
                        "얼굴 리프팅, 피부 탄력 개선, 얼굴 윤곽 개선, 주름 완화": "Facial lifting, skin elasticity improvement, facial contour improvement, wrinkle reduction",
                        "피부 탄력 개선, 모공 축소, 콜라겐 생성 유도, 여드름 흉터 개선": "Skin elasticity improvement, pore reduction, collagen production induction, acne scar improvement",
                    }
                    indent = len(line) - len(line.lstrip())
                    indent_str = ' ' * indent
                    new_lines.append(line)
                    if ko_val in en_map:
                        new_lines.append(f'{indent_str}effectEn: "{en_map[ko_val]}",\n')
                    new_lines.append(f'{indent_str}effectJa: "{ja}",\n')
                    new_lines.append(f'{indent_str}effectZh: "{zh}",\n')
                    effect_patched += 1
                    i += 1
                    continue

    # sessions: "..." 라인이 있고 sessionsEn도 sessionsJa도 없는 경우
    if '        sessions: "' in line and 'sessionsEn' not in line:
        next_line = lines[i+1] if i+1 < len(lines) else ''
        if 'sessionsEn:' not in next_line and 'sessionsJa:' not in next_line:
            m = re.search(r'sessions: "([^"]+)"', line)
            if m:
                ko_val = m.group(1)
                if ko_val in sessions_ja_zh:
                    ja, zh = sessions_ja_zh[ko_val]
                    indent = len(line) - len(line.lstrip())
                    indent_str = ' ' * indent
                    new_lines.append(line)
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
with open('client/src/components/TreatmentsEquipmentSection.tsx', 'r') as f:
    content = f.read()
effects = re.findall(r'effect: "([^"]+)"', content)
effects_ja = re.findall(r'effectJa: "([^"]+)"', content)
sessions = re.findall(r'sessions: "([^"]+)"', content)
sessions_ja = re.findall(r'sessionsJa: "([^"]+)"', content)
print(f'effect 총 {len(effects)}개, effectJa 총 {len(effects_ja)}개')
print(f'sessions 총 {len(sessions)}개, sessionsJa 총 {len(sessions_ja)}개')
