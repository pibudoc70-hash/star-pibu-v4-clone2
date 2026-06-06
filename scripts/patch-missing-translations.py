#!/usr/bin/env python3
"""
43개 누락 detail/effect/sessions 항목에 EN/JA/ZH 번역 추가 패치 스크립트
각 항목은 한국어 detail 텍스트의 앞부분으로 식별하여 번역 삽입
"""

import re

TRANSLATIONS = {
    # L574 - 런치타임 눈밑레이저
    "런치타임 눈밑레이저는 블랙 다이아몬드 입자 함유": {
        "detailEn": "Lunchtime under-eye laser uses a special patch containing black diamond particles that absorbs laser energy, combined with laser-induced shock wave technology to reduce under-eye fat and improve skin elasticity without direct tissue damage. Performed non-surgically without incisions, the short treatment time allows you to receive it even during a busy schedule.",
        "detailJa": "ランチタイムアイレーザーは、ブラックダイヤモンド粒子を含む特殊パッチとレーザー誘導衝撃波（Laser-induced shock wave）技術を活用し、直接的な組織損傷なしに目の下の脂肪減少と皮膚弾力向上を同時に改善する施術です。切開なしの非侵襲的な方法で行われ、短い施術時間で忙しいスケジュールでも気軽に受けられます。",
        "detailZh": "午休眼部激光使用含有黑钻石颗粒的特殊贴片，结合激光诱导冲击波技术，在不直接损伤组织的情况下同时减少眼袋脂肪和改善皮肤弹力。采用非手术、无切口方式进行，短暂的治疗时间让您即使在繁忙的日程中也能轻松接受治疗。",
        "sessionsEn": "4-6 sessions recommended (1-2 week intervals)",
        "sessionsJa": "4〜6回推奨（1〜2週間隔）",
        "sessionsZh": "建议4-6次（间隔1-2周）",
        "effectEn": "Targeted shock wave energy delivery to under-eye fat, reduction of fat layer volume & swelling, improvement of lymphatic circulation, elasticity & fine lines, return to daily life without incisions, bruising or scarring",
        "effectJa": "目の下の脂肪へのターゲット衝撃波エネルギー伝達、脂肪層の体積・むくみ減少、リンパ循環・弾力・小じわ改善、切開・内出血・傷跡の心配なく日常生活復帰可能",
        "effectZh": "向眼袋脂肪定向传递冲击波能量，减少脂肪层体积和浮肿，改善淋巴循环、弹力和细纹，无需切口、瘀青或疤痕即可恢复日常生活",
    },
    # L596 - ADVATX (rosacea)
    "ADVATX는 1,319nm 파장의 Nd:YAG 레이저로, 혈관 치료와 함께 진피 내 콜라겐 재생을": {
        "detailEn": "ADVATX uses a 1,319nm Nd:YAG laser that simultaneously stimulates collagen regeneration in the dermis alongside vascular treatment. It is selectively absorbed by oxyhemoglobin in blood vessels, coagulating and closing dilated vessels, while simultaneously inducing collagen production through dermal heating. The non-ablative approach leaves no wounds on the skin surface, allowing immediate return to daily activities after treatment. It can be expected to improve facial redness, telangiectasia, and rosacea, along with skin elasticity improvement.",
        "detailJa": "ADVATXは1,319nm波長のNd:YAGレーザーで、血管治療と同時に真皮内のコラーゲン再生を刺激する機器です。血管内の酸化ヘモグロビンに選択的に吸収されて拡張した血管を凝固・閉塞し、同時に真皮加熱によりコラーゲン生成を誘導します。皮膚表面に傷をつけない非アブレーション方式で施術後すぐに日常復帰が可能なのが特徴です。顔面紅潮・毛細血管拡張・酒さ治療とともに皮膚弾力改善効果も期待できます。",
        "detailZh": "ADVATX使用1,319nm波长的Nd:YAG激光，在血管治疗的同时刺激真皮内胶原蛋白再生。它被血管内的氧合血红蛋白选择性吸收，凝固并闭合扩张的血管，同时通过真皮加热诱导胶原蛋白生成。非消融方式不在皮肤表面留下伤口，治疗后可立即恢复日常生活。可期待改善面部潮红、毛细血管扩张、玫瑰痤疮，同时改善皮肤弹力。",
        "sessionsEn": "4-6 sessions (2-4 week intervals)",
        "sessionsJa": "4〜6回（2〜4週間隔）",
        "sessionsZh": "4-6次（间隔2-4周）",
        "effectEn": "Facial redness improvement, telangiectasia reduction, rosacea treatment, skin elasticity improvement, collagen production stimulation",
        "effectJa": "顔面紅潮改善、毛細血管拡張減少、酒さ治療、皮膚弾力改善、コラーゲン生成誘導",
        "effectZh": "改善面部潮红，减少毛细血管扩张，治疗玫瑰痤疮，改善皮肤弹力，刺激胶原蛋白生成",
    },
    # L611 - BBL (rosacea)
    "BBL(BroadBand Light)은 Sciton사의 IPL 기반 광치료 장비로, 다양한 파장 필터를 활용하여 홍조": {
        "detailEn": "BBL (BroadBand Light) is Sciton's IPL-based phototherapy device that uses various wavelength filters to comprehensively improve redness, pigmentation, and skin aging. In particular, BBL HERO mode delivers faster and more powerful energy than conventional IPL, improving treatment efficiency. Stanford University research reported that regular BBL treatments can reverse skin gene expression to a younger state. You can expect improvement in redness, blemishes, pores, and skin texture all at once.",
        "detailJa": "BBL（BroadBand Light）はSciton社のIPLベースの光治療機器で、様々な波長フィルターを活用して紅潮・色素・皮膚老化を複合的に改善します。特にBBL HEROモードは従来のIPLより速く強力なエネルギーを伝達し、治療効率を高めます。スタンフォード大学の研究で定期的なBBL施術が皮膚の遺伝子発現を若い状態に戻す効果があると報告されました。紅潮・シミ・毛穴・肌質改善を一度に期待できます。",
        "detailZh": "BBL（宽带光）是Sciton公司基于IPL的光疗设备，利用各种波长滤波器综合改善潮红、色素和皮肤老化。特别是BBL HERO模式比传统IPL传递更快更强的能量，提高治疗效率。斯坦福大学研究报告称，定期BBL治疗可以将皮肤基因表达恢复到年轻状态。可以期待一次性改善潮红、色斑、毛孔和肤质。",
        "sessionsEn": "3-5 sessions (3-4 week intervals)",
        "sessionsJa": "3〜5回（3〜4週間隔）",
        "sessionsZh": "3-5次（间隔3-4周）",
        "effectEn": "Facial redness improvement, pigmentation reduction, pore minimization, skin texture improvement, anti-aging effect",
        "effectJa": "顔面紅潮改善、色素沈着軽減、毛穴縮小、肌質改善、アンチエイジング効果",
        "effectZh": "改善面部潮红，减少色素沉着，缩小毛孔，改善肤质，抗衰老效果",
    },
    # L627 - Excel V+ (rosacea)
    "Excel V+는 532nm KTP 레이저와 1,064nm Nd:YAG 레이저 두 가지 파장을 탑재한 혈관 치료 전문 레이저": {
        "detailEn": "Excel V+ is a vascular treatment laser equipped with two wavelengths: 532nm KTP laser and 1,064nm Nd:YAG laser. The 532nm wavelength is selectively absorbed by superficial vessels and pigmentation, while the 1,064nm wavelength reaches deeper vascular lesions. It is selectively absorbed by hemoglobin in blood vessels, coagulating and closing vessels without damaging surrounding tissue. It is used for various vascular lesions including facial redness, telangiectasia, rosacea, hemangiomas, and cherry angiomas.",
        "detailJa": "Excel V+は532nm KTPレーザーと1,064nm Nd:YAGレーザーの2種類の波長を搭載した血管治療専門レーザーです。532nm波長は表在性血管と色素に選択的に吸収され、1,064nm波長はより深い層の血管病変に到達します。血管内ヘモグロビンに選択的に吸収されて周囲組織損傷なしに血管のみを凝固・閉塞するのが特徴です。顔面紅潮・毛細血管拡張・酒さ・血管腫・チェリー血管腫など様々な血管病変に活用されます。",
        "detailZh": "Excel V+是配备532nm KTP激光和1,064nm Nd:YAG激光两种波长的血管治疗专用激光。532nm波长被浅表血管和色素选择性吸收，1,064nm波长可到达更深层的血管病变。它被血管内血红蛋白选择性吸收，在不损伤周围组织的情况下凝固并闭合血管。用于面部潮红、毛细血管扩张、玫瑰痤疮、血管瘤、樱桃状血管瘤等各种血管病变。",
        "sessionsEn": "3-5 sessions (3-4 week intervals)",
        "sessionsJa": "3〜5回（3〜4週間隔）",
        "sessionsZh": "3-5次（间隔3-4周）",
        "effectEn": "Facial redness improvement, telangiectasia reduction, rosacea treatment, hemangioma removal, skin tone evening",
        "effectJa": "顔面紅潮改善、毛細血管拡張減少、酒さ治療、血管腫除去、肌トーン均一化",
        "effectZh": "改善面部潮红，减少毛细血管扩张，治疗玫瑰痤疮，去除血管瘤，均匀肤色",
    },
    # L643 - 펜토 9900 (pigment)
    "펜토 9900은 755nm 알렉산드라이트 레이저와 1064nm 앤디야그 레이저로 구성된 듀얼 파장 레이저": {
        "detailEn": "Pento 9900 is a dual-wavelength laser consisting of a 755nm alexandrite laser and a 1064nm Nd:YAG laser. It can treat pigmentation including melasma, freckles, and blemishes, as well as flat warts that are difficult to treat, while also improving elasticity, lifting, and skin tone. The cooling system protects the skin and saves treatment time, and various pulse widths provide safe and improved results during treatment. It is effective for refractory melasma and recurrent melasma, and can simultaneously improve pigmentation and elasticity using wavelengths effective for both.",
        "detailJa": "ペント9900は755nmアレキサンドライトレーザーと1064nm Nd:YAGレーザーで構成されたデュアル波長レーザーです。シミ、そばかす、雑色素などの色素治療はもちろん、治療が難しい扁平疣贅の除去とともに弾力、リフティング、肌トーン改善まで可能です。冷却システムで皮膚を保護し施術時間を節約し、様々なパルス幅で施術時に安全で向上した結果を提供します。難治性シミと再発性シミに効果的で、色素と弾力に効果的な波長を同時に活用して色素/弾力同時改善が可能です。",
        "detailZh": "Pento 9900是由755nm翠绿宝石激光和1064nm Nd:YAG激光组成的双波长激光。不仅可以治疗黄褐斑、雀斑、杂色素等色素，还可以去除难以治疗的扁平疣，同时改善弹力、提升和肤色。冷却系统保护皮肤并节省治疗时间，各种脉冲宽度在治疗时提供安全且改善的结果。对难治性黄褐斑和复发性黄褐斑有效，同时利用对色素和弹力有效的波长，可以同时改善色素/弹力。",
        "sessionsEn": "5-10 sessions (2-4 week intervals)",
        "sessionsJa": "5〜10回（2〜4週間隔）",
        "sessionsZh": "5-10次（间隔2-4周）",
        "effectEn": "Melasma and pigmentation treatment, flat wart removal, skin tone improvement, elasticity enhancement, lifting effect",
        "effectJa": "シミ・色素治療、扁平疣贅除去、肌トーン改善、弾力向上、リフティング効果",
        "effectZh": "治疗黄褐斑和色素，去除扁平疣，改善肤色，增强弹力，提升效果",
    },
    # L659 - Lumenis-V
    "Lumenis-V는 Lumenis사의 혈관 전문 레이저로, 532nm KTP 레이저와 1,064nm Nd:YAG 레이저를 탑재하고 있습니다": {
        "detailEn": "Lumenis-V is Lumenis's vascular specialist laser, equipped with 532nm KTP laser and 1,064nm Nd:YAG laser. The combination of two wavelengths allows comprehensive treatment from superficial vessels to deep vascular lesions. It is selectively absorbed by hemoglobin in blood vessels, coagulating and closing vessels without damaging surrounding tissue. It is used for various vascular lesions including facial redness, telangiectasia, hemangiomas, cherry angiomas, and spider angiomas.",
        "detailJa": "Lumenis-VはLumenis社の血管専門レーザーで、532nm KTPレーザーと1,064nm Nd:YAGレーザーを搭載しています。2つの波長の組み合わせで表在性血管から深い層の血管病変まで幅広く対応できます。血管内ヘモグロビンに選択的に吸収されて周囲組織損傷なしに血管を凝固・閉塞し、顔面紅潮・毛細血管拡張・血管腫・チェリー血管腫・クモ状血管腫など様々な血管病変治療に活用されます。",
        "detailZh": "Lumenis-V是Lumenis公司的血管专用激光，配备532nm KTP激光和1,064nm Nd:YAG激光。两种波长的组合可以从浅表血管到深层血管病变进行全面治疗。它被血管内血红蛋白选择性吸收，在不损伤周围组织的情况下凝固并闭合血管，用于面部潮红、毛细血管扩张、血管瘤、樱桃状血管瘤、蜘蛛状血管瘤等各种血管病变治疗。",
        "sessionsEn": "3-5 sessions (3-4 week intervals)",
        "sessionsJa": "3〜5回（3〜4週間隔）",
        "sessionsZh": "3-5次（间隔3-4周）",
        "effectEn": "Vascular lesion treatment, facial redness improvement, telangiectasia reduction, hemangioma removal",
        "effectJa": "血管病変治療、顔面紅潮改善、毛細血管拡張減少、血管腫除去",
        "effectZh": "治疗血管病变，改善面部潮红，减少毛细血管扩张，去除血管瘤",
    },
    # L674 - 시너지 Cynergy
    "시너지(Cynergy)는 595nm PDL(Pulsed Dye Laser)과 1,064nm Nd:YAG 레이저를 동시에 조사할": {
        "detailEn": "Cynergy is a combined vascular laser that can simultaneously irradiate 595nm PDL (Pulsed Dye Laser) and 1,064nm Nd:YAG laser. The 595nm wavelength is effective for superficial vessels and redness, while the 1,064nm wavelength reaches deeper vascular lesions. The Multiplex technology that simultaneously irradiates two wavelengths can address a wider range of vascular lesions compared to single treatment. It is used for facial redness, telangiectasia, hemangiomas, and port-wine stains.",
        "detailJa": "シナジー（Cynergy）は595nm PDL（パルス色素レーザー）と1,064nm Nd:YAGレーザーを同時に照射できる複合血管レーザーです。595nm波長は表在性血管と紅潮に効果的で、1,064nm波長はより深い層の血管病変に到達します。2つの波長を同時に照射するMultiplex技術で単独治療より広い範囲の血管病変に対応できます。顔面紅潮・毛細血管拡張・血管腫・ポートワイン母斑などに活用されます。",
        "detailZh": "Cynergy是可以同时照射595nm PDL（脉冲染料激光）和1,064nm Nd:YAG激光的复合血管激光。595nm波长对浅表血管和潮红有效，1,064nm波长可到达更深层的血管病变。同时照射两种波长的Multiplex技术可以处理比单独治疗更广泛的血管病变。用于面部潮红、毛细血管扩张、血管瘤和葡萄酒色斑。",
        "sessionsEn": "3-5 sessions (3-4 week intervals)",
        "sessionsJa": "3〜5回（3〜4週間隔）",
        "sessionsZh": "3-5次（间隔3-4周）",
        "effectEn": "Facial redness improvement, vascular lesion treatment, hemangioma removal, port-wine stain treatment",
        "effectJa": "顔面紅潮改善、血管病変治療、血管腫除去、ポートワイン母斑治療",
        "effectZh": "改善面部潮红，治疗血管病变，去除血管瘤，治疗葡萄酒色斑",
    },
    # L691 - 큐어맥스 (pigment)
    "큐어맥스는 다파장 복합 레이저 플랫폼으로, 기미·잡티·검버섯·일광 흑자 등 다양한 색소 병변 치료에 활용됩니다": {
        "detailEn": "CureMax is a multi-wavelength combined laser platform used for treating various pigmented lesions including melasma, blemishes, seborrheic keratosis, and solar lentigines. By combining multiple wavelengths, it simultaneously targets pigmentation in the epidermis and dermis, and skin regeneration effects can also be expected. Customized treatment is possible by adjusting the wavelength and energy according to the depth and type of pigmented lesion.",
        "detailJa": "キュアマックスは多波長複合レーザープラットフォームで、シミ・雑色素・脂漏性角化症・日光黒子など様々な色素病変治療に活用されます。複数の波長を組み合わせて表皮と真皮の色素を同時にターゲットし、皮膚再生効果も合わせて期待できます。色素病変の深さと種類に応じて波長とエネルギーを調整してカスタマイズ治療が可能です。",
        "detailZh": "CureMax是多波长复合激光平台，用于治疗黄褐斑、杂色素、脂溢性角化病、日光性黑子等各种色素病变。通过组合多种波长，同时靶向表皮和真皮的色素，还可以期待皮肤再生效果。可以根据色素病变的深度和类型调整波长和能量，进行定制化治疗。",
        "sessionsEn": "5-10 sessions (2-4 week intervals)",
        "sessionsJa": "5〜10回（2〜4週間隔）",
        "sessionsZh": "5-10次（间隔2-4周）",
        "effectEn": "Melasma and pigmentation treatment, seborrheic keratosis removal, skin tone improvement, skin regeneration",
        "effectJa": "シミ・色素治療、脂漏性角化症除去、肌トーン改善、皮膚再生",
        "effectZh": "治疗黄褐斑和色素，去除脂溢性角化病，改善肤色，皮肤再生",
    },
    # L704 - 스타워커 MAQX
    "스타워커 MAQX는 Q-스위치 Nd:YAG 레이저와 피코초 레이저를 결합한 복합 색소 치료 장비": {
        "detailEn": "StarWalker MAQX is a combined pigmentation treatment device combining Q-switched Nd:YAG laser and picosecond laser. Supporting multiple wavelengths of 532nm, 1064nm, 585nm, and 650nm, it addresses various pigmented lesions including melasma, blemishes, tattoos, seborrheic keratosis, and Ota's nevus. Picosecond pulses finely crush pigment particles to promote absorption and excretion by the body, minimizing damage to surrounding normal tissue. Immediate return to daily activities is possible after treatment.",
        "detailJa": "スターウォーカーMAQXはQスイッチNd:YAGレーザーとピコ秒レーザーを組み合わせた複合色素治療機器です。532nm・1064nm・585nm・650nmの多重波長をサポートし、シミ・雑色素・タトゥー・脂漏性角化症・太田母斑など様々な色素病変に対応します。ピコ秒パルスで色素粒子を微細に粉砕して体内吸収・排出を促進し、周囲の正常組織損傷を最小化します。施術後すぐに日常復帰が可能で忙しい日常でも継続的に管理できます。",
        "detailZh": "StarWalker MAQX是结合Q开关Nd:YAG激光和皮秒激光的复合色素治疗设备。支持532nm、1064nm、585nm、650nm多重波长，处理黄褐斑、杂色素、纹身、脂溢性角化病、太田痣等各种色素病变。皮秒脉冲将色素颗粒细碎粉碎，促进体内吸收和排出，最大限度减少对周围正常组织的损伤。治疗后可立即恢复日常生活，即使在繁忙的日常中也能持续管理。",
        "sessionsEn": "5-10 sessions (2-4 week intervals)",
        "sessionsJa": "5〜10回（2〜4週間隔）",
        "sessionsZh": "5-10次（间隔2-4周）",
        "effectEn": "Melasma and pigmentation treatment, tattoo removal, seborrheic keratosis removal, skin tone improvement",
        "effectJa": "シミ・色素治療、タトゥー除去、脂漏性角化症除去、肌トーン改善",
        "effectZh": "治疗黄褐斑和色素，去除纹身，去除脂溢性角化病，改善肤色",
    },
    # L718 - Enlighten III
    "Enlighten III는 Cutera사의 트리플 파장(532nm·1064nm·670nm) 피코초·나노초 듀얼 펌스 레이저": {
        "detailEn": "Enlighten III is Cutera's triple wavelength (532nm, 1064nm, 670nm) picosecond/nanosecond dual pulse laser. Picosecond (ultrashort) pulses crush pigment particles to nanoscale, and nanosecond pulses reach pigmentation in deeper layers. It addresses various pigmented lesions including melasma, blemishes, tattoos, seborrheic keratosis, and solar lentigines, while minimizing damage to surrounding normal tissue and effectively breaking down pigmentation.",
        "detailJa": "Enlighten IIIはCutera社のトリプル波長（532nm・1064nm・670nm）ピコ秒・ナノ秒デュアルパルスレーザーです。ピコ秒（超短波）パルスで色素粒子をナノ単位に粉砕し、ナノ秒パルスでより深い層の色素まで到達します。シミ・雑色素・タトゥー・脂漏性角化症・日光黒子など様々な色素病変に対応し、周囲の正常組織損傷を最小化しながら色素を効果的に分解します。",
        "detailZh": "Enlighten III是Cutera公司的三波长（532nm、1064nm、670nm）皮秒/纳秒双脉冲激光。皮秒（超短波）脉冲将色素颗粒粉碎至纳米级，纳秒脉冲可到达更深层的色素。处理黄褐斑、杂色素、纹身、脂溢性角化病、日光性黑子等各种色素病变，同时最大限度减少对周围正常组织的损伤，有效分解色素。",
        "sessionsEn": "5-10 sessions (2-4 week intervals)",
        "sessionsJa": "5〜10回（2〜4週間隔）",
        "sessionsZh": "5-10次（间隔2-4周）",
        "effectEn": "Melasma and pigmentation treatment, tattoo removal, skin tone improvement, skin regeneration",
        "effectJa": "シミ・色素治療、タトゥー除去、肌トーン改善、皮膚再生",
        "effectZh": "治疗黄褐斑和色素，去除纹身，改善肤色，皮肤再生",
    },
    # L731 - 엑셀V 플러스 (pigment)
    "엑셀V 플러스 레이저는 눈에 띄는 혈관, 색소와 주름을 빠르고 간단하게 치료하는 레이저로 20가지 이상의 피부": {
        "detailEn": "Excel V Plus laser is a laser that quickly and simply treats visible blood vessels, pigmentation, and wrinkles, solving more than 20 skin problems. By combining two precise and powerful lasers, it can treat both red/purple vascular lesions and brown pigmentation. The cooling system protects the skin during treatment, and the large spot size (12×20mm) enables fast treatment. It is effective for melasma, freckles, blemishes, facial redness, telangiectasia, and fine wrinkles.",
        "detailJa": "エクセルVプラスレーザーは目立つ血管、色素と皺を素早く簡単に治療するレーザーで20種類以上の皮膚問題を解決できます。精密で強力な2つのレーザーを組み合わせて赤・紫色の血管病変と茶色の色素沈着の両方を治療できます。冷却システムで施術中に皮膚を保護し、大きなチップ（12×20mm）で素早い施術が可能です。シミ、そばかす、雑色素、顔面紅潮、毛細血管拡張、小じわに効果的です。",
        "detailZh": "Excel V Plus激光是快速简单治疗明显血管、色素和皱纹的激光，可以解决20多种皮肤问题。通过组合两种精密强力的激光，可以治疗红色/紫色血管病变和棕色色素沉着。冷却系统在治疗过程中保护皮肤，大探头（12×20mm）可实现快速治疗。对黄褐斑、雀斑、杂色素、面部潮红、毛细血管扩张和细纹有效。",
        "sessionsEn": "3-5 sessions (3-4 week intervals)",
        "sessionsJa": "3〜5回（3〜4週間隔）",
        "sessionsZh": "3-5次（间隔3-4周）",
        "effectEn": "Vascular and pigmentation treatment, melasma improvement, facial redness reduction, fine wrinkle improvement",
        "effectJa": "血管・色素治療、シミ改善、顔面紅潮軽減、小じわ改善",
        "effectZh": "治疗血管和色素，改善黄褐斑，减少面部潮红，改善细纹",
    },
    # L745 - BBL (pigment)
    "BBL(BroadBand Light)은 Sciton사의 차세대 광치료 플랫폼으로, 515nm~1,200nm의 광범위한 파장 스펙트럼을 활용": {
        "detailEn": "BBL (BroadBand Light) is Sciton's next-generation phototherapy platform that utilizes a broad wavelength spectrum of 515nm to 1,200nm. It can simultaneously target pigmented lesions such as melasma, blemishes, solar lentigines, and seborrheic keratosis, as well as redness, pores, and skin aging. The BBL HERO mode delivers energy faster and more powerfully than conventional IPL, improving treatment efficiency. Regular BBL treatments have been reported to reverse skin gene expression to a younger state.",
        "detailJa": "BBL（BroadBand Light）はSciton社の次世代光治療プラットフォームで、515nm〜1,200nmの広範な波長スペクトルを活用します。シミ・雑色素・日光黒子・脂漏性角化症などの色素病変と紅潮・毛穴・皮膚老化を同時にターゲットできます。BBL HEROモードは従来のIPLより速く強力にエネルギーを伝達し治療効率を高めます。定期的なBBL施術が皮膚の遺伝子発現を若い状態に戻す効果があると報告されています。",
        "detailZh": "BBL（宽带光）是Sciton公司的下一代光疗平台，利用515nm至1,200nm的宽广波长谱。可以同时靶向黄褐斑、杂色素、日光性黑子、脂溢性角化病等色素病变以及潮红、毛孔和皮肤老化。BBL HERO模式比传统IPL更快更强地传递能量，提高治疗效率。据报道，定期BBL治疗可以将皮肤基因表达恢复到年轻状态。",
        "sessionsEn": "3-5 sessions (3-4 week intervals)",
        "sessionsJa": "3〜5回（3〜4週間隔）",
        "sessionsZh": "3-5次（间隔3-4周）",
        "effectEn": "Pigmentation treatment, facial redness improvement, pore minimization, skin texture improvement, anti-aging",
        "effectJa": "色素治療、顔面紅潮改善、毛穴縮小、肌質改善、アンチエイジング",
        "effectZh": "治疗色素，改善面部潮红，缩小毛孔，改善肤质，抗衰老",
    },
    # L758 - Lumenis One
    "Lumenis One은 IPL(Intense Pulsed Light) 기반의 복합 광치료 플랫폼입니다": {
        "detailEn": "Lumenis One is an IPL (Intense Pulsed Light)-based combined phototherapy platform. Using a broad wavelength spectrum of 515nm to 1,200nm and various cutoff filters, it can treat pigmented lesions, redness, vascular lesions, and skin aging. By selecting the appropriate filter for each skin concern, customized treatment is possible. It is used for melasma, freckles, blemishes, facial redness, telangiectasia, and skin tone improvement.",
        "detailJa": "Lumenis OneはIPL（強パルス光）ベースの複合光治療プラットフォームです。515nm〜1,200nmの広範な波長スペクトルと様々なカットオフフィルターを利用して色素病変・紅潮・血管病変・皮膚老化を治療できます。各肌悩みに合ったフィルターを選択することでカスタマイズ治療が可能です。シミ、そばかす、雑色素、顔面紅潮、毛細血管拡張、肌トーン改善に活用されます。",
        "detailZh": "Lumenis One是基于IPL（强脉冲光）的复合光疗平台。利用515nm至1,200nm的宽广波长谱和各种截止滤波器，可以治疗色素病变、潮红、血管病变和皮肤老化。通过为每种皮肤问题选择合适的滤波器，可以进行定制化治疗。用于黄褐斑、雀斑、杂色素、面部潮红、毛细血管扩张和肤色改善。",
        "sessionsEn": "3-5 sessions (3-4 week intervals)",
        "sessionsJa": "3〜5回（3〜4週間隔）",
        "sessionsZh": "3-5次（间隔3-4周）",
        "effectEn": "Pigmentation treatment, facial redness improvement, vascular lesion treatment, skin tone improvement",
        "effectJa": "色素治療、顔面紅潮改善、血管病変治療、肌トーン改善",
        "effectZh": "治疗色素，改善面部潮红，治疗血管病变，改善肤色",
    },
    # L770 - 펜토 9900 (pigment - 두번째)
    "펜토 9900은 1064nm Nd:YAG 레이저로 색소 병변과 혈관 병변을 복합적으로 치료하는 장비": {
        "detailEn": "Pento 9900 is a device that uses 1064nm Nd:YAG laser to comprehensively treat both pigmented and vascular lesions. The 1064nm wavelength that penetrates deep into the dermis effectively breaks down melasma, blemish, and tattoo pigmentation, and also treats deep vascular lesions. It can simultaneously improve pigmentation and vascular concerns, and the cooling system minimizes discomfort during treatment.",
        "detailJa": "ペント9900は1064nm Nd:YAGレーザーで色素病変と血管病変を複合的に治療する機器です。真皮深部まで浸透する1064nm波長でシミ・雑色素・タトゥー色素を効果的に分解し、深い層の血管病変も治療します。色素と血管の悩みを同時に改善でき、冷却システムで施術中の不快感を最小化します。",
        "detailZh": "Pento 9900是使用1064nm Nd:YAG激光综合治疗色素病变和血管病变的设备。渗透至真皮深层的1064nm波长有效分解黄褐斑、杂色素和纹身色素，还能治疗深层血管病变。可以同时改善色素和血管问题，冷却系统最大限度减少治疗过程中的不适。",
        "sessionsEn": "5-10 sessions (2-4 week intervals)",
        "sessionsJa": "5〜10回（2〜4週間隔）",
        "sessionsZh": "5-10次（间隔2-4周）",
        "effectEn": "Pigmentation and vascular treatment, melasma improvement, tattoo removal, skin tone improvement",
        "effectJa": "色素・血管治療、シミ改善、タトゥー除去、肌トーン改善",
        "effectZh": "治疗色素和血管，改善黄褐斑，去除纹身，改善肤色",
    },
    # L857 - DRT
    "DRT(Dermis Resurfacing Therapy)는 기존 프락셔널 레이저가 진피층에 Thermal Effect를 이용한": {
        "detailEn": "DRT (Dermis Resurfacing Therapy) induces skin regeneration using an erbium YAG pinhole (<100μm) fractional method, unlike conventional fractional lasers that use thermal effects in the dermis. The micro-pinhole method minimizes thermal damage to surrounding tissue while maximizing the skin regeneration effect. It is effective for acne scars, enlarged pores, and skin texture improvement, and can be used even on sensitive skin.",
        "detailJa": "DRT（Dermis Resurfacing Therapy）は、従来のフラクショナルレーザーが真皮層にThermal Effectを利用した皮膚再生を誘導するのとは異なり、エルビウムYAGピンホール（<100μm）方式のフラクショナル法で皮膚再生を誘導します。マイクロピンホール方式で周囲組織への熱損傷を最小化しながら皮膚再生効果を最大化します。ニキビ跡、毛穴の開き、肌質改善に効果的で、敏感肌にも使用できます。",
        "detailZh": "DRT（真皮重塑疗法）与传统点阵激光利用真皮层热效应诱导皮肤再生不同，采用铒YAG针孔（<100μm）方式的点阵法诱导皮肤再生。微针孔方式在最大化皮肤再生效果的同时，最大限度减少对周围组织的热损伤。对痘疤、毛孔粗大和肤质改善有效，也可用于敏感肌肤。",
        "sessionsEn": "3-5 sessions (4-6 week intervals)",
        "sessionsJa": "3〜5回（4〜6週間隔）",
        "sessionsZh": "3-5次（间隔4-6周）",
        "effectEn": "Acne scar improvement, pore minimization, skin texture improvement, skin regeneration",
        "effectJa": "ニキビ跡改善、毛穴縮小、肌質改善、皮膚再生",
        "effectZh": "改善痘疤，缩小毛孔，改善肤质，皮肤再生",
    },
    # L871 - 트리필프로
    "트리필프로(Trifill Pro)는 패인 흉터 부위에 히알루론산 필러 성분을 정밀하게 주입하여 즉각적인 볼륨": {
        "detailEn": "Trifill Pro precisely injects hyaluronic acid filler into depressed scar areas to provide immediate volume improvement effects. It fills the shadows and depressions caused by acne scars to even out the skin surface. The effect is immediate and can last 6-12 months. It is particularly effective for ice pick scars and rolling scars.",
        "detailJa": "トリフィルプロ（Trifill Pro）は陥没した傷跡部位にヒアルロン酸フィラー成分を精密に注入して即座のボリューム改善効果を提供します。ニキビ跡による影と陥没を埋めて皮膚表面を均一にします。効果は即座で6〜12ヶ月持続できます。特にアイスピック型傷跡とローリング型傷跡に効果的です。",
        "detailZh": "Trifill Pro将透明质酸填充剂精准注射到凹陷疤痕区域，提供即时的体积改善效果。填充痘疤造成的阴影和凹陷，使皮肤表面均匀。效果即时，可持续6-12个月。对冰锥型疤痕和滚动型疤痕特别有效。",
        "sessionsEn": "1-3 sessions (6-12 month intervals)",
        "sessionsJa": "1〜3回（6〜12ヶ月間隔）",
        "sessionsZh": "1-3次（间隔6-12个月）",
        "effectEn": "Immediate scar volume improvement, skin surface evening, shadow reduction, acne scar treatment",
        "effectJa": "即座の傷跡ボリューム改善、皮膚表面均一化、影の軽減、ニキビ跡治療",
        "effectZh": "即时改善疤痕体积，均匀皮肤表面，减少阴影，治疗痘疤",
    },
    # L884 - SST Pro
    "SST Pro는 흉터 조직에 직접 작용하는 복합 치료 장비로, 수술 흉터·외상 흉터·켈로이드·비후성 흉터 등": {
        "detailEn": "SST Pro is a combined treatment device that directly acts on scar tissue, used for various scar types including surgical scars, traumatic scars, keloids, and hypertrophic scars. It improves pigmentation in scar tissue and softens hardened scar tissue to improve the overall appearance of scars. The combination of multiple treatment modalities provides more effective results than single treatment.",
        "detailJa": "SST Proは傷跡組織に直接作用する複合治療機器で、手術傷跡・外傷傷跡・ケロイド・肥厚性瘢痕など様々な傷跡タイプに活用されます。傷跡の色素沈着を改善し、硬化した傷跡組織を軟化させて傷跡全体の外観を改善します。複数の治療モダリティの組み合わせで単独治療より効果的な結果を提供します。",
        "detailZh": "SST Pro是直接作用于疤痕组织的复合治疗设备，用于手术疤痕、外伤疤痕、瘢痕疙瘩、增生性疤痕等各种疤痕类型。改善疤痕组织中的色素沉着，软化硬化的疤痕组织，改善疤痕整体外观。多种治疗方式的组合比单独治疗提供更有效的结果。",
        "sessionsEn": "5-10 sessions (2-4 week intervals)",
        "sessionsJa": "5〜10回（2〜4週間隔）",
        "sessionsZh": "5-10次（间隔2-4周）",
        "effectEn": "Scar improvement, keloid treatment, hypertrophic scar reduction, pigmentation improvement",
        "effectJa": "傷跡改善、ケロイド治療、肥厚性瘢痕軽減、色素沈着改善",
        "effectZh": "改善疤痕，治疗瘢痕疙瘩，减少增生性疤痕，改善色素沉着",
    },
    # L898 - Sciton Joule
    "Sciton Joule 플랫폼의 프랙셔널 레이저는 여드름 흉터와 넓은 모공 개선에 특화되어 있습니다": {
        "detailEn": "The fractional laser of the Sciton Joule platform is specialized for improving acne scars and enlarged pores. The ablative fractional method that simultaneously stimulates the epidermis and dermis promotes skin regeneration and evens out skin texture. The precise energy control minimizes thermal damage to surrounding tissue while maximizing treatment effects.",
        "detailJa": "Sciton Jouléプラットフォームのフラクショナルレーザーはニキビ跡と毛穴の開き改善に特化しています。表皮と真皮を同時に刺激するアブレーティブフラクショナル方式で皮膚再生を促進し肌質を均一にします。精密なエネルギー制御で周囲組織への熱損傷を最小化しながら治療効果を最大化します。",
        "detailZh": "Sciton Joule平台的点阵激光专门用于改善痘疤和毛孔粗大。同时刺激表皮和真皮的消融点阵方式促进皮肤再生，使肤质均匀。精准的能量控制在最大化治疗效果的同时，最大限度减少对周围组织的热损伤。",
        "sessionsEn": "3-5 sessions (4-6 week intervals)",
        "sessionsJa": "3〜5回（4〜6週間隔）",
        "sessionsZh": "3-5次（间隔4-6周）",
        "effectEn": "Acne scar improvement, pore minimization, skin texture improvement, skin regeneration",
        "effectJa": "ニキビ跡改善、毛穴縮小、肌質改善、皮膚再生",
        "effectZh": "改善痘疤，缩小毛孔，改善肤质，皮肤再生",
    },
    # L912 - Sciton Halo
    "Sciton Halo는 세계 최초의 하이브리드 프랙셔널 레이저로, 비절제성 1470nm과 절제성 2940nm 두 가지 파장을 동시에 조사하여": {
        "detailEn": "Sciton Halo is the world's first hybrid fractional laser that simultaneously irradiates two wavelengths: non-ablative 1470nm and ablative 2940nm, stimulating both the epidermis and dermis. It can comprehensively improve pores, skin texture, acne scars, and skin aging in a single treatment. The non-ablative component minimizes downtime while the ablative component maximizes treatment effects.",
        "detailJa": "Sciton Haloは世界初のハイブリッドフラクショナルレーザーで、非アブレーティブ1470nmとアブレーティブ2940nmの2つの波長を同時に照射して表皮と真皮を共に刺激します。毛穴・肌質・ニキビ跡・皮膚老化を1回の施術で包括的に改善できます。非アブレーティブ成分でダウンタイムを最小化しながらアブレーティブ成分で治療効果を最大化します。",
        "detailZh": "Sciton Halo是世界上第一款混合点阵激光，同时照射非消融1470nm和消融2940nm两种波长，同时刺激表皮和真皮。可以在一次治疗中综合改善毛孔、肤质、痘疤和皮肤老化。非消融成分最大限度减少停工期，而消融成分最大化治疗效果。",
        "sessionsEn": "1-3 sessions (3-6 month intervals)",
        "sessionsJa": "1〜3回（3〜6ヶ月間隔）",
        "sessionsZh": "1-3次（间隔3-6个月）",
        "effectEn": "Pore minimization, skin texture improvement, acne scar improvement, anti-aging, skin tone improvement",
        "effectJa": "毛穴縮小、肌質改善、ニキビ跡改善、アンチエイジング、肌トーン改善",
        "effectZh": "缩小毛孔，改善肤质，改善痘疤，抗衰老，改善肤色",
    },
    # L930 - 스킨부스터
    "스킨부스터는 히알루론산(HA) 등 수분 성분을 피부 진피층에 직접 미세 주입하는 시술입니다": {
        "detailEn": "Skin booster is a treatment that directly micro-injects moisture components such as hyaluronic acid (HA) into the skin's dermis layer. Using the Dermashin Pro device, it injects at uniform depth and intervals to increase the skin's overall moisture retention capacity and improve elasticity and radiance. The effect lasts 6-12 months and regular maintenance can continuously maintain skin health.",
        "detailJa": "スキンブースターはヒアルロン酸（HA）などの水分成分を皮膚の真皮層に直接微細注入する施術です。ダーマシャインプロ機器を使用して均一な深さと間隔で注入し、皮膚全体の水分保持力を高め、弾力・輝きを改善します。効果は6〜12ヶ月持続し、定期的なメンテナンスで継続的に皮膚の健康を維持できます。",
        "detailZh": "水光针是将透明质酸（HA）等水分成分直接微量注射到皮肤真皮层的治疗。使用Dermashin Pro设备，以均匀的深度和间距注射，提高皮肤整体的保湿能力，改善弹力和光泽。效果持续6-12个月，定期维护可持续保持皮肤健康。",
        "sessionsEn": "3-4 sessions (4-6 week intervals)",
        "sessionsJa": "3〜4回（4〜6週間隔）",
        "sessionsZh": "3-4次（间隔4-6周）",
        "effectEn": "Skin moisture improvement, elasticity enhancement, radiance improvement, fine line reduction",
        "effectJa": "皮膚水分改善、弾力向上、輝き改善、小じわ軽減",
        "effectZh": "改善皮肤水分，增强弹力，改善光泽，减少细纹",
    },
    # L944 - 줄기세포
    "자가 혈액 또는 지방에서 추출한 줄기세포를 피부에 주입하여 노화된 세포를 재생하고 콜라겐 생성을 촉진합니다": {
        "detailEn": "Stem cells extracted from autologous blood or fat are injected into the skin to regenerate aged cells and stimulate collagen production. Skin elasticity recovery, wrinkle improvement, and skin tone evenness effects can be expected, and since autologous cells are used, there is no risk of rejection. The treatment effect lasts 12-24 months.",
        "detailJa": "自家血液または脂肪から抽出した幹細胞を皮膚に注入して老化した細胞を再生しコラーゲン生成を促進します。皮膚弾力回復、しわ改善、皮膚トーン均一化効果を期待でき、自家細胞を使用するため拒絶反応のリスクがありません。施術効果は12〜24ヶ月持続します。",
        "detailZh": "将从自体血液或脂肪中提取的干细胞注射到皮肤中，再生老化细胞并促进胶原蛋白生成。可以期待皮肤弹力恢复、皱纹改善和肤色均匀效果，由于使用自体细胞，没有排斥反应风险。治疗效果持续12-24个月。",
        "sessionsEn": "1-2 sessions (12-24 month intervals)",
        "sessionsJa": "1〜2回（12〜24ヶ月間隔）",
        "sessionsZh": "1-2次（间隔12-24个月）",
        "effectEn": "Skin elasticity recovery, wrinkle improvement, skin tone improvement, cell regeneration",
        "effectJa": "皮膚弾力回復、しわ改善、肌トーン改善、細胞再生",
        "effectZh": "恢复皮肤弹力，改善皱纹，改善肤色，细胞再生",
    },
    # L957 - 콜라겐 자극 주사
    "콜라겐 자극 주사는 피부 진피층에 직접 주입하여 콜라겐 합성을 촉진하는 시술입니다": {
        "detailEn": "Collagen stimulating injection is a treatment that is directly injected into the skin's dermis layer to stimulate collagen synthesis. It replenishes collagen that has decreased due to aging and naturally restores skin elasticity and volume. The lasting effect is 6-12 months, and regular maintenance can continuously maintain skin health.",
        "detailJa": "コラーゲン刺激注射は皮膚の真皮層に直接注入してコラーゲン合成を促進する施術です。老化により減少したコラーゲンを補充し皮膚弾力とボリュームを自然に回復させます。持続効果は6〜12ヶ月で、定期的なメンテナンスで継続的に皮膚の健康を維持できます。",
        "detailZh": "胶原蛋白刺激注射是直接注射到皮肤真皮层以促进胶原蛋白合成的治疗。补充因老化而减少的胶原蛋白，自然恢复皮肤弹力和体积。持续效果为6-12个月，定期维护可持续保持皮肤健康。",
        "sessionsEn": "2-3 sessions (6-12 month intervals)",
        "sessionsJa": "2〜3回（6〜12ヶ月間隔）",
        "sessionsZh": "2-3次（间隔6-12个月）",
        "effectEn": "Skin elasticity improvement, volume restoration, wrinkle reduction, collagen production stimulation",
        "effectJa": "皮膚弾力改善、ボリューム回復、しわ軽減、コラーゲン生成促進",
        "effectZh": "改善皮肤弹力，恢复体积，减少皱纹，刺激胶原蛋白生成",
    },
    # L970 - 엑소좀
    "엑소좀(ASCE+)은 줄기세포 배양액에서 추출한 세포 외 소포체로, 성장 인자, 사이토카인, 마이크로RNA 등 피부 재생에 필요한": {
        "detailEn": "Exosomes (ASCE+) are extracellular vesicles extracted from stem cell culture medium, richly containing bioactive substances necessary for skin regeneration such as growth factors, cytokines, and microRNA. They promote regeneration of damaged skin cells, stimulate collagen production, and improve skin elasticity and moisture. The effect lasts 6-12 months, and regular maintenance can continuously maintain skin health.",
        "detailJa": "エクソソーム（ASCE+）は幹細胞培養液から抽出した細胞外小胞で、成長因子、サイトカイン、マイクロRNAなど皮膚再生に必要な生理活性物質を豊富に含んでいます。損傷した皮膚細胞の再生を促進し、コラーゲン生成を刺激して皮膚弾力と水分を改善します。効果は6〜12ヶ月持続し、定期的なメンテナンスで継続的に皮膚の健康を維持できます。",
        "detailZh": "外泌体（ASCE+）是从干细胞培养液中提取的细胞外囊泡，富含生长因子、细胞因子、微RNA等皮肤再生所需的生物活性物质。促进受损皮肤细胞的再生，刺激胶原蛋白生成，改善皮肤弹力和水分。效果持续6-12个月，定期维护可持续保持皮肤健康。",
        "sessionsEn": "3-4 sessions (4-6 week intervals)",
        "sessionsJa": "3〜4回（4〜6週間隔）",
        "sessionsZh": "3-4次（间隔4-6周）",
        "effectEn": "Skin regeneration, elasticity improvement, moisture improvement, collagen production stimulation, anti-aging",
        "effectJa": "皮膚再生、弾力改善、水分改善、コラーゲン生成促進、アンチエイジング",
        "effectZh": "皮肤再生，改善弹力，改善水分，刺激胶原蛋白生成，抗衰老",
    },
    # L984 - 스컬트라
    "스컬트라(Sculptra)는 PLLA(폴리-L-락틱산) 성분의 생체 자극형 콜라겐 자극제입니다": {
        "detailEn": "Sculptra is a biostimulatory collagen stimulator made of PLLA (poly-L-lactic acid). Unlike regular hyaluronic acid fillers that provide immediate volume effects, it gradually stimulates the skin to produce its own collagen over several months after injection. The effect lasts 2 years or more, and natural-looking volume recovery and elasticity improvement can be expected.",
        "detailJa": "スカルプトラ（Sculptra）はPLLA（ポリ-L-乳酸）成分の生体刺激型コラーゲン刺激剤です。一般的なヒアルロン酸フィラーのように即座のボリューム効果を出すのではなく、注入後数ヶ月にわたって皮膚が自らコラーゲンを生成するよう刺激します。効果は2年以上持続し、自然なボリューム回復と弾力改善を期待できます。",
        "detailZh": "舒颜萃（Sculptra）是由PLLA（聚-L-乳酸）成分制成的生物刺激型胶原蛋白刺激剂。与普通透明质酸填充剂立即产生体积效果不同，注射后数月内逐渐刺激皮肤自行产生胶原蛋白。效果持续2年以上，可以期待自然的体积恢复和弹力改善。",
        "sessionsEn": "2-3 sessions (4-6 week intervals)",
        "sessionsJa": "2〜3回（4〜6週間隔）",
        "sessionsZh": "2-3次（间隔4-6周）",
        "effectEn": "Collagen production stimulation, volume restoration, elasticity improvement, long-lasting anti-aging effect",
        "effectJa": "コラーゲン生成促進、ボリューム回復、弾力改善、長期持続アンチエイジング効果",
        "effectZh": "刺激胶原蛋白生成，恢复体积，改善弹力，长效抗衰老效果",
    },
    # L999 - 쥬베룩 볼륨
    "쥬베룩 볼륨(Juvelook Volume)은 PDLLA와 히알루론산을 복합한 차세대 콜라겐 바이오스티뮬레이터": {
        "detailEn": "Juvelook Volume is a next-generation collagen biostimulator combining PDLLA and hyaluronic acid. PDLLA stimulates collagen production while hyaluronic acid provides immediate moisture replenishment and elasticity improvement. The dual action of immediate effect and long-term collagen stimulation provides more comprehensive skin improvement than single treatments.",
        "detailJa": "쥬베룩 볼륨（Juvelook Volume）はPDLLAとヒアルロン酸を複合した次世代コラーゲンバイオスティミュレーターです。PDLLAがコラーゲン生成を刺激し、ヒアルロン酸が即座の水分補充と弾力改善を提供します。即時効果と長期コラーゲン刺激のデュアル作用で単独治療より包括的な皮膚改善を提供します。",
        "detailZh": "Juvelook Volume是结合PDLLA和透明质酸的下一代胶原蛋白生物刺激剂。PDLLA刺激胶原蛋白生成，而透明质酸提供即时的水分补充和弹力改善。即时效果和长期胶原蛋白刺激的双重作用比单独治疗提供更全面的皮肤改善。",
        "sessionsEn": "2-3 sessions (4-6 week intervals)",
        "sessionsJa": "2〜3回（4〜6週間隔）",
        "sessionsZh": "2-3次（间隔4-6周）",
        "effectEn": "Immediate moisture improvement, collagen production stimulation, elasticity improvement, volume restoration",
        "effectJa": "即座の水分改善、コラーゲン生成促進、弾力改善、ボリューム回復",
        "effectZh": "即时改善水分，刺激胶原蛋白生成，改善弹力，恢复体积",
    },
    # L1014 - 리투오
    "리투오(RE20)는 피부 재생 성분이 함유된 고급 스킨부스터로, 손상된 피부를 빠르게 회복시키고 수분을 공급하는 데 특화되어 있습니다": {
        "detailEn": "RE20 is a premium skin booster containing skin regeneration components, specialized in quickly recovering damaged skin and supplying moisture. It promotes cell regeneration and strengthens the skin barrier to help restore healthy skin. The effect lasts 6-12 months, and regular maintenance can continuously maintain skin health.",
        "detailJa": "リトゥオ（RE20）は皮膚再生成分が含まれた高級スキンブースターで、損傷した皮膚を素早く回復させ水分を供給することに特化しています。細胞再生を促進し皮膚バリアを強化して健康な皮膚への回復を助けます。効果は6〜12ヶ月持続し、定期的なメンテナンスで継続的に皮膚の健康を維持できます。",
        "detailZh": "RE20是含有皮肤再生成分的高级水光针，专门用于快速恢复受损皮肤和补充水分。促进细胞再生并强化皮肤屏障，帮助恢复健康皮肤。效果持续6-12个月，定期维护可持续保持皮肤健康。",
        "sessionsEn": "3-4 sessions (4-6 week intervals)",
        "sessionsJa": "3〜4回（4〜6週間隔）",
        "sessionsZh": "3-4次（间隔4-6周）",
        "effectEn": "Skin regeneration, moisture improvement, skin barrier strengthening, elasticity improvement",
        "effectJa": "皮膚再生、水分改善、皮膚バリア強化、弾力改善",
        "effectZh": "皮肤再生，改善水分，强化皮肤屏障，改善弹力",
    },
    # L1031 - 보톡스
    "보톡스는 보툴리눔 톡신을 소량씩 주입하여 과도하게 수축하는 표정 근육의 움직임을 완화하는 시술입니다": {
        "detailEn": "Botox is a treatment that injects small amounts of botulinum toxin to relax the movement of overactive facial muscles. It is suitable for improving dynamic wrinkles caused by repetitive muscle use, such as forehead lines, frown lines, and crow's feet, and is also used for jaw reduction, trapezius reduction, and calf reduction. The effect lasts 4-6 months.",
        "detailJa": "ボトックスはボツリヌス毒素を少量ずつ注入して過度に収縮する表情筋の動きを緩和する施術です。額・眉間・目尻のしわのような繰り返しの筋肉使用で生じる動的しわ改善に適しており、エラ・僧帽筋・ふくらはぎ縮小にも活用されます。効果は4〜6ヶ月持続します。",
        "detailZh": "肉毒素是注射少量肉毒杆菌毒素以放松过度收缩的表情肌运动的治疗。适合改善因重复肌肉使用产生的动态皱纹，如额头纹、眉间纹和鱼尾纹，也用于下颌缩小、斜方肌缩小和小腿缩小。效果持续4-6个月。",
        "sessionsEn": "Repeat every 4-6 months",
        "sessionsJa": "4〜6ヶ月ごとに繰り返し",
        "sessionsZh": "每4-6个月重复一次",
        "effectEn": "Dynamic wrinkle improvement, jaw reduction, trapezius reduction, calf reduction, facial slimming",
        "effectJa": "動的しわ改善、エラ縮小、僧帽筋縮小、ふくらはぎ縮小、小顔効果",
        "effectZh": "改善动态皱纹，下颌缩小，斜方肌缩小，小腿缩小，瘦脸效果",
    },
    # L1045 - 필러
    "필러는 주로 히알루론산 성분을 활용해 볼륨이 꺼지거나 라인이 아쉬운 부위에 입체감을 더하는 시술입니다": {
        "detailEn": "Filler is a treatment that mainly uses hyaluronic acid to add three-dimensionality to areas where volume has decreased or the line is unsatisfactory. It can be applied to various areas including nasolabial folds, cheeks, chin, lips, and nose bridge, and can improve facial proportions and skin texture simultaneously. The effect lasts 6-18 months depending on the product.",
        "detailJa": "フィラーは主にヒアルロン酸成分を活用してボリュームが失われたりラインが気になる部位に立体感を加える施術です。法令線、頬、顎先、唇、鼻筋など様々な部位に適用でき、顔の比率と皮膚質感を同時に改善できます。効果は製品によって6〜18ヶ月持続します。",
        "detailZh": "填充剂主要使用透明质酸成分，为体积减少或轮廓不满意的区域增添立体感。可应用于法令纹、脸颊、下巴、嘴唇、鼻梁等各种区域，可以同时改善面部比例和肤质。效果根据产品持续6-18个月。",
        "sessionsEn": "Repeat every 6-18 months",
        "sessionsJa": "6〜18ヶ月ごとに繰り返し",
        "sessionsZh": "每6-18个月重复一次",
        "effectEn": "Volume restoration, facial contouring, nasolabial fold improvement, lip augmentation, nose bridge enhancement",
        "effectJa": "ボリューム回復、顔のライン改善、法令線改善、唇ボリュームアップ、鼻筋強調",
        "effectZh": "恢复体积，改善面部轮廓，改善法令纹，丰唇，鼻梁增高",
    },
    # L1058 - 지방 분해
    "지방 분해 성분을 이중턱, 볼 지방 등 원하는 부위에 직접 주입하여 지방 세포를 분해·제거하는 비수술적 시술": {
        "detailEn": "Fat dissolving injection is a non-surgical treatment that directly injects fat-dissolving components into desired areas such as double chin and cheek fat to break down and remove fat cells. Facial contour improvement is possible without surgery, and fat gradually decreases after treatment for natural-looking results. The effect lasts 1-2 years.",
        "detailJa": "脂肪溶解成分を二重顎、頬の脂肪など希望する部位に直接注入して脂肪細胞を分解・除去する非手術的施術です。手術なしに顔のラインを改善でき、施術後点進的に脂肪が減少して自然な結果を得られます。効果は1〜2年持続します。",
        "detailZh": "脂肪溶解注射是将脂肪溶解成分直接注射到双下巴、脸颊脂肪等所需区域以分解和去除脂肪细胞的非手术治疗。无需手术即可改善面部轮廓，治疗后脂肪逐渐减少，获得自然效果。效果持续1-2年。",
        "sessionsEn": "2-4 sessions (4-6 week intervals)",
        "sessionsJa": "2〜4回（4〜6週間隔）",
        "sessionsZh": "2-4次（间隔4-6周）",
        "effectEn": "Fat reduction, facial contouring, double chin improvement, cheek slimming",
        "effectJa": "脂肪減少、顔のライン改善、二重顎改善、頬スリム化",
        "effectZh": "减少脂肪，改善面部轮廓，改善双下巴，瘦脸颊",
    },
    # L1070 - 리쥬란 힐러
    "리쥬란 힐러는 연어 DNA에서 추출한 PDRN(폴리데옥시리보뉴클레오타이드) 성분을 피부 진피층에 주입하는 시술입니다": {
        "detailEn": "Rejuran Healer is a treatment that injects PDRN (polydeoxyribonucleotide) extracted from salmon DNA into the skin's dermis layer. PDRN promotes DNA repair of damaged skin cells and stimulates collagen synthesis to improve skin elasticity, moisture, and texture. The effect lasts 6-12 months, and regular maintenance can continuously maintain skin health.",
        "detailJa": "リジュランヒーラーはサーモンDNAから抽出したPDRN（ポリデオキシリボヌクレオチド）成分を皮膚の真皮層に注入する施術です。PDRNが損傷した皮膚細胞のDNA修復を促進しコラーゲン合成を刺激して皮膚弾力、水分、肌質を改善します。効果は6〜12ヶ月持続し、定期的なメンテナンスで継続的に皮膚の健康を維持できます。",
        "detailZh": "婴儿针是将从三文鱼DNA中提取的PDRN（多聚脱氧核糖核苷酸）成分注射到皮肤真皮层的治疗。PDRN促进受损皮肤细胞的DNA修复并刺激胶原蛋白合成，改善皮肤弹力、水分和肤质。效果持续6-12个月，定期维护可持续保持皮肤健康。",
        "sessionsEn": "3-4 sessions (2-4 week intervals)",
        "sessionsJa": "3〜4回（2〜4週間隔）",
        "sessionsZh": "3-4次（间隔2-4周）",
        "effectEn": "Skin regeneration, elasticity improvement, moisture improvement, skin texture improvement, anti-aging",
        "effectJa": "皮膚再生、弾力改善、水分改善、肌質改善、アンチエイジング",
        "effectZh": "皮肤再生，改善弹力，改善水分，改善肤质，抗衰老",
    },
    # L1083 - 리쥬란 힐러 플러스
    "리쥬란 힐러 플러스는 연어 DNA 성분(PDRN)과 히알루론산(HA)을 결합한 복합 제형입니다": {
        "detailEn": "Rejuran Healer Plus is a complex formulation combining salmon DNA component (PDRN) and hyaluronic acid (HA). PDRN regenerates damaged skin cells and restores elasticity, while HA provides immediate moisture supply. The dual action provides more comprehensive skin improvement than single treatments, and the effect lasts 6-12 months.",
        "detailJa": "リジュランヒーラープラスはサーモンDNA成分（PDRN）とヒアルロン酸（HA）を組み合わせた複合製剤です。PDRNが損傷した皮膚細胞を再生し弾力を回復させる一方、HAが即座の水分を供給します。デュアル作用で単独治療より包括的な皮膚改善を提供し、効果は6〜12ヶ月持続します。",
        "detailZh": "婴儿针Plus是结合三文鱼DNA成分（PDRN）和透明质酸（HA）的复合制剂。PDRN再生受损皮肤细胞并恢复弹力，而HA提供即时水分供应。双重作用比单独治疗提供更全面的皮肤改善，效果持续6-12个月。",
        "sessionsEn": "3-4 sessions (2-4 week intervals)",
        "sessionsJa": "3〜4回（2〜4週間隔）",
        "sessionsZh": "3-4次（间隔2-4周）",
        "effectEn": "Skin regeneration, elasticity improvement, immediate moisture supply, skin texture improvement",
        "effectJa": "皮膚再生、弾力改善、即座の水分供給、肌質改善",
        "effectZh": "皮肤再生，改善弹力，即时补充水分，改善肤质",
    },
    # L1191 - 플래티넘PTT
    "플래티넘PTT는 플래티넘 나노입자를 여드름 바이오필름에 침투시킨 후 특정 파장의 빛으로 플래티넘 나노입자를 활성화하여": {
        "detailEn": "Platinum PTT penetrates platinum nanoparticles into acne biofilm, then activates the platinum nanoparticles with light of a specific wavelength to selectively destroy acne bacteria. It can treat acne without antibiotic side effects, and the treatment effect is maintained for a long time. It is effective for inflammatory acne, comedonal acne, and cystic acne.",
        "detailJa": "プラチナPTTはプラチナナノ粒子をニキビバイオフィルムに浸透させた後、特定波長の光でプラチナナノ粒子を活性化してニキビ菌を選択的に破壊します。抗生物質の副作用なしにニキビを治療でき、施術効果が長期間維持されます。炎症性ニキビ、面皰性ニキビ、嚢胞性ニキビに効果的です。",
        "detailZh": "铂金PTT将铂金纳米颗粒渗透到痘痘生物膜中，然后用特定波长的光激活铂金纳米颗粒，选择性地破坏痘痘细菌。可以在没有抗生素副作用的情况下治疗痘痘，治疗效果长期维持。对炎症性痘痘、粉刺性痘痘和囊肿性痘痘有效。",
        "sessionsEn": "4-6 sessions (2-4 week intervals)",
        "sessionsJa": "4〜6回（2〜4週間隔）",
        "sessionsZh": "4-6次（间隔2-4周）",
        "effectEn": "Acne bacteria destruction, inflammatory acne treatment, comedonal acne treatment, acne recurrence prevention",
        "effectJa": "ニキビ菌破壊、炎症性ニキビ治療、面皰性ニキビ治療、ニキビ再発防止",
        "effectZh": "破坏痘痘细菌，治疗炎症性痘痘，治疗粉刺性痘痘，预防痘痘复发",
    },
    # L1204 - 플라즈마 (acne_laser)
    "FDA에서 승인한 차세대 피부 재생 플라즈마 장비로, 가스 탱크로부터 99.999% 순도의 질소가 UHF의 높은 에너지를 전달받아 질소 플라즈마를 생성하며": {
        "detailEn": "This FDA-approved next-generation skin regeneration plasma device generates nitrogen plasma as 99.999% pure nitrogen from a gas tank receives high UHF energy, without leaving wounds on the skin surface through thermal effects. It is effective for acne treatment, skin regeneration, and pore improvement, and immediate return to daily activities is possible after treatment.",
        "detailJa": "FDAが承認した次世代皮膚再生プラズマ機器で、ガスタンクから99.999%純度の窒素がUHFの高エネルギーを受け取って窒素プラズマを生成し、皮膚表面に傷を残さず熱効果で治療します。ニキビ治療、皮膚再生、毛穴改善に効果的で、施術後すぐに日常復帰が可能です。",
        "detailZh": "这款FDA批准的下一代皮肤再生等离子体设备，通过气罐中99.999%纯度的氮气接收UHF的高能量产生氮等离子体，通过热效应在皮肤表面不留伤口进行治疗。对痘痘治疗、皮肤再生和毛孔改善有效，治疗后可立即恢复日常生活。",
        "sessionsEn": "4-6 sessions (2-4 week intervals)",
        "sessionsJa": "4〜6回（2〜4週間隔）",
        "sessionsZh": "4-6次（间隔2-4周）",
        "effectEn": "Acne treatment, skin regeneration, pore improvement, skin texture improvement",
        "effectJa": "ニキビ治療、皮膚再生、毛穴改善、肌質改善",
        "effectZh": "治疗痘痘，皮肤再生，改善毛孔，改善肤质",
    },
    # L1219 - 고바야시 절연침
    "고바야시 절연침은 고주파 전류가 흐르는 미세한 침을 모공 속에 꽂아 그 속에 있는 피지선을 태워주는 치료법입니다": {
        "detailEn": "Kobayashi insulated needle is a treatment method that inserts a fine needle carrying high-frequency current into pores to burn the sebaceous glands inside. Since current flows only to the sebaceous glands inside the pores without flowing through the skin surface, it can selectively destroy sebaceous glands while minimizing skin surface damage. It is effective for acne treatment and pore improvement.",
        "detailJa": "小林絶縁針は高周波電流が流れる微細な針を毛穴の中に刺してその中にある皮脂腺を焼く治療法です。皮膚表面には電流が流れず毛穴の中の皮脂腺にのみ電流を流すため皮膚表面損傷を最小化しながら皮脂腺を選択的に破壊できます。ニキビ治療と毛穴改善に効果的です。",
        "detailZh": "小林绝缘针是将携带高频电流的细针插入毛孔，烧灼其中皮脂腺的治疗方法。由于电流不流过皮肤表面，只流向毛孔内的皮脂腺，因此可以在最大限度减少皮肤表面损伤的同时选择性地破坏皮脂腺。对痘痘治疗和毛孔改善有效。",
        "sessionsEn": "3-5 sessions (2-4 week intervals)",
        "sessionsJa": "3〜5回（2〜4週間隔）",
        "sessionsZh": "3-5次（间隔2-4周）",
        "effectEn": "Sebaceous gland destruction, acne treatment, pore improvement, sebum regulation",
        "effectJa": "皮脂腺破壊、ニキビ治療、毛穴改善、皮脂調整",
        "effectZh": "破坏皮脂腺，治疗痘痘，改善毛孔，调节皮脂",
    },
    # L1237 - miraDry Fresh (acne)
    "miraDry Fresh는 마이크로파(microwave) 에너지를 이용해 겨드랑이 피부 아래 2~5mm 깊이에 위치한 에크린·아포크린 땀샘을 비절개 방식으로 영구 파괴합니다": {
        "detailEn": "miraDry Fresh uses microwave energy to permanently destroy eccrine and apocrine sweat glands located 2-5mm below the armpit skin in a non-incision manner. The FDA 510(k) approved device minimizes damage to surrounding tissue with a cooling system while effectively destroying sweat glands. The treatment effect is permanent and does not require repeated treatments.",
        "detailJa": "miraDry Freshはマイクロ波（microwave）エネルギーを利用してわきの下の皮膚の下2〜5mmの深さに位置するエクリン・アポクリン汗腺を非切開方式で永久破壊します。FDA 510(k)承認機器で冷却システムにより周囲組織への損傷を最小化しながら汗腺を効果的に破壊します。施術効果は永続的で繰り返しの施術が不要です。",
        "detailZh": "miraDry Fresh使用微波能量，以非切口方式永久破坏位于腋下皮肤下方2-5mm深处的外分泌和顶泌汗腺。FDA 510(k)批准的设备通过冷却系统最大限度减少对周围组织的损伤，同时有效破坏汗腺。治疗效果是永久性的，不需要重复治疗。",
        "sessionsEn": "1-2 sessions",
        "sessionsJa": "1〜2回",
        "sessionsZh": "1-2次",
        "effectEn": "Permanent sweat gland destruction, hyperhidrosis treatment, bromhidrosis improvement, no recurrence",
        "effectJa": "永久的な汗腺破壊、多汗症治療、わきが改善、再発なし",
        "effectZh": "永久破坏汗腺，治疗多汗症，改善腋臭，无复发",
    },
    # L1258 - 리포셋흡입술
    "리포셋흡입술은 부분 마취 후 3㎜ 정도로 겨드랑이 두 군데를 절개한 후 금속관(캐뉼라)을 삽입해 땀샘을 긁어내는 다한증 치료법입니다": {
        "detailEn": "Liposet suction is a hyperhidrosis treatment method that makes two small incisions of about 3mm in the armpit under local anesthesia, then inserts a metal tube (cannula) to scrape out sweat glands. The metal tube used has suction holes on the side touching the dermis, which effectively removes sweat glands. The treatment effect is permanent.",
        "detailJa": "リポセット吸引術は局所麻酔後に3㎜程度でわきの下2か所を切開した後、金属管（カニューレ）を挿入して汗腺を掻き出す多汗症治療法です。使用される金属管が真皮側と接触する部位に吸引穴があり汗腺を効果的に除去します。施術効果は永続的です。",
        "detailZh": "脂肪抽吸术是在局部麻醉后在腋下两处切开约3mm的小口，然后插入金属管（套管）刮除汗腺的多汗症治疗方法。所使用的金属管在接触真皮侧的部位有吸引孔，可有效去除汗腺。治疗效果是永久性的。",
        "sessionsEn": "1 session",
        "sessionsJa": "1回",
        "sessionsZh": "1次",
        "effectEn": "Permanent sweat gland removal, hyperhidrosis treatment, bromhidrosis improvement",
        "effectJa": "永久的な汗腺除去、多汗症治療、わきが改善",
        "effectZh": "永久去除汗腺，治疗多汗症，改善腋臭",
    },
    # L1279 - 보툴리눔 다한증
    "보툴리눔 독소(보톡스)를 다한증 부위에 미세 주사하여 아세틸콜린 분비를 억제, 땀샘 자극 신호를 차단합니다": {
        "detailEn": "Botulinum toxin (Botox) is micro-injected into hyperhidrosis areas to inhibit acetylcholine secretion and block sweat gland stimulation signals. It can be applied to various areas including armpits, palms, soles, and forehead, with short treatment time and no recovery period. The effect lasts 6-12 months and requires periodic maintenance.",
        "detailJa": "ボツリヌス毒素（ボトックス）を多汗症部位に微細注射してアセチルコリン分泌を抑制し汗腺刺激信号を遮断します。わきの下・手のひら・足の裏・額など様々な部位に適用可能で施術時間が短く回復期間がありません。効果は6〜12ヶ月持続し定期的なメンテナンスが必要です。",
        "detailZh": "将肉毒杆菌毒素（肉毒素）微量注射到多汗症区域，抑制乙酰胆碱分泌，阻断汗腺刺激信号。可应用于腋下、手掌、脚底、额头等各种区域，治疗时间短，无恢复期。效果持续6-12个月，需要定期维护。",
        "sessionsEn": "Repeat every 6-12 months",
        "sessionsJa": "6〜12ヶ月ごとに繰り返し",
        "sessionsZh": "每6-12个月重复一次",
        "effectEn": "Sweat gland signal blocking, hyperhidrosis treatment, bromhidrosis improvement, applicable to multiple areas",
        "effectJa": "汗腺信号遮断、多汗症治療、わきが改善、複数部位適用可能",
        "effectZh": "阻断汗腺信号，治疗多汗症，改善腋臭，可应用于多个区域",
    },
    # L1431 - 엑시머 V7
    "엑시머 V7은 308nm 파장의 엑시머 레이저를 이용해 백반증 병변 부위의 멜라노사이트(색소 세포)를 선택적으로 자극하여 색소 재생을 유도하는 치료입니다": {
        "detailEn": "Excimer V7 uses a 308nm wavelength excimer laser to selectively stimulate melanocytes (pigment cells) in vitiligo lesion areas to induce pigment regeneration. Unlike whole-body UV treatment, it concentrates on only the lesion area to minimize damage to surrounding normal skin. It is effective for vitiligo treatment and can also be used for psoriasis and atopic dermatitis.",
        "detailJa": "エキシマV7は308nm波長のエキシマレーザーを利用して白斑病変部位のメラノサイト（色素細胞）を選択的に刺激して色素再生を誘導する治療です。全身紫外線治療と異なり病変部位にのみ集中して周囲の正常皮膚への損傷を最小化します。白斑治療に効果的で乾癬やアトピー性皮膚炎にも使用できます。",
        "detailZh": "准分子V7使用308nm波长的准分子激光选择性刺激白癜风病变区域的黑色素细胞（色素细胞），诱导色素再生。与全身紫外线治疗不同，它只集中于病变区域，最大限度减少对周围正常皮肤的损伤。对白癜风治疗有效，也可用于银屑病和特应性皮炎。",
        "sessionsEn": "20-30 sessions (2-3 times per week)",
        "sessionsJa": "20〜30回（週2〜3回）",
        "sessionsZh": "20-30次（每周2-3次）",
        "effectEn": "Vitiligo pigment regeneration, melanocyte stimulation, psoriasis treatment, atopic dermatitis improvement",
        "effectJa": "白斑色素再生、メラノサイト刺激、乾癬治療、アトピー性皮膚炎改善",
        "effectZh": "白癜风色素再生，刺激黑色素细胞，治疗银屑病，改善特应性皮炎",
    },
    # L1486 - 전신자외선
    "전신자외선 치료기는 311nm 협대역 자외선B(NB-UVB)를 전신에 균일하게 조사하는 광선 치료 장비입니다": {
        "detailEn": "The whole-body UV treatment device is a phototherapy device that uniformly irradiates 311nm narrow-band UVB (NB-UVB) to the entire body. It is used for various skin diseases including vitiligo, psoriasis, atopic dermatitis, and polymorphous light eruption that are widely distributed throughout the body. NB-UVB has high efficacy and relatively low side effects compared to conventional broadband UVB.",
        "detailJa": "全身紫外線治療器は311nm狭帯域紫外線B（NB-UVB）を全身に均一に照射する光線治療機器です。全身に広く分布した白斑、乾癬、アトピー性皮膚炎、多形性光発疹など様々な皮膚疾患に使用されます。NB-UVBは従来の広帯域UVBより高い有効性と比較的低い副作用を持ちます。",
        "detailZh": "全身紫外线治疗仪是将311nm窄带紫外线B（NB-UVB）均匀照射到全身的光疗设备。用于广泛分布于全身的白癜风、银屑病、特应性皮炎、多形性光疹等各种皮肤病。与传统宽带UVB相比，NB-UVB具有更高的有效性和相对较低的副作用。",
        "sessionsEn": "20-30 sessions (2-3 times per week)",
        "sessionsJa": "20〜30回（週2〜3回）",
        "sessionsZh": "20-30次（每周2-3次）",
        "effectEn": "Vitiligo treatment, psoriasis treatment, atopic dermatitis improvement, whole-body phototherapy",
        "effectJa": "白斑治療、乾癬治療、アトピー性皮膚炎改善、全身光線治療",
        "effectZh": "治疗白癜风，治疗银屑病，改善特应性皮炎，全身光疗",
    },
    # L1663 - miraDry Fresh (acne - 두번째)
    "Solta Medical의 miraDry Fresh는 2.45GHz 마이크로파 에너지를 이용해 에크린·아포크린 땀샘을 비절개로 영구 파괴합니다": {
        "detailEn": "Solta Medical's miraDry Fresh uses 2.45GHz microwave energy to permanently destroy eccrine and apocrine sweat glands without incision. The cooling system protects the epidermis while FDA 510(k) approval ensures safety and efficacy. The treatment effect is permanent and does not require repeated treatments.",
        "detailJa": "Solta MedicalのmiraDry Freshは2.45GHzマイクロ波エネルギーを利用してエクリン・アポクリン汗腺を非切開で永久破壊します。冷却システムが表皮を保護しFDA 510(k)承認で安全性と有効性が確認されています。施術効果は永続的で繰り返しの施術が不要です。",
        "detailZh": "Solta Medical的miraDry Fresh使用2.45GHz微波能量，以非切口方式永久破坏外分泌和顶泌汗腺。冷却系统保护表皮，FDA 510(k)批准确保安全性和有效性。治疗效果是永久性的，不需要重复治疗。",
        "sessionsEn": "1-2 sessions",
        "sessionsJa": "1〜2回",
        "sessionsZh": "1-2次",
        "effectEn": "Permanent sweat gland destruction, hyperhidrosis treatment, bromhidrosis improvement",
        "effectJa": "永久的な汗腺破壊、多汗症治療、わきが改善",
        "effectZh": "永久破坏汗腺，治疗多汗症，改善腋臭",
    },
    # L1669 - 라이포샛
    "라이포샛(Liposat)은 RF 에너지를 미세 캐뉼라를 통해 피부 아래 지방층에 전달하여 아포크린 땀샘과 지방 세포를 선택적으로 파괴합니다": {
        "detailEn": "Liposat delivers RF energy through a micro-cannula to the fat layer beneath the skin to selectively destroy apocrine sweat glands and fat cells. It simultaneously achieves armpit line improvement and bromhidrosis treatment. The treatment effect is permanent.",
        "detailJa": "ライポサット（Liposat）はRFエネルギーを微細カニューレを通して皮膚下の脂肪層に伝達してアポクリン汗腺と脂肪細胞を選択的に破壊します。わきのラインの改善とわきが治療を同時に実現します。施術効果は永続的です。",
        "detailZh": "Liposat通过微型套管将RF能量传递到皮肤下方的脂肪层，选择性地破坏顶泌汗腺和脂肪细胞。同时实现腋下轮廓改善和腋臭治疗。治疗效果是永久性的。",
        "sessionsEn": "1 session",
        "sessionsJa": "1回",
        "sessionsZh": "1次",
        "effectEn": "Apocrine sweat gland destruction, bromhidrosis treatment, armpit contouring",
        "effectJa": "アポクリン汗腺破壊、わきが治療、わきラインの改善",
        "effectZh": "破坏顶泌汗腺，治疗腋臭，改善腋下轮廓",
    },
    # L1675 - 보툴리눔 다한증 (두번째)
    "미세 주사 기법으로 보툴리눔 독소를 겨드랑이·손바닥·발바닥 등 다한증 부위에 정밀 투여합니다": {
        "detailEn": "Botulinum toxin is precisely administered to hyperhidrosis areas such as armpits, palms, and soles using micro-injection technique. It inhibits acetylcholine secretion to block sweat gland stimulation signals, with short treatment time and no recovery period. The effect lasts 6-12 months.",
        "detailJa": "微細注射技法でボツリヌス毒素をわきの下・手のひら・足の裏など多汗症部位に精密投与します。アセチルコリン分泌を抑制して汗腺刺激信号を遮断し、施術時間が短く回復期間がありません。効果は6〜12ヶ月持続します。",
        "detailZh": "使用微注射技术将肉毒杆菌毒素精准注射到腋下、手掌、脚底等多汗症区域。抑制乙酰胆碱分泌，阻断汗腺刺激信号，治疗时间短，无恢复期。效果持续6-12个月。",
        "sessionsEn": "Repeat every 6-12 months",
        "sessionsJa": "6〜12ヶ月ごとに繰り返し",
        "sessionsZh": "每6-12个月重复一次",
        "effectEn": "Sweat gland signal blocking, hyperhidrosis treatment, applicable to multiple areas",
        "effectJa": "汗腺信号遮断、多汗症治療、複数部位適用可能",
        "effectZh": "阻断汗腺信号，治疗多汗症，可应用于多个区域",
    },
    # L1681 - 큐어맥스 (acne)
    "큐어맥스(CureMax)는 초단위 CO2 레이저 기술을 적용한 여드름 흉터 제거 및 단초 제거 전문 장비입니다": {
        "detailEn": "CureMax is a specialized device for acne scar removal and stitch mark removal that applies ultra-short CO2 laser technology. Non-invasive CO2 laser precisely removes acne scars and stitch marks, with fast treatment time and effective results. Immediate return to daily activities is possible after treatment.",
        "detailJa": "キュアマックス（CureMax）は超短時間CO2レーザー技術を適用したニキビ跡除去および縫合跡除去専門機器です。非侵襲的CO2レーザーでニキビ跡と縫合跡を精密に除去し、治療時間が短く効果的な結果を提供します。施術後すぐに日常復帰が可能です。",
        "detailZh": "CureMax是应用超短CO2激光技术的痘疤去除和缝合痕迹去除专用设备。非侵入性CO2激光精准去除痘疤和缝合痕迹，治疗时间短，效果显著。治疗后可立即恢复日常生活。",
        "sessionsEn": "3-5 sessions (4-6 week intervals)",
        "sessionsJa": "3〜5回（4〜6週間隔）",
        "sessionsZh": "3-5次（间隔4-6周）",
        "effectEn": "Acne scar removal, stitch mark removal, skin texture improvement, skin regeneration",
        "effectJa": "ニキビ跡除去、縫合跡除去、肌質改善、皮膚再生",
        "effectZh": "去除痘疤，去除缝合痕迹，改善肤质，皮肤再生",
    },
}

def patch_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    patched = 0
    for ko_key, translations in TRANSLATIONS.items():
        # detail 필드 찾기 (한국어 키의 시작 부분으로 매칭)
        # 패턴: detail: "...ko_key..." 다음 줄에 detailEn이 없는 경우
        search_pattern = f'detail: "{ko_key}'
        idx = content.find(search_pattern)
        if idx == -1:
            print(f"  [MISS] '{ko_key[:40]}...'")
            continue
        
        # detail 필드의 끝 찾기 (줄 끝)
        line_end = content.find('\n', idx)
        if line_end == -1:
            continue
        
        # 이미 번역이 있는지 확인
        next_line_start = line_end + 1
        next_line_end = content.find('\n', next_line_start)
        next_line = content[next_line_start:next_line_end].strip()
        if next_line.startswith('detailEn') or next_line.startswith('detailJa'):
            print(f"  [SKIP] Already has translation: '{ko_key[:40]}...'")
            continue
        
        # 번역 삽입할 텍스트 구성
        # 들여쓰기 파악
        line_start = content.rfind('\n', 0, idx) + 1
        indent = ''
        for ch in content[line_start:]:
            if ch in (' ', '\t'):
                indent += ch
            else:
                break
        
        insert_parts = []
        for field, value in translations.items():
            # 값에서 특수문자 이스케이프
            escaped = value.replace('\\', '\\\\').replace('"', '\\"')
            insert_parts.append(f'{indent}{field}: "{escaped}",')
        
        insert_text = '\n' + '\n'.join(insert_parts)
        content = content[:line_end] + insert_text + content[line_end:]
        patched += 1
        print(f"  [OK] Patched: '{ko_key[:50]}...'")
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print(f"\n총 {patched}개 항목 패치 완료")
    return patched

if __name__ == '__main__':
    filepath = 'client/src/components/TreatmentsEquipmentSection.tsx'
    print(f"패치 시작: {filepath}")
    count = patch_file(filepath)
    print(f"패치 완료: {count}개 항목")
