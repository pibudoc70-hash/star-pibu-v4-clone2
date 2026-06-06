#!/usr/bin/env python3
"""스컬트라, 전신자외선 치료기 중복 번역 제거 - 첫 번째 세트 제거"""

with open('client/src/components/TreatmentsEquipmentSection.tsx', 'r') as f:
    src = f.read()

# 스컬트라: patch-remaining-2.py가 삽입한 첫 번째 세트 제거
# 패턴: detailEn (첫 번째) → detailJa (첫 번째) → detailZh (첫 번째) → detailEn (두 번째) ...
sculptra_dup = (
    '      detailEn: "Sculptra is a bioactivating collagen stimulator made from PLLA (poly-L-lactic acid). Unlike hyaluronic acid fillers that provide immediate volume, Sculptra gradually induces the skin to produce its own collagen over several months after injection. This results in very natural-looking outcomes with effects lasting an average of 2+ years. FDA-approved for safety, it can be used in various areas including cheek hollowing, nasolabial folds, and temple volume loss.",\n'
    '      detailJa: "スカルプトラ（Sculptra）はPLLA（ポリ-L-乳酸）成分の生体刺激型コラーゲン刺激剤です。ヒアルロン酸フィラーのような即時ボリューム効果ではなく、注入後数ヶ月かけて皮膚自らがコラーゲンを生成するよう誘導します。そのため結果が非常に自然で、効果が平均2年以上持続します。FDA承認成分で安全性が公認されており、頬のくぼみ・ほうれい線・こめかみのボリューム減少など様々な部位に活用できます。",\n'
    '      detailZh: "Sculptra是由PLLA（聚L-乳酸）成分制成的生物刺激型胶原蛋白刺激剂。与透明质酸填充剂的即时丰盈效果不同，Sculptra在注射后数月内逐渐诱导皮肤自身产生胶原蛋白。因此效果非常自然，平均持续2年以上。FDA批准成分，安全性获得认可，可用于面颊凹陷、法令纹、太阳穴体积减少等多个部位。",\n'
)

if sculptra_dup in src:
    src = src.replace(sculptra_dup, '', 1)
    print("[OK] 스컬트라 중복 번역 제거 완료")
else:
    print("[SKIP] 스컬트라 패턴 없음")

# 전신자외선: patch-remaining-2.py가 삽입한 첫 번째 세트 제거
uv_dup = (
    '      detailEn: "The whole-body UV phototherapy device uniformly irradiates 311nm narrowband UVB (NB-UVB) across the entire body. It is effective for various skin diseases widely distributed throughout the body, including vitiligo, psoriasis, atopic dermatitis, and erythema multiforme. Through immune modulation, it suppresses skin inflammation and promotes pigment regeneration, with enhanced therapeutic effects when combined with drug treatment.",\n'
    '      detailJa: "全身紫外線治療器は311nm狭帯域紫外線B（NB-UVB）を全身に均一に照射する光線治療装置です。全身に広く分布した白斑、乾癬、アトピー性皮膚炎、多形紅斑など様々な皮膚疾患に効果的です。免疫調節効果を通じて皮膚炎症を抑制し色素再生を促進し、薬物治療との併用で治療効果が向上します。",\n'
    '      detailZh: "全身紫外线治疗仪是将311nm窄带紫外线B（NB-UVB）均匀照射全身的光线治疗设备。对全身广泛分布的白癜风、银屑病、特应性皮炎、多形性红斑等各种皮肤疾病有效。通过免疫调节效果抑制皮肤炎症并促进色素再生，与药物治疗联合使用时治疗效果更佳。",\n'
)

if uv_dup in src:
    src = src.replace(uv_dup, '', 1)
    print("[OK] 전신자외선 중복 번역 제거 완료")
else:
    print("[SKIP] 전신자외선 패턴 없음")

with open('client/src/components/TreatmentsEquipmentSection.tsx', 'w') as f:
    f.write(src)

print("완료")
