#!/usr/bin/env python3
"""
Equipment 항목의 detail 필드에 detailEn/detailJa/detailZh 추가
대상 라인: 2057, 2084, 2085, 2092, 2093
"""

with open('client/src/components/TreatmentsEquipmentSection.tsx', 'r') as f:
    lines = f.readlines()

# 각 대상 라인의 detail 값과 번역 매핑
patches = {
    # 스타워커 MAQX (Equipment, L2057)
    'detail: "스타워커 MAQX는 Q-스위치 Nd:YAG 레이저와 피코초 레이저를 결합한 복합 색소 치료 장비입니다. 532nm·1064nm·585nm·650nm 다중 파장을 지원하여 기미·잡티·문신·검버섯·오타모반 등 다양한 색소 병변에 대응합니다. 피코초 펄스로 색소 입자를 미세하게 분쇄하여 체내 흡수·배출을 촉진하며, 주변 정상 조직 손상을 최소화합니다." }': (
        'detail: "스타워커 MAQX는 Q-스위치 Nd:YAG 레이저와 피코초 레이저를 결합한 복합 색소 치료 장비입니다. 532nm·1064nm·585nm·650nm 다중 파장을 지원하여 기미·잡티·문신·검버섯·오타모반 등 다양한 색소 병변에 대응합니다. 피코초 펄스로 색소 입자를 미세하게 분쇄하여 체내 흡수·배출을 촉진하며, 주변 정상 조직 손상을 최소화합니다.", '
        'detailEn: "StarWalker MAQX is a multi-pigment treatment device combining Q-switched Nd:YAG and picosecond laser. Supports 532nm, 1064nm, 585nm, and 650nm wavelengths to address various pigment lesions including melasma, freckles, tattoos, seborrheic keratosis, and Ota nevus. Picosecond pulses finely shatter pigment particles to promote absorption and elimination while minimizing damage to surrounding normal tissue.", '
        'detailJa: "スターウォーカーMAQXはQスイッチNd:YAGレーザーとピコ秒レーザーを組み合わせた複合色素治療機器です。532nm・1064nm・585nm・650nmの多重波長に対応し、シミ・そばかす・タトゥー・脂漏性角化症・太田母斑など様々な色素病変に対応します。ピコ秒パルスで色素粒子を微細に粉砕して体内吸収・排出を促進し、周囲の正常組織へのダメージを最小化します。", '
        'detailZh: "StarWalker MAQX是结合Q开关Nd:YAG激光和皮秒激光的复合色素治疗设备。支持532nm、1064nm、585nm、650nm多波长，可应对黄褐斑、雀斑、纹身、脂溢性角化症、太田痣等各种色素病变。皮秒脉冲精细粉碎色素颗粒，促进体内吸收排出，同时最大限度减少对周围正常组织的损伤。" }'
    ),
    # 전신자외선 치료기 (건선, L2084)
    'detail: "311nm NB-UVB를 전신에 균일 조사하는 광선 치료 장비. 건선·아토피 피부염·백반증에 활용됩니다." }': (
        'detail: "311nm NB-UVB를 전신에 균일 조사하는 광선 치료 장비. 건선·아토피 피부염·백반증에 활용됩니다.", '
        'detailEn: "Full-body phototherapy device that uniformly irradiates 311nm NB-UVB. Used for psoriasis, atopic dermatitis, and vitiligo.", '
        'detailJa: "311nm NB-UVBを全身に均一照射する光線治療機器。乾癬・アトピー性皮膚炎・白斑に活用されます。", '
        'detailZh: "将311nm NB-UVB均匀照射全身的光线治疗设备。用于银屑病、特应性皮炎和白癜风。" }'
    ),
    # 엑시머 V7 (건선, L2085)
    'detail: "308nm 엑시머 레이저로 건선 병변 부위에만 집중 조사. 전신 광선 치료 대비 치료 횟수를 단축합니다." }': (
        'detail: "308nm 엑시머 레이저로 건선 병변 부위에만 집중 조사. 전신 광선 치료 대비 치료 횟수를 단축합니다.", '
        'detailEn: "308nm excimer laser for focused irradiation only on psoriasis lesion areas. Reduces treatment sessions compared to full-body phototherapy.", '
        'detailJa: "308nmエキシマレーザーで乾癬病変部位のみに集中照射。全身光線治療と比べて治療回数を短縮します。", '
        'detailZh: "308nm准分子激光仅集中照射银屑病病变部位。与全身光线治疗相比减少治疗次数。" }'
    ),
    # 표피이식 시스템 (L2093)
    'detail: "흡입 수포법(Suction Blister)을 이용해 정상 피부 표피를 분리·채취하는 표피이식 전용 장비입니다. 안정기 백반증 수술적 치료에 활용됩니다." }': (
        'detail: "흡입 수포법(Suction Blister)을 이용해 정상 피부 표피를 분리·채취하는 표피이식 전용 장비입니다. 안정기 백반증 수술적 치료에 활용됩니다.", '
        'detailEn: "Dedicated epidermal graft device that separates and harvests normal skin epidermis using the Suction Blister method. Used for surgical treatment of stable vitiligo.", '
        'detailJa: "吸引水疱法（Suction Blister）を用いて正常皮膚の表皮を分離・採取する表皮移植専用機器です。安定期白斑の外科的治療に活用されます。", '
        'detailZh: "使用吸引水疱法（Suction Blister）分离和采集正常皮肤表皮的表皮移植专用设备。用于稳定期白癜风的外科治疗。" }'
    ),
}

new_lines = []
patched = 0
for line in lines:
    matched = False
    for find_str, replace_str in patches.items():
        if find_str in line:
            line = line.replace(find_str, replace_str)
            patched += 1
            matched = True
            break
    new_lines.append(line)

print(f'패치 완료: {patched}개')

with open('client/src/components/TreatmentsEquipmentSection.tsx', 'w') as f:
    f.writelines(new_lines)

# 결과 확인
import re
with open('client/src/components/TreatmentsEquipmentSection.tsx', 'r') as f:
    content = f.read()
detail_count = len(re.findall(r'\bdetail: "', content))
detail_ja = len(re.findall(r'\bdetailJa: "', content))
print(f'detail {detail_count}개, detailJa {detail_ja}개')
