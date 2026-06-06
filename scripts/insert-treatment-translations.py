#!/usr/bin/env python3
"""
Treatment 데이터에 JA/ZH 번역을 삽입하는 스크립트.
각 Treatment 항목의 detail/effect/sessions 필드 뒤에 번역 필드를 추가.

실행: python3 scripts/insert-treatment-translations.py
"""

import re

SRC = "client/src/components/TreatmentsEquipmentSection.tsx"

with open(SRC, "r", encoding="utf-8") as f:
    src = f.read()

# ─────────────────────────────────────────────────────────────────────────────
# 번역 데이터: (ko_unique_snippet, en, ja, zh) 형식
# 각 항목은 detail/effect/sessions 필드에 대한 번역
# ─────────────────────────────────────────────────────────────────────────────

# 패턴: 각 detail: "..." 뒤에 detailEn/detailJa/detailZh 추가
# 패턴: 각 effect: "..." 뒤에 effectEn/effectJa/effectZh 추가
# 패턴: 각 sessions: "..." 뒤에 sessionsEn/sessionsJa/sessionsZh 추가

# 번역 매핑: (ko_text, field_name) -> (en, ja, zh)
DETAIL_TRANSLATIONS = {
    "울쎄라피 프라임의 집속 초음파(HIFU) 에너지가 SMAS층(근막층)까지 도달하여 피부 깊은 곳에서부터 리프팅 효과를 유도하고": (
        "Ultherapy Prime's focused ultrasound (HIFU) energy reaches the SMAS (fascial) layer to induce lifting from deep within the skin. Thermage FLX's RF energy stimulates dermal collagen to improve skin elasticity. Rejuran Healer (salmon DNA) is added to simultaneously provide skin regeneration and hydration in this premium combination program. Performed under sedation for comfortable, pain-free treatment with same-day return to daily activities.",
        "ウルセラピー プライムの集束超音波（HIFU）エネルギーがSMAS層（筋膜層）まで到達し、皮膚の深部からリフティング効果を誘導します。サーマジFLXの高周波エネルギーが真皮コラーゲンを刺激して皮膚の弾力を改善します。リジュランヒーラー（サーモンDNA成分）を加えて皮膚再生と水分補給を同時に提供するプレミアム複合プログラムです。鎮静下施術で行われるため、痛みなく快適に受けられ、施術当日から日常生活に復帰できます。",
        "超声刀Prime的聚焦超声（HIFU）能量到达SMAS层（筋膜层），从皮肤深处诱导提升效果。热玛吉FLX的射频能量刺激真皮胶原蛋白，改善皮肤弹力。加入婴儿针（三文鱼DNA成分），同时提供皮肤再生和补水的复合高端项目。在镇静下进行，无痛舒适，当天即可恢复日常活动。",
    ),
    "프로파운드 RF는 마이크로니들을 통해 RF(고주파) 에너지를 진피층 정확한 깊이에 직접 전달하는 장비입니다. 피부 표면을 통과하지 않고 진피층에 직접 에너지를 전달하기 때문에, 표면 손상 없이 진피 내 콜라겐·엘라스틴·히알루론산 생성을 강력하게 자극합니다": (
        "Profound RF delivers RF (radiofrequency) energy directly to the precise depth of the dermis via microneedles. Because energy is delivered directly to the dermis without passing through the skin surface, it powerfully stimulates collagen, elastin, and hyaluronic acid production without surface damage. Clinical studies report significant collagen increase with a single session. A 10-day to 2-week recovery period is required, but strong lifting and elasticity improvement effects can be expected.",
        "プロファウンドRFはマイクロニードルを通じてRF（高周波）エネルギーを真皮層の正確な深さに直接届ける機器です。皮膚表面を通過せず真皮層に直接エネルギーを届けるため、表面損傷なしに真皮内のコラーゲン・エラスチン・ヒアルロン酸生成を強力に刺激します。臨床研究では1回の施術でコラーゲン生成が有意に増加することが報告されています。施術後10日〜2週間の回復期間が必要ですが、強力なリフティング・弾力改善効果が期待できます。",
        "Profound RF通过微针将射频能量直接传递到真皮层的精确深度。由于能量不经过皮肤表面直接传递到真皮层，可在不损伤表面的情况下强力刺激真皮内胶原蛋白、弹性蛋白和透明质酸的生成。临床研究报告显示一次治疗后胶原蛋白生成显著增加。治疗后需要10天至2周的恢复期，但可期待强效的提升和弹力改善效果。",
    ),
    "스컬트라(Sculptra)는 PLLA(폴리-L-락틱산) 성분의 생체 자극형 콜라겐 자극제입니다": (
        "Sculptra is a biostimulatory collagen stimulator containing PLLA (poly-L-lactic acid). Unlike regular hyaluronic acid fillers that provide immediate volume, it induces the skin to produce its own collagen over several months after injection. Results are very natural and effects last an average of 2+ years. FDA-approved for safety, it can be used for various areas including sunken cheeks, nasolabial folds, and temporal volume loss.",
        "スカルプトラ（Sculptra）はPLLA（ポリ-L-乳酸）成分の生体刺激型コラーゲン刺激剤です。通常のヒアルロン酸フィラーのような即時ボリューム効果ではなく、注入後数ヶ月かけて皮膚自らがコラーゲンを生成するよう誘導します。そのため結果が非常に自然で、効果が平均2年以上持続します。FDA承認成分で安全性が公認されており、頬のくぼみ・ほうれい線・こめかみのボリューム減少など様々な部位に活用できます。",
        "塑然雅（Sculptra）是含有PLLA（聚-L-乳酸）成分的生物刺激型胶原蛋白刺激剂。与普通透明质酸填充剂不同，它不是立即产生丰盈效果，而是在注射后数月内诱导皮肤自行产生胶原蛋白。因此效果非常自然，平均持续2年以上。FDA认证成分，安全性有保障，可用于面颊凹陷、法令纹、太阳穴体积减少等多个部位。",
    ),
    "혈액 유래 줄기세포 치료는 소량의 혈액을 채취하여 원심분리 후 줄기세포 성분을 농축·분리하고 피부에 주사합니다": (
        "Blood-derived stem cell therapy involves drawing a small amount of blood, centrifuging it to concentrate and separate stem cell components, then injecting them into the skin. Fat-derived stem cell therapy involves extracting a small amount of fat from the abdomen or thighs, separating stem cells, and injecting them into the skin. Both methods use your own cells, minimizing the risk of adverse reactions, and directly supply skin regeneration factors to improve elasticity, hydration, and texture. The appropriate method is determined through thorough consultation with the attending physician.",
        "血液由来幹細胞治療は少量の血液を採取し、遠心分離後に幹細胞成分を濃縮・分離して皮膚に注射します。脂肪由来幹細胞治療は腹部・太ももなどから少量の脂肪を採取して幹細胞を分離し、皮膚に注射します。どちらの方法も自分の細胞を使用するため異常反応リスクが低く、皮膚再生因子を直接供給して皮膚の弾力・水分・肌質改善を誘導します。担当医師との十分な相談を通じて個人に適した方法を決定します。",
        "血液源干细胞治疗是抽取少量血液，经离心分离后浓缩提取干细胞成分，注射到皮肤中。脂肪源干细胞治疗是从腹部、大腿等部位提取少量脂肪，分离干细胞后注射到皮肤中。两种方法均使用自身细胞，不良反应风险低，直接提供皮肤再生因子，改善皮肤弹力、水分和质感。通过与主治医生的充分沟通来决定适合个人的方法。",
    ),
    "울트라펄스 레이저로 흉터 표면을 정밀하게 제거하고, DRT(진피 리모델링 치료)로 진피층 콜라겐 재생을 유도합니다": (
        "UltraPulse laser precisely removes scar surfaces, while DRT (Dermis Remodeling Treatment) induces dermal collagen regeneration. SkinJet delivers scar treatment medications directly to the dermis in a needle-free manner, and TriFill Pro fills sunken scar areas with volume to improve shadows. This intensive program combines four treatments at once, performed under sedation for pain-free treatment.",
        "ウルトラパルスレーザーで瘢痕表面を精密に除去し、DRT（真皮リモデリング治療）で真皮層のコラーゲン再生を誘導します。スキンジェットで瘢痕治療薬物を無針方式で真皮に直接届け、トリフィルプロで陥没した瘢痕部位にボリュームを補い陰影を改善します。4つの治療を一度に行う集中プログラムで、鎮静下施術で行われるため痛みなく治療を受けられます。",
        "超脉冲激光精确去除疤痕表面，DRT（真皮重塑治疗）诱导真皮层胶原蛋白再生。SkinJet以无针方式将疤痕治疗药物直接输送到真皮，TriFill Pro为凹陷疤痕部位填充体积以改善阴影。这个集中项目一次进行四种治疗，在镇静下进行，无痛治疗。",
    ),
    "Excel V+의 532nm KTP 레이저는 혈관 내 헤모글로빈에 선택적으로 흡수되어 확장된 혈관을 피부 표면에 상처 없이 응고·폐쇄합니다": (
        "Excel V+'s 532nm KTP laser is selectively absorbed by hemoglobin in blood vessels, coagulating and closing dilated vessels without surface wounds. ADVATX's 1,319nm laser stimulates collagen regeneration in the dermis to strengthen tissue around blood vessels and suppress rosacea recurrence. The combination of these two devices can systematically improve various vascular skin problems including facial redness, telangiectasia, and rosacea. Mild redness may appear 1-2 days after treatment but subsides quickly.",
        "エクセルV+の532nm KTPレーザーは血管内のヘモグロビンに選択的に吸収され、拡張した血管を皮膚表面に傷なく凝固・閉鎖します。ADVATXの1,319nmレーザーは真皮内のコラーゲン再生を刺激して血管周辺組織を強化し、紅潮の再発を抑制します。2つの機器の複合治療で顔面紅潮・毛細血管拡張・酒さ（ロサセア）など様々な血管性皮膚トラブルを体系的に改善できます。施術後1〜2日内に軽微な赤みが現れることがありますが、すぐに治まります。",
        "Excel V+的532nm KTP激光被血管内血红蛋白选择性吸收，在皮肤表面无伤口地凝固和关闭扩张的血管。ADVATX的1,319nm激光刺激真皮内胶原蛋白再生，强化血管周围组织并抑制红肌复发。两种设备的复合治疗可系统性改善面部红肌、毛细血管扩张、酒渣鼻等各种血管性皮肤问题。治疗后1-2天内可能出现轻微红肌，但会很快消退。",
    ),
    "엑셀V+의 532nm 파장은 기미 병변 아래 미세 혈관을 선택적으로 파괴하여 색소에 영양을 공급하는 혈관을 차단하고": (
        "Excel V+'s 532nm wavelength selectively destroys microvessels beneath melasma lesions to block blood supply to pigmentation, while Enlighten3's picosecond laser (532nm·1,064nm·670nm triple wavelength) simultaneously breaks down pigment in both the epidermis and dermis. The synergistic effect of these two devices can comprehensively improve various pigmented lesions including melasma, age spots, seborrheic keratosis, and solar lentigines in a single session. Immediate return to daily activities is possible after treatment.",
        "エクセルV+の532nm波長は肝斑病変下の微細血管を選択的に破壊して色素に栄養を供給する血管を遮断し、エンライトン3のピコ秒レーザー（532nm・1,064nm・670nmトリプル波長）が表皮と真皮の色素を同時に分解します。2つの機器のシナジー効果で肝斑・シミ・脂漏性角化症・日光黒子など様々な色素病変を一度に複合的に改善できます。施術後すぐに日常生活に復帰できるのが特徴です。",
        "Excel V+的532nm波长选择性破坏黄褐斑病变下的微血管，阻断为色素提供营养的血管，而Enlighten3的皮秒激光（532nm·1,064nm·670nm三重波长）同时分解表皮和真皮的色素。两种设备的协同效果可以一次性综合改善黄褐斑、色斑、脂溢性角化、日光性雀斑样痣等各种色素病变。治疗后可立即恢复日常活动。",
    ),
    "울쎄라피 프라임은 기존 울쎄라피 대비 더 넓은 면적을 빠르게 커버하는 최신 업그레이드 버전입니다": (
        "Ultherapy Prime is the latest upgraded version that covers a wider area faster than conventional Ultherapy. Focused ultrasound (HIFU) energy is precisely delivered to the deep SMAS (fascial) layer to induce lifting from within the skin. FDA-approved non-surgical lifting treatment with immediate return to daily activities. Effects appear gradually from 2-3 months after treatment and continue to improve for up to 6 months.",
        "ウルセラピー プライムは従来のウルセラピーより広い面積を速くカバーする最新アップグレードバージョンです。集束超音波（HIFU）エネルギーを皮膚の深層であるSMAS（筋膜層）まで正確に届けて皮膚の内側からリフティング効果を誘導します。FDA承認の非手術リフティング施術で、施術後すぐに日常生活に復帰できます。施術効果は施術後2〜3ヶ月から徐々に現れ、6ヶ月まで継続的に改善されます。",
        "超声刀Prime是比传统超声刀覆盖更大面积、速度更快的最新升级版本。聚焦超声（HIFU）能量精确传递到皮肤深层的SMAS（筋膜层），从皮肤内部诱导提升效果。FDA认证的非手术提升治疗，治疗后可立即恢复日常活动。效果从治疗后2-3个月开始逐渐显现，持续改善长达6个月。",
    ),
    "써마지 FLX는 4세대 고주파(RF) 리프팅 장비로, 피부 깊은 층의 콜라겐을 가열하여 즉각적인 수축 효과와 함께 장기적인 콜라겐 재생을 유도합니다": (
        "Thermage FLX is a 4th-generation RF (radiofrequency) lifting device that heats collagen in deep skin layers to induce immediate contraction effects along with long-term collagen regeneration. Dr. Jo Si-hyeong at Star Dermatology is an official Thermage advisor, possessing optimal parameter settings and treatment expertise. The vibration function (AccuREP) minimizes discomfort during treatment, with immediate return to daily activities. Applicable to various areas including around the eyes, cheeks, neck, and body.",
        "サーマジFLXは第4世代の高周波（RF）リフティング機器で、皮膚の深層のコラーゲンを加熱して即時収縮効果と長期的なコラーゲン再生を誘導します。スター皮膚科の趙時亨院長はサーマジ公式アドバイザーで、最適なパラメーター設定と施術ノウハウを保有しています。振動機能（AccuREP）が搭載されており施術中の不快感を最小化し、施術後すぐに日常生活に復帰できます。目元・頬・首・ボディなど様々な部位に適用可能です。",
        "热玛吉FLX是第四代射频（RF）提升设备，通过加热皮肤深层胶原蛋白，诱导即时收缩效果和长期胶原蛋白再生。星皮肤科赵时亨院长是热玛吉官方顾问，拥有最优参数设置和治疗技巧。搭载振动功能（AccuREP），最大限度减少治疗中的不适感，治疗后可立即恢复日常活动。可应用于眼周、面颊、颈部、身体等多个部位。",
    ),
    "세르프는 최신 고강도 RF 리프팅 장비로, 고주파 에너지를 피부 진피층과 SMAS층에 정밀하게 전달하여 강력한 리프팅 효과를 유도합니다": (
        "CERF is the latest high-intensity RF lifting device that precisely delivers radiofrequency energy to the dermal and SMAS layers for powerful lifting effects. Natural lifting results can be expected without incisions, with immediate return to daily activities. Currently offering a special event price to celebrate Star Dermatology's expansion and relocation—please inquire during consultation.",
        "セルフは最新の高強度RFリフティング機器で、高周波エネルギーを皮膚の真皮層とSMAS層に精密に届けて強力なリフティング効果を誘導します。切開なしで自然なリフティング効果が期待でき、施術後すぐに日常生活に復帰できます。スター皮膚科の拡張移転記念特価イベントで進行中ですので、相談時にお問い合わせください。",
        "CERF是最新高强度RF提升设备，将射频能量精确传递到皮肤真皮层和SMAS层，诱导强效提升效果。无需切开即可期待自然的提升效果，治疗后可立即恢复日常活动。目前正在进行星皮肤科扩张搬迁纪念特价活动，请在咨询时询问。",
    ),
    "울쎄라(Ulthera)는 집속 초음파(HIFU) 에너지를 피부 깊은 층인 SMAS(근막층)까지 정확하게 전달하는 정통 리프팅 장비입니다": (
        "Ulthera is the original lifting device that precisely delivers focused ultrasound (HIFU) energy to the deep SMAS (fascial) layer. FDA-approved non-surgical lifting treatment that induces lifting from deep layers without surface damage. Effects appear gradually from 2-3 months after treatment and last 6-12 months.",
        "ウルセラ（Ulthera）は集束超音波（HIFU）エネルギーを皮膚の深層であるSMAS（筋膜層）まで正確に届ける正統リフティング機器です。FDA承認の非手術リフティング施術で、皮膚表面に損傷なく深層からリフティング効果を誘導します。施術効果は施術後2〜3ヶ月から徐々に現れ、6〜12ヶ月持続します。",
        "Ulthera是将聚焦超声（HIFU）能量精确传递到皮肤深层SMAS（筋膜层）的正统提升设备。FDA认证的非手术提升治疗，在不损伤皮肤表面的情况下从深层诱导提升效果。效果从治疗后2-3个月开始逐渐显现，持续6-12个月。",
    ),
    "프로파운드 RF는 마이크로니들을 통해 RF 에너지를 진피층 정확한 깊이에 직접 전달합니다. 임상 연구에서 1회 시술로 콜라겐·엘라스틴·히알루론산 생성이 유의미하게 증가하는 것으로 보고되어 있습니다": (
        "Profound RF delivers RF energy directly to the precise depth of the dermis via microneedles. Clinical studies report significant increases in collagen, elastin, and hyaluronic acid production with a single treatment. Among non-surgical lifting treatments, high levels of skin elasticity improvement can be expected, and while a recovery period is required, it provides correspondingly powerful effects.",
        "プロファウンドRFはマイクロニードルを通じてRFエネルギーを真皮層の正確な深さに直接届けます。臨床研究では1回の施術でコラーゲン・エラスチン・ヒアルロン酸生成が有意に増加することが報告されています。非手術リフティング施術の中でも高い水準の皮膚弾力改善効果が期待でき、回復期間が必要ですがそれだけ強力な効果を提供します。",
        "Profound RF通过微针将RF能量直接传递到真皮层的精确深度。临床研究报告显示一次治疗后胶原蛋白、弹性蛋白和透明质酸生成显著增加。在非手术提升治疗中可期待高水平的皮肤弹力改善效果，虽然需要恢复期，但相应地提供强效效果。",
    ),
    "텐쎄라(Tensera)는 고주파(RF)와 초음파(HIFU)를 동시에 활용한 복합 리프팅 장비입니다": (
        "Tensera is a combined lifting device that simultaneously utilizes RF (radiofrequency) and ultrasound (HIFU). By simultaneously irradiating both energies to stimulate the dermis and SMAS layers together, more effective lifting and elasticity improvement can be expected compared to single treatments. Immediate return to daily activities is possible, and it is effective for facial contour improvement and skin elasticity enhancement.",
        "テンセラ（Tensera）は高周波（RF）と超音波（HIFU）を同時に活用した複合リフティング機器です。2つのエネルギーを同時照射して真皮層とSMAS層を共に刺激することで、単独施術と比較してより効果的なリフティングと弾力改善が期待できます。施術後すぐに日常生活に復帰でき、顔の輪郭改善と皮膚弾力向上に効果的です。",
        "Tensera是同时利用射频（RF）和超声波（HIFU）的复合提升设备。同时照射两种能量，共同刺激真皮层和SMAS层，与单一治疗相比可期待更有效的提升和弹力改善。治疗后可立即恢复日常活动，对面部轮廓改善和皮肤弹力提升有效。",
    ),
    "버츄RF(Virtue RF)는 마이크로니들을 통해 RF(고주파) 에너지를 피부 진피층에 직접 전달하는 장비입니다": (
        "Virtue RF is a device that delivers RF (radiofrequency) energy directly to the dermal layer via microneedles. Because energy is delivered directly to the dermis without passing through the skin surface, it powerfully stimulates collagen production in the dermis while minimizing surface damage. Pore reduction effects can also be expected along with elasticity improvement, and it is also used for acne scar improvement.",
        "バーチュRF（Virtue RF）はマイクロニードルを通じてRF（高周波）エネルギーを皮膚の真皮層に直接届ける機器です。皮膚表面を通過せず真皮層に直接エネルギーを届けるため、表面損傷を最小化しながら真皮内のコラーゲン生成を強力に刺激します。弾力改善とともに毛穴縮小効果も期待でき、ニキビ瘢痕改善にも活用されます。",
        "Virtue RF是通过微针将射频能量直接传递到皮肤真皮层的设备。由于能量不经过皮肤表面直接传递到真皮层，可在最大限度减少表面损伤的同时强力刺激真皮内胶原蛋白生成。除弹力改善外还可期待毛孔收缩效果，也用于痘疤改善。",
    ),
    "슈링크 유니버스(Shrink Universe)는 집속 초음파(HIFU) 리프팅의 업그레이드 버전으로, 다양한 깊이(1.5mm, 3.0mm, 4.5mm)에 에너지를 전달하여 피부 전층에 걸친 리프팅 효과를 유도합니다": (
        "Shrink Universe is an upgraded version of focused ultrasound (HIFU) lifting that delivers energy to various depths (1.5mm, 3.0mm, 4.5mm) to induce lifting effects across all skin layers. It covers a wider area faster than conventional Shrink, with shortened treatment time. Immediate return to daily activities is possible after treatment.",
        "シュリンク ユニバース（Shrink Universe）は集束超音波（HIFU）リフティングのアップグレードバージョンで、様々な深さ（1.5mm、3.0mm、4.5mm）にエネルギーを届けて皮膚全層にわたるリフティング効果を誘導します。従来のシュリンクより広い面積を速くカバーし、施術時間が短縮されました。施術後すぐに日常生活に復帰できます。",
        "Shrink Universe是聚焦超声（HIFU）提升的升级版本，将能量传递到不同深度（1.5mm、3.0mm、4.5mm），诱导覆盖皮肤全层的提升效果。比传统Shrink覆盖更大面积、速度更快，治疗时间缩短。治疗后可立即恢复日常活动。",
    ),
    "온다(ONDA)는 기존의 고주파·초음파 리프팅을 넘어 특허받은 극초단파(Microwave) 기술을 이용한 차세대 리프팅 장비입니다": (
        "ONDA is a next-generation lifting device that goes beyond conventional RF and ultrasound lifting by using patented microwave technology. Microwave energy is uniformly delivered to tissue to continuously induce collagen remodeling, with immediate lifting and skin tightening effects expected. Effective for facial muscle tightening, sagging cheeks and double chin improvement, fine wrinkle elasticity enhancement, and eye wrinkle improvement. Manufactured by DEKA.",
        "オンダ（ONDA）は既存の高周波・超音波リフティングを超えた特許取得の極超短波（マイクロウェーブ）技術を利用した次世代リフティング機器です。極超短波エネルギーを組織に均一に届けてコラーゲンリモデリングを継続的に誘導し、即時リフティングとスキンタイトニング効果が期待できます。顔面筋タイトニング、たるんだ頬肉と二重顎の改善、小じわの弾力増大、目元のしわ改善に効果的です。DEKA社製造。",
        "ONDA是超越传统射频和超声波提升的下一代提升设备，采用专利极超短波（微波）技术。极超短波能量均匀传递到组织，持续诱导胶原蛋白重塑，可期待即时提升和皮肤紧致效果。对面部肌肉紧致、松弛面颊和双下巴改善、细纹弹力增强、眼周皱纹改善有效。DEKA公司制造。",
    ),
    "에너젯(Enerjet)은 고압 공기를 이용해 주사바늘 없이 약물을 피부 진피층에 직접 주입하는 무침 시술 장비입니다. 바늘 공포증이 있는 분들도 편안하게 받을 수 있으며": (
        "Enerjet is a needle-free treatment device that uses high-pressure air to directly inject medications into the dermal layer without needles. Even those with needle phobia can receive treatment comfortably, with bruising and bleeding at the treatment site minimized. Various medications including hyaluronic acid, growth factors, and Rejuran can be injected, with skin regeneration and elasticity improvement effects expected.",
        "エナジェット（Enerjet）は高圧空気を利用して注射針なしで薬物を皮膚の真皮層に直接注入する無針施術機器です。針恐怖症の方も快適に受けられ、施術部位の青あざや出血が最小化されます。ヒアルロン酸・成長因子・リジュランなど様々な薬物を注入でき、皮膚再生と弾力改善効果が期待できます。",
        "Enerjet是利用高压空气将药物直接注射到皮肤真皮层的无针治疗设备，无需注射针。即使是有针头恐惧症的人也可以舒适地接受治疗，治疗部位的瘀伤和出血最小化。可注射透明质酸、生长因子、婴儿针等各种药物，可期待皮肤再生和弹力改善效果。",
    ),
    "쥴 BBL 스킨타이트는 미국 SCITON사의 고성능 '쥴 레이저' 장비로 진행되는 시술로, 적외선 빛을 이용하여 피부 속 콜라겐을 자극해서 자연스럽게 탄력을 높여주는 레이저입니다": (
        "Joule BBL SkinTyte is a treatment performed with SCITON's high-performance 'Joule laser' device from the USA, using infrared light to stimulate collagen in the skin and naturally improve elasticity. It can be received comfortably without concerns about pain or anesthesia, and you can clearly feel the skin becoming firmer and smoother after treatment. A special sapphire tip cooling device protects the skin surface from heat damage during treatment. Excellent for lifting effects to improve skin elasticity and fine wrinkles, and promotes collagen production to help collagen regeneration from within the skin. Also effective for whitening effects including melasma and freckle pigmentation treatment.",
        "ジュールBBLスキンタイトは米国SCITON社の高性能「ジュールレーザー」機器で行われる施術で、赤外線光を利用して皮膚内のコラーゲンを刺激して自然に弾力を高めるレーザーです。痛みや麻酔の心配なく快適に受けられ、施術後に皮膚がハリのある滑らかな感触を確実に感じられます。皮膚冷却装置である特殊サファイアチップを使用して施術中に皮膚表面を熱損傷から保護します。リフティング効果で皮膚弾力改善と小じわ改善に優れており、コラーゲン生成を促進して皮膚内からのコラーゲン再生に役立ちます。また肝斑・そばかすなどの色素治療にも効果があるホワイトニング効果も期待できます。",
        "Joule BBL SkinTyte是使用美国SCITON公司高性能'Joule激光'设备进行的治疗，利用红外线光刺激皮肤内胶原蛋白，自然提升弹力。无需担心疼痛或麻醉，可舒适接受治疗，治疗后可明显感受到皮肤变得紧致光滑。使用特殊蓝宝石尖端冷却装置，在治疗过程中保护皮肤表面免受热损伤。提升效果对皮肤弹力改善和细纹改善效果卓越，促进胶原蛋白生成，有助于从皮肤内部再生胶原蛋白。还可期待黄褐斑、雀斑等色素治疗的美白效果。",
    ),
    "트리니티 리프토닝은 1064nm, 808nm, 755nm 3가지 파장대의 레이저가 동시에 조사되어 리프팅 뿐만 아니라 기미, 잡티, 홍조 등 맑고 깨끗해진 피부와 전체적인 리프팅 효과를 보실 수 있습니다": (
        "Trinity Liftoning simultaneously irradiates three wavelengths of laser (1064nm, 808nm, 755nm) to provide not only lifting but also clear, bright skin free from melasma, age spots, and redness, along with overall lifting effects. Korea's first combined lifting and toning laser that resolves tightening, lifting, and whitening all at once. A powerful cooling system alleviates pain, and the wide tip (12×20mm) enables fast treatment. Treatment within 10 minutes allows immediate return to daily activities.",
        "トリニティ リフトニングは1064nm、808nm、755nmの3つの波長帯のレーザーが同時に照射され、リフティングだけでなく肝斑・シミ・紅潮などの透明で清潔な肌と全体的なリフティング効果が得られます。韓国初のリフティングとトーニングの複合レーザーで、タイトニング・リフティング・ホワイトニングを一度に解決します。強力なクーリングシステムで痛みを緩和し、広いチップ（12×20mm）で速い施術が可能です。10分以内の速い施術でそのまま日常生活が可能です。",
        "Trinity Liftoning同时照射三种波长激光（1064nm、808nm、755nm），不仅提升，还能改善黄褐斑、色斑、红肌等，获得清透亮丽的皮肤和整体提升效果。韩国首款提升和调肤复合激光，一次解决紧致、提升和美白。强大的冷却系统缓解疼痛，宽大尖端（12×20mm）实现快速治疗。10分钟内完成治疗，可立即恢复日常活动。",
    ),
    # ── eye ──────────────────────────────────────────────────────────────────
    "눈밑지방재배치술은 눈 아래 과잉 축적된 지방을 제거하지 않고 꺼진 눈물고랑(tear trough) 부위로 재배치하여 다크서클과 눈밑 볼록함을 동시에 개선하는 시술입니다": (
        "Under-eye fat repositioning is a procedure that improves dark circles and under-eye puffiness simultaneously by repositioning excess accumulated fat under the eyes to the sunken tear trough area rather than removing it. Star Dermatology has extensive experience with over 4,000 procedures and minimizes incisions to reduce scarring risk. Since fat is repositioned rather than removed, there is almost no fat cavity or appearance change after treatment, and a natural under-eye line can be expected.",
        "目の下脂肪再配置術は目の下に過剰に蓄積された脂肪を除去せず、くぼんだ涙袋（ティアトラフ）部位に再配置してクマと目の下の膨らみを同時に改善する施術です。スター皮膚科は4,000例以上の豊富な施術経験を持ち、切開を最小化して傷跡リスクを低減します。脂肪を除去せず再配置する方式のため、施術後の脂肪空洞や外観変形がほとんどなく、自然な目の下ラインが期待できます。",
        "眼袋脂肪重置术是将眼下过度积累的脂肪不是去除，而是重置到凹陷的泪沟部位，同时改善黑眼圈和眼袋的手术。星皮肤科拥有4,000例以上的丰富手术经验，最大限度减少切口以降低疤痕风险。由于是重置而非去除脂肪，术后几乎没有脂肪空洞或外观变形，可期待自然的眼下轮廓。",
    ),
    # ── rosacea ──────────────────────────────────────────────────────────────
    "안면홍조 레이저 복합 치료는 엑셀V+와 ADVATX 두 가지 레이저를 결합하여": (
        "Facial rosacea laser combination treatment combines Excel V+ and ADVATX lasers to comprehensively treat vascular skin problems. Excel V+'s 532nm KTP laser selectively coagulates dilated blood vessels, while ADVATX's 1,319nm laser strengthens surrounding tissue and suppresses rosacea recurrence. Effective for facial redness, telangiectasia, and rosacea.",
        "顔面紅潮レーザー複合治療はエクセルV+とADVATXの2つのレーザーを組み合わせて血管性皮膚問題を総合的に治療します。エクセルV+の532nm KTPレーザーが拡張した血管を選択的に凝固し、ADVATXの1,319nmレーザーが周辺組織を強化して紅潮の再発を抑制します。顔面紅潮・毛細血管拡張・酒さに効果的です。",
        "面部红肌激光复合治疗结合Excel V+和ADVATX两种激光，综合治疗血管性皮肤问题。Excel V+的532nm KTP激光选择性凝固扩张的血管，ADVATX的1,319nm激光强化周围组织并抑制红肌复发。对面部红肌、毛细血管扩张和酒渣鼻有效。",
    ),
    "BBL 히어로 광치료는 광대역 광선(BBL)을 이용하여 피부의 혈관성 병변과 색소성 병변을 동시에 치료하는 시술입니다": (
        "BBL Hero phototherapy uses broadband light (BBL) to simultaneously treat vascular and pigmented lesions of the skin. It is effective for facial redness, telangiectasia, melasma, age spots, and overall skin tone improvement. The Hero upgrade version covers a wider area faster, shortening treatment time. Immediate return to daily activities is possible after treatment.",
        "BBLヒーロー光治療は広帯域光（BBL）を利用して皮膚の血管性病変と色素性病変を同時に治療する施術です。顔面紅潮・毛細血管拡張・肝斑・シミ・全体的な肌トーン改善に効果的です。ヒーローアップグレードバージョンは広い面積を速くカバーし、施術時間が短縮されます。施術後すぐに日常生活に復帰できます。",
        "BBL Hero光疗使用宽带光（BBL）同时治疗皮肤的血管性病变和色素性病变。对面部红肌、毛细血管扩张、黄褐斑、色斑和整体肤色改善有效。Hero升级版覆盖更大面积、速度更快，缩短治疗时间。治疗后可立即恢复日常活动。",
    ),
    # ── pigment ──────────────────────────────────────────────────────────────
    "엔라이튼3 피코초 레이저는 532nm·1,064nm·670nm 트리플 파장을 지원하여 표피와 진피의 다양한 색소 병변을 동시에 분해합니다": (
        "Enlighten3 picosecond laser supports 532nm·1,064nm·670nm triple wavelengths to simultaneously break down various pigmented lesions in both the epidermis and dermis. It is effective for melasma, age spots, freckles, tattoos, and seborrheic keratosis. The picosecond pulse finely shatters pigment particles to promote absorption and elimination from the body, minimizing damage to surrounding normal tissue.",
        "エンライトン3ピコ秒レーザーは532nm・1,064nm・670nmトリプル波長をサポートして表皮と真皮の様々な色素病変を同時に分解します。肝斑・シミ・そばかす・タトゥー・脂漏性角化症に効果的です。ピコ秒パルスで色素粒子を微細に粉砕して体内吸収・排出を促進し、周辺正常組織の損傷を最小化します。",
        "Enlighten3皮秒激光支持532nm·1,064nm·670nm三重波长，同时分解表皮和真皮的各种色素病变。对黄褐斑、色斑、雀斑、纹身和脂溢性角化症有效。皮秒脉冲将色素颗粒细化粉碎，促进体内吸收和排出，最大限度减少对周围正常组织的损伤。",
    ),
    "피코슈어(PicoSure)는 755nm 피코초 레이저로 색소 병변과 문신을 효과적으로 제거합니다": (
        "PicoSure is a 755nm picosecond laser that effectively removes pigmented lesions and tattoos. The picosecond pulse finely shatters pigment particles to promote absorption and elimination from the body. Effective for melasma, age spots, freckles, and multi-color tattoos, with immediate return to daily activities after treatment.",
        "ピコシュア（PicoSure）は755nmピコ秒レーザーで色素病変とタトゥーを効果的に除去します。ピコ秒パルスで色素粒子を微細に粉砕して体内吸収・排出を促進します。肝斑・シミ・そばかす・多色タトゥーに効果的で、施術後すぐに日常生活に復帰できます。",
        "PicoSure是755nm皮秒激光，有效去除色素病变和纹身。皮秒脉冲将色素颗粒细化粉碎，促进体内吸收和排出。对黄褐斑、色斑、雀斑和多色纹身有效，治疗后可立即恢复日常活动。",
    ),
    "엑셀V+와 엔라이튼3 복합 치료는 두 장비의 시너지 효과로 기미·잡티 등 다양한 색소 병변을 한 번에 복합적으로 개선합니다": (
        "Excel V+ and Enlighten3 combination treatment comprehensively improves various pigmented lesions including melasma and age spots in a single session through the synergistic effect of both devices. Excel V+'s 532nm wavelength blocks blood supply to pigmentation, while Enlighten3's picosecond laser breaks down pigment in both the epidermis and dermis. Immediate return to daily activities is possible after treatment.",
        "エクセルV+とエンライトン3複合治療は2つの機器のシナジー効果で肝斑・シミなど様々な色素病変を一度に複合的に改善します。エクセルV+の532nm波長が色素への血液供給を遮断し、エンライトン3のピコ秒レーザーが表皮と真皮の色素を分解します。施術後すぐに日常生活に復帰できます。",
        "Excel V+和Enlighten3复合治疗通过两种设备的协同效果，一次性综合改善黄褐斑、色斑等各种色素病变。Excel V+的532nm波长阻断色素的血液供应，Enlighten3的皮秒激光分解表皮和真皮的色素。治疗后可立即恢复日常活动。",
    ),
    "디스커버리 피코 레이저는 피코초 펄스로 색소 입자를 미세하게 분쇄하여 체내 흡수·배출을 촉진합니다": (
        "Discovery Pico laser uses picosecond pulses to finely shatter pigment particles to promote absorption and elimination from the body. Effective for melasma, age spots, freckles, tattoos, and seborrheic keratosis. Minimal damage to surrounding normal tissue, with immediate return to daily activities after treatment.",
        "ディスカバリーピコレーザーはピコ秒パルスで色素粒子を微細に粉砕して体内吸収・排出を促進します。肝斑・シミ・そばかす・タトゥー・脂漏性角化症に効果的です。周辺正常組織への損傷が最小限で、施術後すぐに日常生活に復帰できます。",
        "Discovery Pico激光使用皮秒脉冲将色素颗粒细化粉碎，促进体内吸收和排出。对黄褐斑、色斑、雀斑、纹身和脂溢性角化症有效。对周围正常组织的损伤最小，治疗后可立即恢复日常活动。",
    ),
    "기미 레이저 복합 치료는 엑셀V+와 엔라이튼3를 결합하여 기미·잡티를 체계적으로 개선합니다": (
        "Melasma laser combination treatment combines Excel V+ and Enlighten3 to systematically improve melasma and age spots. Excel V+'s 532nm wavelength blocks blood supply to pigmentation, while Enlighten3's picosecond laser breaks down pigment in both the epidermis and dermis. Immediate return to daily activities is possible after treatment.",
        "肝斑レーザー複合治療はエクセルV+とエンライトン3を組み合わせて肝斑・シミを体系的に改善します。エクセルV+の532nm波長が色素への血液供給を遮断し、エンライトン3のピコ秒レーザーが表皮と真皮の色素を分解します。施術後すぐに日常生活に復帰できます。",
        "黄褐斑激光复合治疗结合Excel V+和Enlighten3，系统性改善黄褐斑和色斑。Excel V+的532nm波长阻断色素的血液供应，Enlighten3的皮秒激光分解表皮和真皮的色素。治疗后可立即恢复日常活动。",
    ),
    "라셈드 울트라는 1927nm 파장대를 가진 툴리움 레이저로, 피부 표면에 조사했을 때 각질층에 존재하는 수분이 증발하여 수많은 미세구멍을 형성시켜 유효 성분의 흡수를 돕는 장비입니다": (
        "Lasemd Ultra is a thulium laser with a 1927nm wavelength. When irradiated on the skin surface, moisture in the stratum corneum evaporates to form numerous micropores that help absorb active ingredients. Both laser and skin booster treatment effects can be obtained simultaneously, with various effects including hydration, skin regeneration, elasticity increase, skin tone and melasma improvement, and radiance effects expected. FDA-approved safety, short treatment time, and almost no injection marks, bruising, or pain are key advantages. Supports 4 types of tips with various modes.",
        "ラセムドウルトラは1927nm波長帯を持つツリウムレーザーで、皮膚表面に照射すると角質層に存在する水分が蒸発して多数の微細孔を形成し、有効成分の吸収を助ける機器です。レーザーとスキンブースター施術効果を同時に得られ、水分補給・皮膚再生・弾力増加・肌トーン・肝斑改善・光沢効果など様々な効果が期待できます。FDA承認の安全性、短い施術時間、注射跡・青あざ・痛みがほとんどないことが特長です。様々なモードが可能な4種類のチップをサポートします。",
        "Lasemd Ultra是具有1927nm波长的铥激光，照射到皮肤表面时，角质层中的水分蒸发形成大量微孔，帮助有效成分吸收。可同时获得激光和皮肤补充剂治疗效果，可期待补水、皮肤再生、弹力增加、肤色和黄褐斑改善、光泽效果等多种效果。FDA认证安全性、短暂治疗时间、几乎没有注射痕迹、瘀伤或疼痛是主要优势。支持4种可进行各种模式的尖端。",
    ),
    # ── scar ──────────────────────────────────────────────────────────────────
    "뉴울트라펄스 앙코르 스카 FX는 미국 루메니스사의 탄산가스레이저에 프락셔널 기술의 스캐너가 장착된 레이저입니다": (
        "New UltraPulse Encore Scaar FX is a laser equipped with a fractional technology scanner on Lumenis's CO2 laser from the USA. With fractional technology, laser acts on one point while not acting on another, enabling treatment with powerful effects similar to traditional laser resurfacing but with fewer side effects and faster recovery. Shows approximately 5 times better results compared to regular Fraxel, with less pain and a wider treatment area per session, shortening treatment duration.",
        "ニューウルトラパルス アンコール スカーFXは米国ルメニス社のCO2レーザーにフラクショナル技術のスキャナーが装着されたレーザーです。フラクショナル技術で一点にレーザーが作用すると別の点には作用しない方式で、過去のレーザー剥離と同様の強力な治療効果を示しながら副作用が少なく回復が速い治療が可能です。一般フラクセルに比べて約5倍優れた効果を示し、痛みが少なく一度に治療する面積が広いため治療期間が短縮されます。",
        "New UltraPulse Encore Scaar FX是美国Lumenis公司CO2激光配备点阵技术扫描仪的激光。点阵技术使激光作用于一点而不作用于另一点，实现与传统激光磨皮相同的强效治疗效果，同时副作用更少、恢复更快。与普通Fraxel相比效果约好5倍，疼痛更少，每次治疗面积更大，缩短治疗周期。",
    ),
    "미라젯은 피부노화방지와 피부건강 개선 등 안티에이징을 위하여 주사바늘을 사용하지 않고 미량의 약물을 마이크로-젯(Micro-Jet)분사하여 진피층에 소량의 약물을 보다 효과적으로 전달하는 완전히 새로운 개념의 TDDS": (
        "Mirajet is a completely new concept TDDS (Trans-Dermal Drug Delivery System) for anti-aging purposes including skin aging prevention and skin health improvement, which effectively delivers small amounts of medication to the dermal layer by micro-jet spraying without needles. Ultra-high-speed micro-jet minimizes tissue damage and downtime, and treatment is possible without anesthetic cream application.",
        "ミラジェットは皮膚老化防止と皮膚健康改善などのアンチエイジングのために注射針を使用せず微量の薬物をマイクロジェット（Micro-Jet）噴射して真皮層に少量の薬物をより効果的に届ける全く新しい概念のTDDS（経皮薬物送達システム）です。超高速マイクロジェットで組織損傷が少なくダウンタイムが最小化され、麻酔クリーム適用なしで施術が可能です。",
        "Mirajet是一种全新概念的TDDS（经皮给药系统），用于皮肤抗老化，包括皮肤老化预防和皮肤健康改善，通过微喷（Micro-Jet）无针喷射微量药物，更有效地将少量药物输送到真皮层。超高速微喷减少组织损伤，最大限度减少停工期，无需涂抹麻醉霜即可进行治疗。",
    ),
    "DRT 진피재생술은 어븀야그 레이저의 핀홀 방식으로 진피층까지 직접적인 미세 구멍을 형성하여 새로운 피부 조직 생성을 유도합니다": (
        "DRT Dermis Resurfacing Therapy uses the erbium YAG laser's pinhole method to form direct micropores down to the dermal layer, inducing new skin tissue formation. Effective for acne scars, pores, and skin texture improvement. Immediate return to daily activities is possible after treatment.",
        "DRT真皮再生術はエルビウムYAGレーザーのピンホール方式で真皮層まで直接微細孔を形成して新しい皮膚組織生成を誘導します。ニキビ瘢痕・毛穴・肌質改善に効果的です。施術後すぐに日常生活に復帰できます。",
        "DRT真皮再生术使用铒YAG激光的针孔方式，在真皮层形成直接微孔，诱导新皮肤组织生成。对痘疤、毛孔和肌肤质感改善有效。治疗后可立即恢复日常活动。",
    ),
    "트리필프로는 HA 필러와 콜라겐 자극제를 결합한 복합 주사로 패인 흉터 부위에 즉각적인 볼륨을 채우고 콜라겐 생성을 유도합니다": (
        "TriFill Pro is a combined injection that combines HA filler and collagen stimulator to immediately fill sunken scar areas with volume and induce collagen production. Effective for acne scars, surgical scars, and sunken areas. Natural results can be expected as effects are maintained long-term.",
        "トリフィルプロはHAフィラーとコラーゲン刺激剤を組み合わせた複合注射で、陥没した瘢痕部位に即時ボリュームを補いコラーゲン生成を誘導します。ニキビ瘢痕・手術瘢痕・陥没部位に効果的です。効果が長期的に維持されるため自然な結果が期待できます。",
        "TriFill Pro是结合HA填充剂和胶原蛋白刺激剂的复合注射，立即为凹陷疤痕部位填充体积并诱导胶原蛋白生成。对痘疤、手术疤痕和凹陷部位有效。效果长期维持，可期待自然的结果。",
    ),
    "쥴 프로프락셔널은 미국 SCITON사의 프락셔널 레이저로 흉터·모공·피부결 개선에 효과적입니다": (
        "Joule ProFractional is a fractional laser from SCITON USA that is effective for scar, pore, and skin texture improvement. Precise ablation of the skin surface induces collagen regeneration to improve skin texture. Immediate return to daily activities is possible after treatment.",
        "ジュール プロフラクショナルは米国SCITON社のフラクショナルレーザーで瘢痕・毛穴・肌質改善に効果的です。皮膚表面の精密なアブレーションがコラーゲン再生を誘導して肌質を改善します。施術後すぐに日常生活に復帰できます。",
        "Joule ProFractional是美国SCITON公司的点阵激光，对疤痕、毛孔和肌肤质感改善有效。皮肤表面的精确消融诱导胶原蛋白再生，改善肌肤质感。治疗后可立即恢复日常活动。",
    ),
    "스킨젯은 무침 방식으로 약물을 진피층에 직접 전달하여 흉터 치료 효과를 높입니다": (
        "SkinJet delivers medications directly to the dermal layer in a needle-free manner to enhance scar treatment effects. It is effective for acne scars, surgical scars, and skin texture improvement. Immediate return to daily activities is possible after treatment.",
        "スキンジェットは無針方式で薬物を真皮層に直接届けて瘢痕治療効果を高めます。ニキビ瘢痕・手術瘢痕・肌質改善に効果的です。施術後すぐに日常生活に復帰できます。",
        "SkinJet以无针方式将药物直接传递到真皮层，提高疤痕治疗效果。对痘疤、手术疤痕和肌肤质感改善有效。治疗后可立即恢复日常活动。",
    ),
    # ── acne ──────────────────────────────────────────────────────────────────
    "여드름 흉터 복합 치료는 울트라펄스 레이저, DRT 진피재생술, 스킨젯, 트리필프로를 결합한 집중 프로그램입니다": (
        "Acne scar combination treatment is an intensive program combining UltraPulse laser, DRT dermis resurfacing therapy, SkinJet, and TriFill Pro. UltraPulse laser precisely removes scar surfaces, DRT induces dermal collagen regeneration, SkinJet delivers scar treatment medications needle-free, and TriFill Pro fills sunken areas. Performed under sedation for pain-free treatment.",
        "ニキビ瘢痕複合治療はウルトラパルスレーザー・DRT真皮再生術・スキンジェット・トリフィルプロを組み合わせた集中プログラムです。ウルトラパルスレーザーで瘢痕表面を精密に除去し、DRTで真皮コラーゲン再生を誘導し、スキンジェットで瘢痕治療薬物を無針で届け、トリフィルプロで陥没部位を補います。鎮静下施術で痛みなく治療を受けられます。",
        "痘疤复合治疗是结合超脉冲激光、DRT真皮再生术、SkinJet和TriFill Pro的集中项目。超脉冲激光精确去除疤痕表面，DRT诱导真皮胶原蛋白再生，SkinJet无针输送疤痕治疗药物，TriFill Pro填充凹陷部位。在镇静下进行，无痛治疗。",
    ),
    # ── whitening ──────────────────────────────────────────────────────────────
    "쥬베룩 스킨부스터는 히알루론산(HA)과 생분해성 PDLLA 마이크로스피어를 결합한 복합 제형입니다": (
        "Juvelook skin booster is a complex formulation combining hyaluronic acid (HA) and biodegradable PDLLA microspheres. HA provides immediate hydration while PDLLA gradually degrades to stimulate collagen production. Compared to conventional skin boosters, it has a longer duration of effects and comprehensively improves skin elasticity, radiance, and texture.",
        "ジュベルック スキンブースターはヒアルロン酸（HA）と生分解性PDLLAマイクロスフィアを組み合わせた複合製剤です。HAが即時水分を供給する一方でPDLLAが徐々に分解されコラーゲン生成を刺激します。従来のスキンブースターと比較して効果持続期間が長く、皮膚弾力・光沢・肌質改善効果が複合的に現れます。",
        "Juvelook皮肤补充剂是结合透明质酸（HA）和可生物降解PDLLA微球的复合制剂。HA提供即时补水，同时PDLLA逐渐降解刺激胶原蛋白生成。与传统皮肤补充剂相比，效果持续时间更长，皮肤弹力、光泽和质感改善效果综合显现。",
    ),
    # ── acne_laser ──────────────────────────────────────────────────────────────
    "아비클리어는 1,726nm 파장의 레이저로 피지선(sebaceous gland)를 선택적으로 표적하여 피지 분비를 억제합니다": (
        "AviClear is a laser with a 1,726nm wavelength that selectively targets sebaceous glands to suppress sebum secretion. It is the only FDA-approved acne laser that can continuously improve acne without medication. The skin gradually becomes clearer after treatment.",
        "アビクリアは1,726nm波長のレーザーで皮脂腺（sebaceous gland）を選択的にターゲットにして皮脂分泌を抑制します。薬物なしにニキビを継続的に改善できる唯一のFDA承認ニキビレーザーです。施術後に皮膚が徐々に明るくなる効果が現れます。",
        "AviClear是1,726nm波长的激光，选择性靶向皮脂腺（sebaceous gland）以抑制皮脂分泌。是唯一可以无需药物持续改善痘痘的FDA认证痘痘激光。治疗后皮肤逐渐变得更加清透。",
    ),
    "카프리는 여드름 치료에 특화된 이중 파장 레이저로, 532nm이 피지선 염증을 직접 표적하고 1,064nm이 진피층까지 침투하여 여드름 발생의 근본 원인을 차단합니다": (
        "Capri is a dual-wavelength laser specialized for acne treatment, where 532nm directly targets sebaceous gland inflammation and 1,064nm penetrates to the dermal layer to block the root cause of acne development.",
        "カプリはニキビ治療に特化したデュアル波長レーザーで、532nmが皮脂腺炎症を直接ターゲットにし、1,064nmが真皮層まで浸透してニキビ発生の根本原因を遮断します。",
        "Capri是专门用于痘痘治疗的双波长激光，532nm直接靶向皮脂腺炎症，1,064nm穿透到真皮层，阻断痘痘发生的根本原因。",
    ),
    "플라듀오는 플라즈마 에너지와 레이저를 함께 사용하는 복합 여드름 치료 시스템입니다": (
        "Pladuo is a combined acne treatment system that uses plasma energy and laser together. Plasma calms inflammation on the skin surface while laser directly suppresses sebaceous glands to comprehensively treat acne.",
        "プラデュオはプラズマエネルギーとレーザーを合わせて使用する複合ニキビ治療システムです。プラズマが皮膚表面の炎症を鎮静させ、レーザーが皮脂腺を直接抑制してニキビを総合的に治療します。",
        "Pladuo是同时使用等离子体能量和激光的复合痘痘治疗系统。等离子体镇静皮肤表面的炎症，激光直接抑制皮脂腺，综合治疗痘痘。",
    ),
    "플래티넘 나노입자를 여드름 부위에 도포한 후 특정 파장의 레이저를 조사하여 나노입자가 열에너지로 전환되어 여드름 박테리아를 선택적으로 파괴합니다": (
        "Platinum nanoparticles are applied to acne areas, then a specific wavelength laser is irradiated to convert the nanoparticles into thermal energy to selectively destroy acne bacteria. Effective for inflammatory acne without antibiotic side effects.",
        "白金ナノ粒子をニキビ部位に塗布した後、特定波長のレーザーを照射してナノ粒子が熱エネルギーに変換されてニキビ菌を選択的に破壊します。抗生物質の副作用なしに炎症性ニキビに効果的です。",
        "将铂纳米粒子涂抹在痘痘部位后，照射特定波长激光，使纳米粒子转换为热能，选择性破坏痘痘细菌。无抗生素副作用，对炎症性痘痘有效。",
    ),
    "네오젠 플라즈마는 질소 플라즈마 에너지를 이용하여 피부 표면을 재생하고 여드름·흉터를 개선합니다": (
        "Neogen Plasma uses nitrogen plasma energy to regenerate the skin surface and improve acne and scars. Effective for acne, acne scars, pores, and skin texture improvement. Immediate return to daily activities is possible after treatment.",
        "ネオジェン プラズマは窒素プラズマエネルギーを利用して皮膚表面を再生しニキビ・瘢痕を改善します。ニキビ・ニキビ瘢痕・毛穴・肌質改善に効果的です。施術後すぐに日常生活に復帰できます。",
        "Neogen Plasma利用氮等离子体能量再生皮肤表面，改善痘痘和疤痕。对痘痘、痘疤、毛孔和肌肤质感改善有效。治疗后可立即恢复日常活动。",
    ),
    # ── hair ──────────────────────────────────────────────────────────────────
    "핀포인트 레이저(PinPointe FootLaser)는 1064nm Nd:YAG 파장을 이용하여 손·발톱 아래 서식하는 진균만을 선택적으로 파괴하는 FDA 승인 무좀 전용 레이저입니다": (
        "PinPointe FootLaser is an FDA-approved nail fungus laser that uses 1064nm Nd:YAG wavelength to selectively destroy only the fungi living under fingernails and toenails. It does not affect surrounding healthy tissue and can be safely treated without the liver toxicity side effects of oral antifungals. Treatment time is short with almost no pain for comfortable treatment.",
        "ピンポイントレーザー（PinPointe FootLaser）は1064nm Nd:YAG波長を利用して手・足の爪の下に生息する真菌のみを選択的に破壊するFDA承認の水虫専用レーザーです。周辺の健康な組織には影響を与えず、経口抗真菌薬の肝毒性副作用なしに安全に治療できます。施術時間が短く痛みがほとんどなく快適に受けられます。",
        "PinPointe FootLaser是FDA认证的甲癣专用激光，利用1064nm Nd:YAG波长选择性破坏指甲和趾甲下的真菌。不影响周围健康组织，无需口服抗真菌药的肝毒性副作用即可安全治疗。治疗时间短，几乎无痛，可舒适接受治疗。",
    ),
    "힐러 1064 레이저(Nd:YAG 1064nm)는 진균이 서식하는 손·발톱 아래 조직에 선택적으로 침투하여 열에너지로 진균을 파괴합니다": (
        "Healer 1064 laser (Nd:YAG 1064nm) selectively penetrates tissue under fingernails and toenails where fungi live to destroy them with thermal energy. It can be safely treated without the liver toxicity side effects of oral antifungals, with immediate return to daily activities after treatment. Effective for thickened and discolored nails (onychomycosis), gradually recovering to a healthy state as new nails grow.",
        "ヒーラー1064レーザー（Nd:YAG 1064nm）は真菌が生息する手・足の爪の下の組織に選択的に浸透して熱エネルギーで真菌を破壊します。経口抗真菌薬の肝毒性副作用なしに安全に治療でき、施術後すぐに日常生活に復帰できます。厚くなり変色した手・足の爪（爪真菌症）に効果的で、新しい爪が伸びるにつれて徐々に健康な状態に回復します。",
        "Healer 1064激光（Nd:YAG 1064nm）选择性穿透指甲和趾甲下真菌生存的组织，用热能破坏真菌。无需口服抗真菌药的肝毒性副作用即可安全治疗，治疗后可立即恢复日常活动。对增厚和变色的指甲（甲癣）有效，随着新指甲生长逐渐恢复健康状态。",
    ),
    "오니코 레이저는 식품의약품안전처 허가를 획득한 최신형 발톱무좀 치료 레이저로, 양발을 동시에 치료할 수 있어 시술 시간을 크게 단축합니다": (
        "Onycho laser is the latest nail fungus treatment laser approved by the Ministry of Food and Drug Safety (MFDS) that can treat both feet simultaneously, greatly shortening treatment time. Laser energy precisely reaches fungi under the nails to destroy fungal organisms, minimizing damage to surrounding tissue. Can be safely applied even to patients with liver disease or pregnant women who have difficulty taking oral antifungals.",
        "オニコレーザーは食品医薬品安全処許可を取得した最新型爪水虫治療レーザーで、両足を同時に治療できるため施術時間を大幅に短縮します。レーザーエネルギーが爪の下の真菌に精密に到達して菌類を破壊し、周辺組織の損傷が最小化されます。経口抗真菌薬の服用が困難な肝疾患患者・妊婦にも安全に適用可能です。",
        "Onycho激光是获得食品药品安全处批准的最新甲癣治疗激光，可同时治疗双足，大大缩短治疗时间。激光能量精确到达指甲下的真菌，破坏真菌生物，最大限度减少对周围组织的损伤。即使是难以服用口服抗真菌药的肝病患者和孕妇也可安全应用。",
    ),
    "엑셀 토우(Excel Tow)는 KFDA 식약처 허가를 받은 비침습·비열성 레이저로, 양손발의 무좀 치료와 통증 완화를 동시에 수행합니다": (
        "Excel Tow is a KFDA-approved non-invasive, non-thermal laser that simultaneously performs fungal treatment and pain relief for both hands and feet. The non-thermal method minimizes burden on surrounding tissue, allowing comfortable treatment without pain. Compared to conventional thermal lasers, it has lower risk of side effects and faster recovery.",
        "エクセル トウ（Excel Tow）はKFDA食薬処許可を受けた非侵襲・非熱性レーザーで、両手足の水虫治療と痛み緩和を同時に行います。熱を使用しない方式で周辺組織への負担が最小化され、痛みなく快適に施術を受けられます。従来の熱方式レーザーに比べて副作用リスクが低く回復が速いです。",
        "Excel Tow是KFDA批准的非侵入性、非热性激光，同时对双手双脚进行甲癣治疗和疼痛缓解。非热性方式最大限度减少对周围组织的负担，无痛舒适地接受治疗。与传统热方式激光相比，副作用风险更低，恢复更快。",
    ),
    # ── vitiligo ──────────────────────────────────────────────────────────────
    "SST PRO(스킨 시딩 테크닉 PRO)는 모래알 피부이식술로 피부조직을 0.3Φ~0.1Φ 모래알 크기 또는 그보다 작게 채취하여, 백반증 부위에 피부를 이식합니다": (
        "SST PRO (Skin Seeding Technique PRO) is a sand grain skin grafting technique that harvests skin tissue at 0.3Φ~0.1Φ sand grain size or smaller and grafts it to vitiligo areas. It can more meticulously and systematically treat previously difficult-to-treat refractory vitiligo areas including the back of hands, facial area including hairline, joints, hands and feet, scar and stretch mark areas, and curved areas. Health insurance and actual loss insurance can be applied, with almost no bleeding or scarring and a high engraftment rate after skin grafting.",
        "SST PRO（スキン シーディング テクニック PRO）は砂粒皮膚移植術で皮膚組織を0.3Φ〜0.1Φの砂粒サイズまたはそれより小さく採取して、白斑部位に皮膚を移植します。従来治療が困難だった難治性白斑部位である手の甲・ヘアラインを含む顔面部・関節・手足・傷跡・妊娠線部位・曲面部位をより丁寧かつ体系的に施術できます。健康保険・実損保険適用が可能で、出血や傷跡がほとんどなく皮膚移植後の高い生着率を誇ります。",
        "SST PRO（皮肤播种技术PRO）是沙粒皮肤移植术，将皮肤组织采集至0.3Φ~0.1Φ沙粒大小或更小，移植到白癜风部位。可以更细致、系统地治疗以前难以治疗的难治性白癜风部位，包括手背、含发际线的面部、关节、手脚、疤痕和妊娠纹部位、曲面部位。可申请健康保险和实际损失保险，几乎没有出血或疤痕，皮肤移植后具有高生着率。",
    ),
    "엑시머 V7은 308nm 파장의 엑시머 레이저를 이용한 백반증·건선 전문 치료 장비입니다. 병변 부위에만 집중 조사하여 정상 피부 노출을 최소화하며, FDA 승인을 받은 안전한 장비입니다": (
        "Excimer V7 is a specialized treatment device for vitiligo and psoriasis using 308nm wavelength excimer laser. It concentrates irradiation only on lesion areas to minimize normal skin exposure, and is FDA-approved safe equipment. Particularly effective for vitiligo in exposed areas such as the face, neck, and hands.",
        "エキシマV7は308nm波長のエキシマレーザーを利用した白斑・乾癬専門治療機器です。病変部位のみに集中照射して正常皮膚の露出を最小化し、FDA承認を受けた安全な機器です。顔・首・手など露出部位の白斑に特に効果的です。",
        "Excimer V7是使用308nm波长准分子激光的白癜风和银屑病专科治疗设备。仅集中照射病变部位，最大限度减少正常皮肤暴露，是FDA认证的安全设备。对面部、颈部、手部等暴露部位的白癜风特别有效。",
    ),
    "전신자외선 치료기는 311nm 협대역 자외선B(NB-UVB)를 전신에 균일하게 조사하는 광선 치료 장비입니다. 전신에 광범위하게 분포한 백반증, 건선, 아토피 피부염, 다형 홍반 등 다양한 피부 질환에 효과적입니다": (
        "The whole-body UV treatment device is a phototherapy device that uniformly irradiates 311nm narrowband UVB (NB-UVB) to the entire body. Effective for various skin diseases widely distributed throughout the body including vitiligo, psoriasis, atopic dermatitis, and erythema multiforme. It suppresses skin inflammation through immune regulation effects and promotes pigment regeneration, with enhanced treatment effects when combined with medication therapy.",
        "全身紫外線治療器は311nm狭帯域紫外線B（NB-UVB）を全身に均一に照射する光線治療機器です。全身に広範囲に分布した白斑・乾癬・アトピー性皮膚炎・多形紅斑など様々な皮膚疾患に効果的です。免疫調節効果を通じて皮膚炎症を抑制し色素再生を促進し、薬物治療との併用で治療効果が向上します。",
        "全身紫外线治疗仪是将311nm窄带UVB（NB-UVB）均匀照射到全身的光线治疗设备。对全身广泛分布的白癜风、银屑病、特应性皮炎、多形性红斑等各种皮肤疾病有效。通过免疫调节效果抑制皮肤炎症并促进色素再生，与药物治疗联合使用时治疗效果增强。",
    ),
    "벨로시티 엑시머 V7은 308nm 파장의 엑시머 레이저를 이용해 건선 병변 부위의 T세포를 선택적으로 억제하여 빠른 호전을 유도하는 치료입니다": (
        "Velocity Excimer V7 is a treatment that uses 308nm wavelength excimer laser to selectively suppress T cells in psoriasis lesion areas to induce rapid improvement. Unlike whole-body phototherapy, it concentrates irradiation only on lesion areas to minimize normal skin exposure. FDA-approved safe treatment, particularly effective for psoriasis in exposed areas such as the scalp, elbows, knees, and hands.",
        "ベロシティ エキシマV7は308nm波長のエキシマレーザーを利用して乾癬病変部位のT細胞を選択的に抑制して速やかな改善を誘導する治療です。全身光線治療と異なり病変部位のみに集中照射して正常皮膚の露出を最小化します。FDA承認を受けた安全な治療法で、頭皮・肘・膝・手など露出部位の乾癬に特に効果的です。",
        "Velocity Excimer V7是使用308nm波长准分子激光选择性抑制银屑病病变部位T细胞，诱导快速改善的治疗。与全身光线治疗不同，仅集中照射病变部位，最大限度减少正常皮肤暴露。FDA认证的安全治疗方法，对头皮、肘部、膝盖、手部等暴露部位的银屑病特别有效。",
    ),
    "아토피 피부염 복합 치료는 NB-UVB 광선 치료와 집중 보습 치료, 항염 레이저를 결합한 종합 관리 프로그램입니다": (
        "Atopic dermatitis complex treatment is a comprehensive management program combining NB-UVB phototherapy, intensive moisturizing treatment, and anti-inflammatory laser. Phototherapy regulates skin immune response, laser treatment strengthens skin barrier function, and customized moisturizing treatment maintains skin hydration. Suitable for moderate to severe atopic dermatitis patients, helping to reduce steroid use.",
        "アトピー性皮膚炎複合治療はNB-UVB光線治療・集中保湿治療・抗炎症レーザーを組み合わせた総合管理プログラムです。光線治療で皮膚免疫反応を調節し、レーザー治療で皮膚バリア機能を強化し、カスタマイズ保湿治療で皮膚水分を維持します。中等度〜重症アトピー性皮膚炎患者に適しており、ステロイド使用を減らすのに役立ちます。",
        "特应性皮炎复合治疗是结合NB-UVB光线治疗、集中保湿治疗和抗炎激光的综合管理方案。光线治疗调节皮肤免疫反应，激光治疗强化皮肤屏障功能，定制保湿治疗维持皮肤水分。适合中度至重度特应性皮炎患者，有助于减少类固醇使用。",
    ),
}

EFFECT_TRANSLATIONS = {
    "얼굴 리프팅, 피부 탄력 개선, 주름 완화, 피부 재생, 수분 보충": (
        "Facial lifting, skin elasticity improvement, wrinkle reduction, skin regeneration, hydration",
        "顔のリフティング、皮膚弾力改善、しわ緩和、皮膚再生、水分補給",
        "面部提升、皮肤弹力改善、皱纹缓解、皮肤再生、补水",
    ),
    "피부 탄력 개선, 얼굴 리프팅, 콜라겐·엘라스틴 생성, 주름 완화, 피부 조직 강화": (
        "Skin elasticity improvement, facial lifting, collagen & elastin production, wrinkle reduction, skin tissue strengthening",
        "皮膚弾力改善、顔のリフティング、コラーゲン・エラスチン生成、しわ緩和、皮膚組織強化",
        "皮肤弹力改善、面部提升、胶原蛋白和弹性蛋白生成、皱纹缓解、皮肤组织强化",
    ),
    "볼 볼륨 회복, 팔자주름 개선, 피부 탄력 향상, 콜라겐 생성 유도, 2년 이상 효과 지속": (
        "Cheek volume restoration, nasolabial fold improvement, skin elasticity enhancement, collagen production induction, effects lasting 2+ years",
        "頬のボリューム回復、ほうれい線改善、皮膚弾力向上、コラーゲン生成誘導、2年以上効果持続",
        "面颊体积恢复、法令纹改善、皮肤弹力提升、诱导胶原蛋白生成、效果持续2年以上",
    ),
    "피부 재생, 탄력 개선, 수분 보충, 피부결 정돈, 노화 개선": (
        "Skin regeneration, elasticity improvement, hydration, skin texture refinement, aging improvement",
        "皮膚再生、弾力改善、水分補給、肌質整頓、老化改善",
        "皮肤再生、弹力改善、补水、肌肤质感整理、老化改善",
    ),
    "여드름 흉터 개선, 패인 흉터 볼륨 회복, 피부 재생, 콜라겐 생성 유도": (
        "Acne scar improvement, sunken scar volume restoration, skin regeneration, collagen production induction",
        "ニキビ瘢痕改善、陥没瘢痕ボリューム回復、皮膚再生、コラーゲン生成誘導",
        "痘疤改善、凹陷疤痕体积恢复、皮肤再生、诱导胶原蛋白生成",
    ),
    "안면홍조 개선, 모세혈관 확장 감소, 피부 붉기 완화, 주사비(로사세아) 치료": (
        "Facial redness improvement, telangiectasia reduction, skin redness relief, rosacea treatment",
        "顔面紅潮改善、毛細血管拡張減少、皮膚赤み緩和、酒さ（ロサセア）治療",
        "面部红肌改善、毛细血管扩张减少、皮肤红肌缓解、酒渣鼻治疗",
    ),
    "기미·잡티 개선, 피부 톤 밝기, 색소 침착 방지, 혈관 트러블 동시 개선": (
        "Melasma & age spot improvement, skin tone brightening, pigmentation prevention, simultaneous vascular problem improvement",
        "肝斑・シミ改善、肌トーン明るさ、色素沈着防止、血管トラブル同時改善",
        "黄褐斑和色斑改善、肤色提亮、防止色素沉着、同时改善血管问题",
    ),
    "다크서클 개선, 눈밑 볼록함 해소, 자연스러운 눈밑 라인, 피로해 보이는 인상 개선": (
        "Dark circle improvement, under-eye puffiness resolution, natural under-eye line, tired appearance improvement",
        "クマ改善、目の下の膨らみ解消、自然な目の下ライン、疲れた印象改善",
        "黑眼圈改善、眼袋消除、自然眼下轮廓、改善疲惫外观",
    ),
    "기미·잡티·문신 제거, 혈관 병변 개선, 피부 톤 밝기, 색소 침착 방지": (
        "Melasma, age spot & tattoo removal, vascular lesion improvement, skin tone brightening, pigmentation prevention",
        "肝斑・シミ・タトゥー除去、血管病変改善、肌トーン明るさ、色素沈着防止",
        "黄褐斑、色斑和纹身去除、血管病变改善、肤色提亮、防止色素沉着",
    ),
    "수분 공급, 피부 재생, 탄력 증가, 피부톤·기미 개선, 광채 효과": (
        "Hydration, skin regeneration, elasticity increase, skin tone & melasma improvement, radiance effect",
        "水分補給、皮膚再生、弾力増加、肌トーン・肝斑改善、光沢効果",
        "补水、皮肤再生、弹力增加、肤色和黄褐斑改善、光泽效果",
    ),
    "화상·수술·여드름 흉터 치료, 검버섯·잡티·기미 등 색소 질환 치료, 주름완화 및 피부톤·피부결 개선": (
        "Treatment of burn, surgical & acne scars, treatment of pigmented conditions including seborrheic keratosis, age spots & melasma, wrinkle reduction and skin tone & texture improvement",
        "火傷・手術・ニキビ瘢痕治療、脂漏性角化症・シミ・肝斑などの色素疾患治療、しわ緩和および肌トーン・肌質改善",
        "烧伤、手术和痘疤治疗，脂溢性角化症、色斑和黄褐斑等色素疾病治疗，皱纹缓解和肤色、肌肤质感改善",
    ),
    "여드름흉터·수술흉터·함몰된 흉터 개선, 모공수축, 튼살·피부결 개선": (
        "Acne scar, surgical scar & sunken scar improvement, pore reduction, stretch mark & skin texture improvement",
        "ニキビ瘢痕・手術瘢痕・陥没瘢痕改善、毛穴収縮、妊娠線・肌質改善",
        "痘疤、手术疤痕和凹陷疤痕改善、毛孔收缩、妊娠纹和肌肤质感改善",
    ),
    "여드름 흉터 개선, 모공 축소, 피부결 개선, 콜라겐 재생": (
        "Acne scar improvement, pore reduction, skin texture improvement, collagen regeneration",
        "ニキビ瘢痕改善、毛穴縮小、肌質改善、コラーゲン再生",
        "痘疤改善、毛孔收缩、肌肤质感改善、胶原蛋白再生",
    ),
    "피부 탄력 개선, 리프팅, 기미·잡티 개선, 홍조 완화, 화이트닝, 모공 축소": (
        "Skin elasticity improvement, lifting, melasma & age spot improvement, redness relief, whitening, pore reduction",
        "皮膚弾力改善、リフティング、肝斑・シミ改善、紅潮緩和、ホワイトニング、毛穴縮小",
        "皮肤弹力改善、提升、黄褐斑和色斑改善、红肌缓解、美白、毛孔收缩",
    ),
    "피부 탄력 개선, 잔주름 개선(리프팅), 콜라겐 생성 촉진(콜라겐 재생), 기미·주근깨 등 색소 치료(화이트닝)": (
        "Skin elasticity improvement, fine wrinkle improvement (lifting), collagen production promotion (collagen regeneration), pigmentation treatment including melasma & freckles (whitening)",
        "皮膚弾力改善、小じわ改善（リフティング）、コラーゲン生成促進（コラーゲン再生）、肝斑・そばかすなどの色素治療（ホワイトニング）",
        "皮肤弹力改善、细纹改善（提升）、促进胶原蛋白生成（胶原蛋白再生）、黄褐斑和雀斑等色素治疗（美白）",
    ),
    "즉각적인 수분 공급, 콜라겐 생성 유도, 피부 탄력·광채 개선, 효과 장기 지속": (
        "Immediate hydration, collagen production induction, skin elasticity & radiance improvement, long-lasting effects",
        "即時水分補給、コラーゲン生成誘導、皮膚弾力・光沢改善、効果長期持続",
        "即时补水、诱导胶原蛋白生成、皮肤弹力和光泽改善、效果长期持续",
    ),
    "염증성 여드름 개선, 피지 분비 억제, 장기적 여드름 예방, 피부 광채 개선": (
        "Inflammatory acne improvement, sebum secretion suppression, long-term acne prevention, skin radiance improvement",
        "炎症性ニキビ改善、皮脂分泌抑制、長期的ニキビ予防、皮膚光沢改善",
        "炎症性痘痘改善、皮脂分泌抑制、长期痘痘预防、皮肤光泽改善",
    ),
    "염증성 여드름 개선, 피지 분비 억제, 피부 광채 개선": (
        "Inflammatory acne improvement, sebum secretion suppression, skin radiance improvement",
        "炎症性ニキビ改善、皮脂分泌抑制、皮膚光沢改善",
        "炎症性痘痘改善、皮脂分泌抑制、皮肤光泽改善",
    ),
    "염증성 여드름 지료, 피부 재생, 피지 분비 억제, 피부 광채 개선": (
        "Inflammatory acne treatment, skin regeneration, sebum secretion suppression, skin radiance improvement",
        "炎症性ニキビ治療、皮膚再生、皮脂分泌抑制、皮膚光沢改善",
        "炎症性痘痘治疗、皮肤再生、皮脂分泌抑制、皮肤光泽改善",
    ),
    "여드름 치료, 피지 분비 억제, 피부 재생, 항생제 부작용 없는 안전한 치료": (
        "Acne treatment, sebum secretion suppression, skin regeneration, safe treatment without antibiotic side effects",
        "ニキビ治療、皮脂分泌抑制、皮膚再生、抗生物質副作用なしの安全な治療",
        "痘痘治疗、皮脂分泌抑制、皮肤再生、无抗生素副作用的安全治疗",
    ),
    "여드름 치료, 피부 재생, 피부결 개선, 피지 분비 억제": (
        "Acne treatment, skin regeneration, skin texture improvement, sebum secretion suppression",
        "ニキビ治療、皮膚再生、肌質改善、皮脂分泌抑制",
        "痘痘治疗、皮肤再生、肌肤质感改善、皮脂分泌抑制",
    ),
    "발톱 무좀 치료, 진균 파괴, 변색·비후 개선, 경구 항진균제 대체": (
        "Nail fungus treatment, fungal destruction, discoloration & thickening improvement, oral antifungal alternative",
        "爪水虫治療、真菌破壊、変色・肥厚改善、経口抗真菌薬代替",
        "甲癣治疗、真菌破坏、变色和增厚改善、口服抗真菌药替代",
    ),
    "양발 동시 치료, 발톱 진균 파괴, 변색·비후 개선, 간 부담 없는 안전한 치료": (
        "Simultaneous bilateral foot treatment, nail fungal destruction, discoloration & thickening improvement, safe treatment without liver burden",
        "両足同時治療、爪真菌破壊、変色・肥厚改善、肝臓負担なしの安全な治療",
        "双足同时治疗、趾甲真菌破坏、变色和增厚改善、无肝脏负担的安全治疗",
    ),
    "비침습 무좀 치료, 통증 완화, 양손발 동시 치료, 부작용 최소화": (
        "Non-invasive fungal treatment, pain relief, simultaneous bilateral hand and foot treatment, side effect minimization",
        "非侵襲水虫治療、痛み緩和、両手足同時治療、副作用最小化",
        "非侵入性甲癣治疗、疼痛缓解、双手双脚同时治疗、副作用最小化",
    ),
    "백반증 부위 색소 회복, 피부색 균일화, 높은 생착률, 보험 적용 가능": (
        "Vitiligo area pigment recovery, skin color uniformity, high engraftment rate, insurance applicable",
        "白斑部位色素回復、肌色均一化、高い生着率、保険適用可能",
        "白癜风部位色素恢复、肤色均匀化、高生着率、可申请保险",
    ),
    "백반증 색소 재생, 피부색 균일화, 병변 부위 집중 치료, 재발 억제": (
        "Vitiligo pigment regeneration, skin color uniformity, concentrated lesion treatment, recurrence suppression",
        "白斑色素再生、肌色均一化、病変部位集中治療、再発抑制",
        "白癜风色素再生、肤色均匀化、病变部位集中治疗、抑制复发",
    ),
    "전신 백반증 색소 재생, 건선·아토피 피부염 증상 완화, 피부 면역 조절": (
        "Whole-body vitiligo pigment regeneration, psoriasis & atopic dermatitis symptom relief, skin immune regulation",
        "全身白斑色素再生、乾癬・アトピー性皮膚炎症状緩和、皮膚免疫調節",
        "全身白癜风色素再生、银屑病和特应性皮炎症状缓解、皮肤免疫调节",
    ),
    "건선 병변 빠른 호전, 피부색 균일화, 자연스러운 피부 회복, 재발 억제": (
        "Rapid psoriasis lesion improvement, skin color uniformity, natural skin recovery, recurrence suppression",
        "乾癬病変の速やかな改善、肌色均一化、自然な皮膚回復、再発抑制",
        "银屑病病变快速改善、肤色均匀化、自然皮肤恢复、抑制复发",
    ),
    "아토피 가려움·염증 완화, 피부 장벽 강화, 스테로이드 의존도 감소, 삶의 질 향상": (
        "Atopic itching & inflammation relief, skin barrier strengthening, steroid dependency reduction, quality of life improvement",
        "アトピーのかゆみ・炎症緩和、皮膚バリア強化、ステロイド依存度減少、生活の質向上",
        "特应性皮炎瘙痒和炎症缓解、皮肤屏障强化、减少类固醇依赖、提高生活质量",
    ),
    "얼굴 리프팅, 스킨 타이트닝, 이중턱 개선, 잔주름 탄력 증대, 콜라겐 리모델링": (
        "Facial lifting, skin tightening, double chin improvement, fine wrinkle elasticity enhancement, collagen remodeling",
        "顔のリフティング、スキンタイトニング、二重顎改善、小じわ弾力増大、コラーゲンリモデリング",
        "面部提升、皮肤紧致、双下巴改善、细纹弹力增强、胶原蛋白重塑",
    ),
    "피부 재생, 탄력 개선, 수분 보충, 피부결 정돈, 무침 시술로 멍·출혈 최소화": (
        "Skin regeneration, elasticity improvement, hydration, skin texture refinement, minimized bruising & bleeding with needle-free treatment",
        "皮膚再生、弾力改善、水分補給、肌質整頓、無針施術で青あざ・出血最小化",
        "皮肤再生、弹力改善、补水、肌肤质感整理、无针治疗最小化瘀伤和出血",
    ),
}

SESSIONS_TRANSLATIONS = {
    "1~2회 (6~12개월 간격)": (
        "1–2 sessions (6–12 month intervals)",
        "1〜2回（6〜12ヶ月間隔）",
        "1~2次（间隔6~12个月）",
    ),
    "1~2회 (12개월 간격)": (
        "1–2 sessions (12-month intervals)",
        "1〜2回（12ヶ月間隔）",
        "1~2次（间隔12个月）",
    ),
    "2~3회 (4~6주 간격)": (
        "2–3 sessions (4–6 week intervals)",
        "2〜3回（4〜6週間隔）",
        "2~3次（间隔4~6周）",
    ),
    "1~3회 (담당 의료진 상담 후 결정)": (
        "1–3 sessions (determined after consultation with attending physician)",
        "1〜3回（担当医師との相談後に決定）",
        "1~3次（与主治医生咨询后决定）",
    ),
    "3~5회 (4~6주 간격)": (
        "3–5 sessions (4–6 week intervals)",
        "3〜5回（4〜6週間隔）",
        "3~5次（间隔4~6周）",
    ),
    "4~6회 (2~4주 간격)": (
        "4–6 sessions (2–4 week intervals)",
        "4〜6回（2〜4週間隔）",
        "4~6次（间隔2~4周）",
    ),
    "4~6회 (2주 간격)": (
        "4–6 sessions (2-week intervals)",
        "4〜6回（2週間隔）",
        "4~6次（间隔2周）",
    ),
    "3~5회 (2~4주 간격)": (
        "3–5 sessions (2–4 week intervals)",
        "3〜5回（2〜4週間隔）",
        "3~5次（间隔2~4周）",
    ),
    "3~5회 (4주 간격)": (
        "3–5 sessions (4-week intervals)",
        "3〜5回（4週間隔）",
        "3~5次（间隔4周）",
    ),
    "3~6회 (2~4주 간격)": (
        "3–6 sessions (2–4 week intervals)",
        "3〜6回（2〜4週間隔）",
        "3~6次（间隔2~4周）",
    ),
    "4~8회 (3~4주 간격)": (
        "4–8 sessions (3–4 week intervals)",
        "4〜8回（3〜4週間隔）",
        "4~8次（间隔3~4周）",
    ),
    "4~6회 (2~4주 간격)": (
        "4–6 sessions (2–4 week intervals)",
        "4〜6回（2〜4週間隔）",
        "4~6次（间隔2~4周）",
    ),
    "4~8회 (1~2주 간격)": (
        "4–8 sessions (1–2 week intervals)",
        "4〜8回（1〜2週間隔）",
        "4~8次（间隔1~2周）",
    ),
    "3회 (1개월 간격)": (
        "3 sessions (1-month intervals)",
        "3回（1ヶ月間隔）",
        "3次（间隔1个月）",
    ),
    "4~6회 (2주 간격)": (
        "4–6 sessions (2-week intervals)",
        "4〜6回（2週間隔）",
        "4~6次（间隔2周）",
    ),
    "4~8회 (2~4주 간격)": (
        "4–8 sessions (2–4 week intervals)",
        "4〜8回（2〜4週間隔）",
        "4~8次（间隔2~4周）",
    ),
    "1~2회 (필요에 따라 조정)": (
        "1–2 sessions (adjusted as needed)",
        "1〜2回（必要に応じて調整）",
        "1~2次（根据需要调整）",
    ),
    "1~3회 (필요에 따라 조정)": (
        "1–3 sessions (adjusted as needed)",
        "1〜3回（必要に応じて調整）",
        "1~3次（根据需要调整）",
    ),
    "주 2~3회 (장기 치료, 총 30~50회)": (
        "2–3 times/week (long-term treatment, total 30–50 sessions)",
        "週2〜3回（長期治療、合計30〜50回）",
        "每周2~3次（长期治疗，共30~50次）",
    ),
    "주 2~3회 (총 10~20회)": (
        "2–3 times/week (total 10–20 sessions)",
        "週2〜3回（合計10〜20回）",
        "每周2~3次（共10~20次）",
    ),
    "주 2~3회 (총 20~30회, 유지 치료 병행)": (
        "2–3 times/week (total 20–30 sessions, with maintenance treatment)",
        "週2〜3回（合計20〜30回、維持治療併行）",
        "每周2~3次（共20~30次，同时进行维持治疗）",
    ),
    "3~4회 (4주 간격)": (
        "3–4 sessions (4-week intervals)",
        "3〜4回（4週間隔）",
        "3~4次（间隔4周）",
    ),
}

def add_translation_after(content, field_name, ko_value, en_val, ja_val, zh_val):
    """ko_value를 가진 field_name 필드 뒤에 번역 필드를 추가"""
    # 이미 번역이 있는 경우 스킵
    en_field = f"{field_name}En:"
    if en_field in content and en_val in content:
        return content
    
    # 정확한 패턴 매칭
    old = f'{field_name}: "{ko_value}"'
    if old not in content:
        return content
    
    # 이미 번역 필드가 바로 뒤에 있는지 확인
    idx = content.find(old)
    if idx == -1:
        return content
    
    after_idx = idx + len(old)
    # 다음 줄 확인
    next_part = content[after_idx:after_idx+50]
    if f"{field_name}En:" in next_part or f"{field_name}Ja:" in next_part:
        return content  # 이미 번역 있음
    
    new = f'{field_name}: "{ko_value}",\n      {field_name}En: "{en_val}",\n      {field_name}Ja: "{ja_val}",\n      {field_name}Zh: "{zh_val}"'
    return content.replace(old, new, 1)

# detail 번역 추가
for ko_snippet, (en, ja, zh) in DETAIL_TRANSLATIONS.items():
    # ko_snippet의 첫 50자로 매칭
    search_key = ko_snippet[:60]
    # 파일에서 해당 detail 필드 찾기
    pattern = f'detail: "'
    idx = 0
    while True:
        idx = src.find(pattern, idx)
        if idx == -1:
            break
        # 해당 위치의 detail 값 추출
        end_idx = src.find('",', idx + len(pattern))
        if end_idx == -1:
            break
        detail_val = src[idx + len(pattern):end_idx]
        if search_key in detail_val:
            # 이미 번역이 있는지 확인
            after = src[end_idx:end_idx+100]
            if 'detailEn:' not in after and 'detailJa:' not in after:
                # 번역 추가
                old_str = f'detail: "{detail_val}"'
                new_str = f'detail: "{detail_val}",\n      detailEn: "{en}",\n      detailJa: "{ja}",\n      detailZh: "{zh}"'
                src = src.replace(old_str, new_str, 1)
            break
        idx += 1

# effect 번역 추가
for ko_val, (en, ja, zh) in EFFECT_TRANSLATIONS.items():
    old = f'effect: "{ko_val}"'
    if old in src:
        after_idx = src.find(old) + len(old)
        after = src[after_idx:after_idx+100]
        if 'effectEn:' not in after and 'effectJa:' not in after:
            new = f'effect: "{ko_val}",\n      effectEn: "{en}",\n      effectJa: "{ja}",\n      effectZh: "{zh}"'
            src = src.replace(old, new, 1)

# sessions 번역 추가
for ko_val, (en, ja, zh) in SESSIONS_TRANSLATIONS.items():
    old = f'sessions: "{ko_val}"'
    # 모든 occurrence 처리
    while old in src:
        after_idx = src.find(old) + len(old)
        after = src[after_idx:after_idx+100]
        if 'sessionsEn:' not in after and 'sessionsJa:' not in after:
            new = f'sessions: "{ko_val}",\n      sessionsEn: "{en}",\n      sessionsJa: "{ja}",\n      sessionsZh: "{zh}"'
            src = src.replace(old, new, 1)
        else:
            break

with open(SRC, "w", encoding="utf-8") as f:
    f.write(src)

print("번역 데이터 삽입 완료!")
print(f"최종 파일 크기: {len(src)} 바이트")

# 검증
detail_en_count = src.count('detailEn:')
effect_en_count = src.count('effectEn:')
sessions_en_count = src.count('sessionsEn:')
print(f"detailEn 필드 수: {detail_en_count}")
print(f"effectEn 필드 수: {effect_en_count}")
print(f"sessionsEn 필드 수: {sessions_en_count}")
