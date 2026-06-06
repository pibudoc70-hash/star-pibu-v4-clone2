#!/usr/bin/env python3
"""Treatment 객체 내 중복 프로퍼티 제거"""
import re

with open('client/src/components/TreatmentsEquipmentSection.tsx', 'r') as f:
    src = f.read()

# 중복 패턴 찾기: sessionsEn/sessionsJa/sessionsZh/effectEn/effectJa/effectZh가 두 번 나오는 경우
# 펜토 9900 항목에서 첫 번째 세트(스크립트가 삽입한 것)를 제거하고 두 번째 세트(원래 있던 것)를 유지

# 패턴: 첫 번째 sessionsEn 세트 다음에 caution이 오고, 다시 sessions/sessionsEn이 오는 경우
# 즉, sessionsEn → sessionsJa → sessionsZh → effectEn → effectJa → effectZh → caution → sessions → sessionsEn...
# 이 경우 첫 번째 세트를 제거

# 구체적으로 펜토 9900의 중복 패턴 찾기
duplicate_pattern = (
    '      sessionsEn: "5-10 sessions (2-4 week intervals)",\n'
    '      sessionsJa: "5〜10回（2〜4週間隔）",\n'
    '      sessionsZh: "5-10次（间隔2-4周）",\n'
    '      effectEn: "Pigmentation and vascular treatment, melasma improvement, tattoo removal, skin tone improvement",\n'
    '      effectJa: "色素・血管治療、シミ改善、タトゥー除去、肌トーン改善",\n'
    '      effectZh: "治疗色素和血管，改善黄褐斑，去除纹身，改善肤色",\n'
    '      caution:'
)

replacement = '      caution:'

if duplicate_pattern in src:
    src = src.replace(duplicate_pattern, replacement, 1)
    print("[OK] 펜토 9900 중복 sessionsEn/effectEn 제거 완료")
else:
    print("[SKIP] 패턴 없음, 직접 확인 필요")
    # 다른 방법으로 찾기
    lines = src.split('\n')
    for i, line in enumerate(lines):
        if 'sessionsEn: "5-10 sessions' in line:
            print(f"  Found at L{i+1}: {line[:80]}")

# 루메니스 원 중복 확인
lumenis_dup = (
    '      sessionsEn: "3-5 sessions (3-4 week intervals)",\n'
    '      sessionsJa: "3〜5回（3〜4週間隔）",\n'
    '      sessionsZh: "3-5次（间隔3-4周）",\n'
    '      effectEn: "Pigmentation treatment, facial redness improvement, vascular lesion treatment, skin tone improvement",\n'
    '      effectJa: "色素治療、顔面紅潮改善、血管病変治療、肌トーン改善",\n'
    '      effectZh: "治疗色素，改善面部潮红，治疗血管病变，改善肤色",\n'
    '      caution:'
)

lumenis_replacement = '      caution:'

if lumenis_dup in src:
    src = src.replace(lumenis_dup, lumenis_replacement, 1)
    print("[OK] 루메니스 원 중복 sessionsEn/effectEn 제거 완료")
else:
    print("[SKIP] 루메니스 원 패턴 없음")

with open('client/src/components/TreatmentsEquipmentSection.tsx', 'w') as f:
    f.write(src)

print("완료")
