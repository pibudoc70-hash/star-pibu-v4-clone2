#!/usr/bin/env python3
"""스컬트라, 전신자외선 치료기 번역 패치"""

with open('client/src/components/TreatmentsEquipmentSection.tsx', 'r') as f:
    src = f.read()

patches = [
    # 스컬트라 - detail 뒤에 번역 추가
    (
        '      detail: "스컬트라(Sculptra)는 PLLA(폴리-L-락틱산) 성분의 생체 자극형 콜라겐 자극제입니다. 일반 히알루론산 필러처럼 즉각적인 볼륨 효과를 내는 것이 아니라, 주입 후 수개월에 걸쳐 피부 스스로 콜라겐을 생성하도록 유도합니다. 이 때문에 결과가 매우 자연스럽고, 효과가 평균 2년 이상 지속됩니다. FDA 승인 성분으로 안전성이 공인되어 있으며, 볼 꺼짐·팔자주름·관자놀이 볼륨 감소 등 다양한 부위에 활용할 수 있습니다.",',
        '      detail: "스컬트라(Sculptra)는 PLLA(폴리-L-락틱산) 성분의 생체 자극형 콜라겐 자극제입니다. 일반 히알루론산 필러처럼 즉각적인 볼륨 효과를 내는 것이 아니라, 주입 후 수개월에 걸쳐 피부 스스로 콜라겐을 생성하도록 유도합니다. 이 때문에 결과가 매우 자연스럽고, 효과가 평균 2년 이상 지속됩니다. FDA 승인 성분으로 안전성이 공인되어 있으며, 볼 꺼짐·팔자주름·관자놀이 볼륨 감소 등 다양한 부위에 활용할 수 있습니다.",\n      detailEn: "Sculptra is a bioactivating collagen stimulator made from PLLA (poly-L-lactic acid). Unlike hyaluronic acid fillers that provide immediate volume, Sculptra gradually induces the skin to produce its own collagen over several months after injection. This results in very natural-looking outcomes with effects lasting an average of 2+ years. FDA-approved for safety, it can be used in various areas including cheek hollowing, nasolabial folds, and temple volume loss.",\n      detailJa: "スカルプトラ（Sculptra）はPLLA（ポリ-L-乳酸）成分の生体刺激型コラーゲン刺激剤です。ヒアルロン酸フィラーのような即時ボリューム効果ではなく、注入後数ヶ月かけて皮膚自らがコラーゲンを生成するよう誘導します。そのため結果が非常に自然で、効果が平均2年以上持続します。FDA承認成分で安全性が公認されており、頬のくぼみ・ほうれい線・こめかみのボリューム減少など様々な部位に活用できます。",\n      detailZh: "Sculptra是由PLLA（聚L-乳酸）成分制成的生物刺激型胶原蛋白刺激剂。与透明质酸填充剂的即时丰盈效果不同，Sculptra在注射后数月内逐渐诱导皮肤自身产生胶原蛋白。因此效果非常自然，平均持续2年以上。FDA批准成分，安全性获得认可，可用于面颊凹陷、法令纹、太阳穴体积减少等多个部位。",',
    ),
    # 전신자외선 치료기 - detail 뒤에 번역 추가
    (
        '      detail: "전신자외선 치료기는 311nm 협대역 자외선B(NB-UVB)를 전신에 균일하게 조사하는 광선 치료 장비입니다. 전신에 광범위하게 분포한 백반증, 건선, 아토피 피부염, 다형 홍반 등 다양한 피부 질환에 효과적입니다. 면역 조절 효과를 통해 피부 염증을 억제하고 색소 재생을 촉진하며, 약물 치료와 병행 시 치료 효과가 향상됩니다.",',
        '      detail: "전신자외선 치료기는 311nm 협대역 자외선B(NB-UVB)를 전신에 균일하게 조사하는 광선 치료 장비입니다. 전신에 광범위하게 분포한 백반증, 건선, 아토피 피부염, 다형 홍반 등 다양한 피부 질환에 효과적입니다. 면역 조절 효과를 통해 피부 염증을 억제하고 색소 재생을 촉진하며, 약물 치료와 병행 시 치료 효과가 향상됩니다.",\n      detailEn: "The whole-body UV phototherapy device uniformly irradiates 311nm narrowband UVB (NB-UVB) across the entire body. It is effective for various skin diseases widely distributed throughout the body, including vitiligo, psoriasis, atopic dermatitis, and erythema multiforme. Through immune modulation, it suppresses skin inflammation and promotes pigment regeneration, with enhanced therapeutic effects when combined with drug treatment.",\n      detailJa: "全身紫外線治療器は311nm狭帯域紫外線B（NB-UVB）を全身に均一に照射する光線治療装置です。全身に広く分布した白斑、乾癬、アトピー性皮膚炎、多形紅斑など様々な皮膚疾患に効果的です。免疫調節効果を通じて皮膚炎症を抑制し色素再生を促進し、薬物治療との併用で治療効果が向上します。",\n      detailZh: "全身紫外线治疗仪是将311nm窄带紫外线B（NB-UVB）均匀照射全身的光线治疗设备。对全身广泛分布的白癜风、银屑病、特应性皮炎、多形性红斑等各种皮肤疾病有效。通过免疫调节效果抑制皮肤炎症并促进色素再生，与药物治疗联合使用时治疗效果更佳。",',
    ),
]

count = 0
for old, new in patches:
    if old in src:
        src = src.replace(old, new, 1)
        count += 1
        print(f"  [OK] Patched")
    else:
        print(f"  [SKIP] Not found: {old[:60]}")

with open('client/src/components/TreatmentsEquipmentSection.tsx', 'w') as f:
    f.write(src)

print(f"\n총 {count}개 항목 패치 완료")
