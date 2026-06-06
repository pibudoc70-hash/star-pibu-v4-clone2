#!/usr/bin/env python3
"""
49개 effect 번역 누락 항목에 effectJa/effectZh 추가
라인 기반으로 effect: "..." 라인을 찾아 다음 라인에 effectJa가 없으면 삽입
"""

effect_translations = {
    '얼굴 리프팅, 턱선 개선, 피부 탄력 향상, 주름 완화, SMAS층 자극': (
        'Facial lifting, jawline improvement, skin elasticity enhancement, wrinkle reduction, SMAS layer stimulation',
        '顔リフティング、フェイスライン改善、肌弾力向上、シワ緩和、SMAS層刺激',
        '面部提升、改善下颌线、提升皮肤弹力、缓解皱纹、刺激SMAS层'
    ),
    '피부 탄력 개선, 얼굴 리프팅, 주름 완화, 콜라겐 재생, 눈가·목 탄력 개선': (
        'Skin elasticity improvement, facial lifting, wrinkle reduction, collagen regeneration, eye and neck elasticity improvement',
        '肌弾力改善、顔リフティング、シワ緩和、コラーゲン再生、目元・首の弾力改善',
        '改善皮肤弹力、面部提升、缓解皱纹、胶原蛋白再生、改善眼角和颈部弹力'
    ),
    '얼굴 리프팅, 피부 탄력 개선, 주름 완화, 턱선 개선': (
        'Facial lifting, skin elasticity improvement, wrinkle reduction, jawline improvement',
        '顔リフティング、肌弾力改善、シワ緩和、フェイスライン改善',
        '面部提升、改善皮肤弹力、缓解皱纹、改善下颌线'
    ),
    '얼굴 리프팅, 턱선 개선, 피부 탄력 향상, SMAS층 자극, 주름 완화': (
        'Facial lifting, jawline improvement, skin elasticity enhancement, SMAS layer stimulation, wrinkle reduction',
        '顔リフティング、フェイスライン改善、肌弾力向上、SMAS層刺激、シワ緩和',
        '面部提升、改善下颌线、提升皮肤弹力、刺激SMAS层、缓解皱纹'
    ),
    '피부 탄력 개선, 얼굴 리프팅, 콜라겐·엘라스틴 생성, 주름 완화': (
        'Skin elasticity improvement, facial lifting, collagen & elastin production, wrinkle reduction',
        '肌弾力改善、顔リフティング、コラーゲン・エラスチン生成、シワ緩和',
        '改善皮肤弹力、面部提升、促进胶原蛋白和弹性蛋白生成、缓解皱纹'
    ),
    '얼굴 리프팅, 피부 탄력 개선, 얼굴 윤곽 개선, 주름 완화': (
        'Facial lifting, skin elasticity improvement, facial contour improvement, wrinkle reduction',
        '顔リフティング、肌弾力改善、顔の輪郭改善、シワ緩和',
        '面部提升、改善皮肤弹力、改善面部轮廓、缓解皱纹'
    ),
    '피부 탄력 개선, 모공 축소, 콜라겐 생성 유도, 여드름 흉터 개선': (
        'Skin elasticity improvement, pore reduction, collagen production induction, acne scar improvement',
        '肌弾力改善、毛穴縮小、コラーゲン生成誘導、ニキビ跡改善',
        '改善皮肤弹力、缩小毛孔、诱导胶原蛋白生成、改善痤疮疤痕'
    ),
    '얼굴 리프팅, 피부 탄력 개선, 턱선 개선, 주름 완화': (
        'Facial lifting, skin elasticity improvement, jawline improvement, wrinkle reduction',
        '顔リフティング、肌弾力改善、フェイスライン改善、シワ緩和',
        '面部提升、改善皮肤弹力、改善下颌线、缓解皱纹'
    ),
    '다크서클 개선, 눈밑 볼록함 해소, 눈물고랑 음영 완화, 자연스러운 눈밑 라인, 피로해 보이는 인상 개선': (
        'Dark circle improvement, under-eye puffiness reduction, tear trough shadow relief, natural under-eye line, tired appearance improvement',
        'クマ改善、目の下のふくらみ解消、涙袋の影緩和、自然な目の下ライン、疲れた印象の改善',
        '改善黑眼圈、消除眼下浮肿、缓解泪沟阴影、自然眼下线条、改善疲惫外观'
    ),
    '눈밑 지방 타겟팅 충격파 에너지 전달, 지방층 부피 & 부종 감소, 림프 순환 및 탄력·잔주름 개선, 절개·멍·흉터 걱정 없이 일상생활 복귀 가능': (
        'Targeted shockwave energy delivery to under-eye fat, fat layer volume & swelling reduction, lymph circulation and elasticity & fine wrinkle improvement, return to daily life without incision, bruising, or scarring',
        '目の下の脂肪への衝撃波エネルギー照射、脂肪層の体積・むくみ減少、リンパ循環と弾力・小じわ改善、切開・あざ・傷跡の心配なく日常生活復帰',
        '靶向冲击波能量传递至眼下脂肪、减少脂肪层体积和浮肿、改善淋巴循环及弹力和细纹、无需切开无瘀青无疤痕即可恢复日常生活'
    ),
    '안면홍조 개선, 모세혈관 확장 감소, 주사비 치료, 피부 탄력 개선, 콜라겐 생성 유도': (
        'Facial redness improvement, telangiectasia reduction, rosacea treatment, skin elasticity improvement, collagen production induction',
        '顔面紅潮改善、毛細血管拡張軽減、酒さ治療、肌弾力改善、コラーゲン生成誘導',
        '改善面部潮红、减少毛细血管扩张、治疗玫瑰痤疮、改善皮肤弹力、诱导胶原蛋白生成'
    ),
    '안면홍조 개선, 잡티·색소 개선, 모공 축소, 피부 탄력 향상, 피부 노화 개선': (
        'Facial redness improvement, blemish & pigmentation improvement, pore reduction, skin elasticity enhancement, skin aging improvement',
        '顔面紅潮改善、シミ・色素改善、毛穴縮小、肌弾力向上、肌老化改善',
        '改善面部潮红、改善斑点和色素、缩小毛孔、提升皮肤弹力、改善皮肤老化'
    ),
    '안면홍조 개선, 모세혈관 확장 감소, 주사비 치료, 혈관종 제거, 피부 붉기 완화': (
        'Facial redness improvement, telangiectasia reduction, rosacea treatment, hemangioma removal, skin redness relief',
        '顔面紅潮改善、毛細血管拡張軽減、酒さ治療、血管腫除去、肌の赤み緩和',
        '改善面部潮红、减少毛细血管扩张、治疗玫瑰痤疮、去除血管瘤、缓解皮肤发红'
    ),
    '기미·잡티 개선, 모공 축소, 피부 탄력 향상, 피부톤 개선, 편평사마귀 제거': (
        'Melasma & blemish improvement, pore reduction, skin elasticity enhancement, skin tone improvement, flat wart removal',
        'シミ・くすみ改善、毛穴縮小、肌弾力向上、肌トーン改善、扁平疣贅除去',
        '改善黄褐斑和色斑、缩小毛孔、提升皮肤弹力、改善肤色、去除扁平疣'
    ),
    '안면홍조 개선, 모세혈관 확장 감소, 혈관종 치료, 체리 혈관종 제거, 피부 붉기 완화': (
        'Facial redness improvement, telangiectasia reduction, hemangioma treatment, cherry hemangioma removal, skin redness relief',
        '顔面紅潮改善、毛細血管拡張軽減、血管腫治療、チェリー血管腫除去、肌の赤み緩和',
        '改善面部潮红、减少毛细血管扩张、治疗血管瘤、去除樱桃状血管瘤、缓解皮肤发红'
    ),
    '안면홍조 개선, 모세혈관 확장 감소, 혈관종 치료, 포도주색 반점 개선': (
        'Facial redness improvement, telangiectasia reduction, hemangioma treatment, port-wine stain improvement',
        '顔面紅潮改善、毛細血管拡張軽減、血管腫治療、ポートワイン斑改善',
        '改善面部潮红、减少毛细血管扩张、治疗血管瘤、改善葡萄酒色斑'
    ),
    '기미·잡티·검버섯 개선, 피부 톤 밝기, 피부 재생 효과, 색소 침착 방지': (
        'Melasma, blemish & age spot improvement, skin tone brightening, skin regeneration effect, pigmentation prevention',
        'シミ・くすみ・老人性色素斑改善、肌トーン明るく、肌再生効果、色素沈着防止',
        '改善黄褐斑、色斑和老年斑、提亮肤色、皮肤再生效果、防止色素沉着'
    ),
    '기미·잡티 개선, 문신 제거, 검버섯·오타모반 개선, 피부 톤 밝기': (
        'Melasma & blemish improvement, tattoo removal, age spot & Ota nevus improvement, skin tone brightening',
        'シミ・くすみ改善、タトゥー除去、老人性色素斑・太田母斑改善、肌トーン明るく',
        '改善黄褐斑和色斑、去除纹身、改善老年斑和太田痣、提亮肤色'
    ),
    '기미·잡티 개선, 문신 제거, 검버섯·일광 흑자 개선, 피부 톤 밝기, 색소 침착 방지': (
        'Melasma & blemish improvement, tattoo removal, age spot & solar lentigo improvement, skin tone brightening, pigmentation prevention',
        'シミ・くすみ改善、タトゥー除去、老人性色素斑・日光黒子改善、肌トーン明るく、色素沈着防止',
        '改善黄褐斑和色斑、去除纹身、改善老年斑和日光性雀斑、提亮肤色、防止色素沉着'
    ),
    '홍조 개선, 기미·검버섯 개선, 혈관종·모세혈관 확장증 치료, 잔주름 개선, 여드름·여드름 흡터 개선, 피부탄력 향상': (
        'Redness improvement, melasma & age spot improvement, hemangioma & telangiectasia treatment, fine wrinkle improvement, acne & acne scar improvement, skin elasticity enhancement',
        '赤み改善、シミ・老人性色素斑改善、血管腫・毛細血管拡張症治療、小じわ改善、ニキビ・ニキビ跡改善、肌弾力向上',
        '改善潮红、改善黄褐斑和老年斑、治疗血管瘤和毛细血管扩张症、改善细纹、改善痤疮和痤疮疤痕、提升皮肤弹力'
    ),
    '기미·잡티·일광 흑자 개선, 홍조 개선, 피부 재생, 피부 노화 예방': (
        'Melasma, blemish & solar lentigo improvement, redness improvement, skin regeneration, skin aging prevention',
        'シミ・くすみ・日光黒子改善、赤み改善、肌再生、肌老化予防',
        '改善黄褐斑、色斑和日光性雀斑、改善潮红、皮肤再生、预防皮肤老化'
    ),
    '기미·잡티 개선, 홍조·모세혈관 확장 개선, 피부결 정돈, 피부 재생': (
        'Melasma & blemish improvement, redness & telangiectasia improvement, skin texture refinement, skin regeneration',
        'シミ・くすみ改善、赤み・毛細血管拡張改善、肌質整頓、肌再生',
        '改善黄褐斑和色斑、改善潮红和毛细血管扩张、整理肌肤质感、皮肤再生'
    ),
    '여드름·수두·수술·화상 흉터 개선, 모공 축소, 피부 탄력 강화, 미백 효과, 기미·잡티 완화': (
        'Acne, chickenpox, surgical & burn scar improvement, pore reduction, skin elasticity strengthening, whitening effect, melasma & blemish relief',
        'ニキビ・水痘・手術・火傷跡改善、毛穴縮小、肌弾力強化、美白効果、シミ・くすみ緩和',
        '改善痤疮、水痘、手术和烧伤疤痕、缩小毛孔、强化皮肤弹力、美白效果、缓解黄褐斑和色斑'
    ),
    '패인 흉터 볼륨 회복, 흉터 음영 개선, 즉각적인 피부 표면 개선': (
        'Sunken scar volume restoration, scar shadow improvement, immediate skin surface improvement',
        '陥没傷跡ボリューム回復、傷跡の影改善、即時的な肌表面改善',
        '恢复凹陷疤痕容量、改善疤痕阴影、即时改善皮肤表面'
    ),
    '수술 흉터 개선, 켈로이드 치료, 비후성 흉터 개선, 흉터 색소 침착 완화, 흉터 조직 연화': (
        'Surgical scar improvement, keloid treatment, hypertrophic scar improvement, scar pigmentation relief, scar tissue softening',
        '手術跡改善、ケロイド治療、肥厚性瘢痕改善、傷跡色素沈着緩和、傷跡組織軟化',
        '改善手术疤痕、治疗瘢痕疙瘩、改善增生性疤痕、缓解疤痕色素沉着、软化疤痕组织'
    ),
    '여드름 흉터 개선, 모공 축소, 피부결 정돈, 콜라겐 재생 유도': (
        'Acne scar improvement, pore reduction, skin texture refinement, collagen regeneration induction',
        'ニキビ跡改善、毛穴縮小、肌質整頓、コラーゲン再生誘導',
        '改善痤疮疤痕、缩小毛孔、整理肌肤质感、诱导胶原蛋白再生'
    ),
    '모공 축소, 피부결 정돈, 여드름 흉터 개선, 색소 병변 개선, Halo Glow 효과': (
        'Pore reduction, skin texture refinement, acne scar improvement, pigment lesion improvement, Halo Glow effect',
        '毛穴縮小、肌質整頓、ニキビ跡改善、色素病変改善、Halo Glow効果',
        '缩小毛孔、整理肌肤质感、改善痤疮疤痕、改善色素病变、Halo Glow效果'
    ),
    '피부 수분 보충, 탄력·광채 개선, 피부결 정돈, 즉각적인 피부 촉촉함': (
        'Skin hydration replenishment, elasticity & radiance improvement, skin texture refinement, immediate skin moisture',
        '肌水分補充、弾力・光沢改善、肌質整頓、即時的な肌の潤い',
        '补充皮肤水分、改善弹力和光泽、整理肌肤质感、即时皮肤保湿'
    ),
    '피부 세포 재생, 콜라겐 생성 촉진, 탄력 회복, 주름 개선, 피부 톤 균일화': (
        'Skin cell regeneration, collagen production promotion, elasticity restoration, wrinkle improvement, skin tone evening',
        '肌細胞再生、コラーゲン生成促進、弾力回復、シワ改善、肌トーン均一化',
        '皮肤细胞再生、促进胶原蛋白生成、恢复弹力、改善皱纹、均匀肤色'
    ),
    '콜라겐 합성 촉진, 피부 탄력 회복, 자연스러운 볼륨 개선, 지속 효과 6~12개월': (
        'Collagen synthesis promotion, skin elasticity restoration, natural volume improvement, lasting effect 6–12 months',
        'コラーゲン合成促進、肌弾力回復、自然なボリューム改善、6〜12ヶ月の持続効果',
        '促进胶原蛋白合成、恢复皮肤弹力、自然改善容量、效果持续6~12个月'
    ),
    '피부 장벽 강화, 콜라겐 합성 촉진, 탄력 개선, 피부 재생, 광채 효과': (
        'Skin barrier strengthening, collagen synthesis promotion, elasticity improvement, skin regeneration, radiance effect',
        '肌バリア強化、コラーゲン合成促進、弾力改善、肌再生、光沢効果',
        '强化皮肤屏障、促进胶原蛋白合成、改善弹力、皮肤再生、光泽效果'
    ),
    '볼 볼륨 회복, 팔자주름 개선, 피부 탄력 향상, 콜라겐 생성 유도, 2년 이상 효과 지속': (
        'Cheek volume restoration, nasolabial fold improvement, skin elasticity enhancement, collagen production induction, effects lasting 2+ years',
        '頬ボリューム回復、法令線改善、肌弾力向上、コラーゲン生成誘導、2年以上効果持続',
        '恢复面颊容量、改善法令纹、提升皮肤弹力、诱导胶原蛋白生成、效果持续2年以上'
    ),
    '콜라겐 재생, 피부 수분 보충, 볼륨 회복, 피부 탄력 개선': (
        'Collagen regeneration, skin hydration replenishment, volume restoration, skin elasticity improvement',
        'コラーゲン再生、肌水分補充、ボリューム回復、肌弾力改善',
        '胶原蛋白再生、补充皮肤水分、恢复容量、改善皮肤弹力'
    ),
    '피부 재생 촉진, 수분 공급, 피부 장벽 강화, 탄력 개선, 민감한 피부 진정': (
        'Skin regeneration promotion, hydration supply, skin barrier strengthening, elasticity improvement, sensitive skin soothing',
        '肌再生促進、水分供給、肌バリア強化、弾力改善、敏感肌鎮静',
        '促进皮肤再生、补充水分、强化皮肤屏障、改善弹力、镇静敏感肌肤'
    ),
    '이마·미간·눈가 주름 완화, 사각턱 라인 개선, 표정 주름 예방': (
        'Forehead, frown & eye wrinkle reduction, square jaw line improvement, expression wrinkle prevention',
        '額・眉間・目元のシワ緩和、エラ張り改善、表情ジワ予防',
        '缓解额头、眉间和眼角皱纹、改善方形下颌线、预防表情纹'
    ),
    '꺼진 부위 볼륨 보완, 팔자·입술·턱 라인 개선, 얼굴 윤곽 균형 보정': (
        'Sunken area volume supplementation, nasolabial fold, lip & chin line improvement, facial contour balance correction',
        '凹んだ部位のボリューム補完、法令線・唇・顎ライン改善、顔の輪郭バランス補正',
        '补充凹陷部位容量、改善法令纹、嘴唇和下颌线、校正面部轮廓平衡'
    ),
    '이중턱 개선, 볼 지방 감소, 얼굴 윤곽 개선, 비수술적 지방 제거': (
        'Double chin improvement, cheek fat reduction, facial contour improvement, non-surgical fat removal',
        '二重あご改善、頬脂肪軽減、顔の輪郭改善、非手術的脂肪除去',
        '改善双下巴、减少面颊脂肪、改善面部轮廓、非手术脂肪去除'
    ),
    '피부 재생, 탄력 회복, 수분 보충, 피부결 개선, 모공 축소': (
        'Skin regeneration, elasticity restoration, hydration replenishment, skin texture improvement, pore reduction',
        '肌再生、弾力回復、水分補充、肌質改善、毛穴縮小',
        '皮肤再生、恢复弹力、补充水分、改善肌肤质感、缩小毛孔'
    ),
    '피부 재생, 탄력 회복, 즉각적인 수분 공급, 피부결 개선, 광채 효과': (
        'Skin regeneration, elasticity restoration, immediate hydration supply, skin texture improvement, radiance effect',
        '肌再生、弾力回復、即時的な水分供給、肌質改善、光沢効果',
        '皮肤再生、恢复弹力、即时补充水分、改善肌肤质感、光泽效果'
    ),
    '염증성 여드름 개선, 항생제 부작용 없는 치료, 재발 방지, 피부 광채 개선': (
        'Inflammatory acne improvement, treatment without antibiotic side effects, recurrence prevention, skin radiance improvement',
        '炎症性ニキビ改善、抗生物質副作用のない治療、再発防止、肌光沢改善',
        '改善炎症性痤疮、无抗生素副作用治疗、防止复发、改善皮肤光泽'
    ),
    '여드름 흉터 개선, 모공 축소, 피부 재생, 콜라겐 생성 자극': (
        'Acne scar improvement, pore reduction, skin regeneration, collagen production stimulation',
        'ニキビ跡改善、毛穴縮小、肌再生、コラーゲン生成刺激',
        '改善痤疮疤痕、缩小毛孔、皮肤再生、刺激胶原蛋白生成'
    ),
    '염증성 여드름 개선, 피지 분비 억제, 여드름 재발 방지, 피부 광채 개선': (
        'Inflammatory acne improvement, sebum secretion suppression, acne recurrence prevention, skin radiance improvement',
        '炎症性ニキビ改善、皮脂分泌抑制、ニキビ再発防止、肌光沢改善',
        '改善炎症性痤疮、抑制皮脂分泌、防止痤疮复发、改善皮肤光泽'
    ),
    '땀 분비량 평균 82% 감소, 액취증 냄새 현저히 개선, 털 성장 감소 부가 효과': (
        'Average 82% reduction in sweat secretion, significant improvement of body odor, additional effect of reduced hair growth',
        '発汗量平均82%減少、腋臭の臭い著しく改善、毛の成長減少の付加効果',
        '平均减少82%汗液分泌、显著改善腋臭气味、额外减少毛发生长效果'
    ),
    '액취증 냄새 80% 이상 개선, 다한증 70% 이상 감소, 겨드랑이 라인 개선': (
        'Over 80% improvement of body odor, over 70% reduction of hyperhidrosis, underarm line improvement',
        '腋臭の臭い80%以上改善、多汗症70%以上減少、脇のラインの改善',
        '腋臭气味改善80%以上、多汗症减少70%以上、改善腋下线条'
    ),
    '땀 분비량 80~90% 감소, 냄새 개선, 손발 다한증 즉각 효과': (
        '80–90% reduction in sweat secretion, odor improvement, immediate effect on hand & foot hyperhidrosis',
        '発汗量80〜90%減少、臭い改善、手足の多汗症に即効性',
        '减少80~90%汗液分泌、改善气味、对手脚多汗症立即见效'
    ),
    '손·발톱 진균 선택적 파괴, 변색·두꺼워진 손·발톱 개선, 항진균제 부작용 없음': (
        'Selective nail fungus destruction, discolored & thickened nail improvement, no antifungal side effects',
        '爪の真菌選択的破壊、変色・肥厚した爪の改善、抗真菌薬副作用なし',
        '选择性破坏指甲真菌、改善变色和增厚的指甲、无抗真菌药副作用'
    ),
    '손·발톱 진균 파괴, 변색·두꺼워진 손·발톱 개선, 재발 억제, 항진균제 부작용 없음': (
        'Nail fungus destruction, discolored & thickened nail improvement, recurrence suppression, no antifungal side effects',
        '爪の真菌破壊、変色・肥厚した爪の改善、再発抑制、抗真菌薬副作用なし',
        '破坏指甲真菌、改善变色和增厚的指甲、抑制复发、无抗真菌药副作用'
    ),
    '백반증 부위 색소 재생, 피부색 균일화, 자연스러운 피부 회복, 재발 억제': (
        'Vitiligo area pigment regeneration, skin color evening, natural skin recovery, recurrence suppression',
        '白斑部位の色素再生、肌色均一化、自然な肌回復、再発抑制',
        '白癜风部位色素再生、均匀肤色、自然皮肤恢复、抑制复发'
    ),
    '전신 백반증 색소 재생, 건선·아토피 피부염 증상 완화, 피부 면역 조절': (
        'Whole-body vitiligo pigment regeneration, psoriasis & atopic dermatitis symptom relief, skin immune regulation',
        '全身白斑色素再生、乾癬・アトピー性皮膚炎症状緩和、皮膚免疫調節',
        '全身白癜风色素再生、缓解银屑病和特应性皮炎症状、调节皮肤免疫'
    ),
}

sessions_translations = {
    '1회 (수술)': ('1 session (surgery)', '1回（手術）', '1次（手术）'),
    '1~3회': ('1–3 sessions', '1〜3回', '1~3次'),
    '3~5회': ('3–5 sessions', '3〜5回', '3~5次'),
    '5~10회': ('5–10 sessions', '5〜10回', '5~10次'),
    '10~20회': ('10–20 sessions', '10〜20回', '10~20次'),
    '1~2회': ('1–2 sessions', '1〜2回', '1~2次'),
    '2~4회': ('2–4 sessions', '2〜4回', '2~4次'),
    '4~6회': ('4–6 sessions', '4〜6回', '4~6次'),
    '6~12회': ('6–12 sessions', '6〜12回', '6~12次'),
    '1회': ('1 session', '1回', '1次'),
    '2~3회': ('2–3 sessions', '2〜3回', '2~3次'),
    '3~6회': ('3–6 sessions', '3〜6回', '3~6次'),
    '6~10회': ('6–10 sessions', '6〜10回', '6~10次'),
    '4~8회': ('4–8 sessions', '4〜8回', '4~8次'),
    '1~4회': ('1–4 sessions', '1〜4回', '1~4次'),
    '3~4회': ('3–4 sessions', '3〜4回', '3~4次'),
    '5~8회': ('5–8 sessions', '5〜8回', '5~8次'),
    '8~12회': ('8–12 sessions', '8〜12回', '8~12次'),
    '개인별 상이': ('Varies by individual', '個人差あり', '因人而异'),
    '월 1회, 3~6개월': ('Once monthly, 3–6 months', '月1回、3〜6ヶ月', '每月1次，3~6个月'),
    '주 1~2회, 10~20회': ('1–2 times weekly, 10–20 sessions', '週1〜2回、10〜20回', '每周1~2次，10~20次'),
    '주 2~3회': ('2–3 times weekly', '週2〜3回', '每周2~3次'),
    '월 1~2회': ('1–2 times monthly', '月1〜2回', '每月1~2次'),
    '2~6회': ('2–6 sessions', '2〜6回', '2~6次'),
    '3~8회': ('3–8 sessions', '3〜8回', '3~8次'),
    '5~15회': ('5–15 sessions', '5〜15回', '5~15次'),
    '10~15회': ('10–15 sessions', '10〜15回', '10~15次'),
    '2~5회': ('2–5 sessions', '2〜5回', '2~5次'),
    '4~10회': ('4–10 sessions', '4〜10回', '4~10次'),
    '6~8회': ('6–8 sessions', '6〜8回', '6~8次'),
    '12~24회': ('12–24 sessions', '12〜24回', '12~24次'),
    '월 2~4회': ('2–4 times monthly', '月2〜4回', '每月2~4次'),
    '주 1회, 4~8주': ('Once weekly, 4–8 weeks', '週1回、4〜8週', '每周1次，4~8周'),
}

import re

with open('client/src/components/TreatmentsEquipmentSection.tsx', 'r') as f:
    lines = f.readlines()

new_lines = []
i = 0
effect_patched = 0
sessions_patched = 0

while i < len(lines):
    line = lines[i]

    # effect: "..." 라인 처리 (effectJa가 바로 다음에 없는 경우)
    if re.search(r'^\s+effect: "', line):
        # 다음 몇 라인에 effectJa가 있는지 확인
        has_ja = False
        for j in range(i+1, min(i+4, len(lines))):
            if 'effectJa:' in lines[j]:
                has_ja = True
                break
            if re.search(r'^\s+(?:sessions|detail|name|id|category|badge|caution|time|recovery|youtubeUrl|modalImage|steps|image|slug):', lines[j]):
                break

        if not has_ja:
            m = re.search(r'effect: "([^"]+)"', line)
            if m:
                ko_val = m.group(1)
                if ko_val in effect_translations:
                    en, ja, zh = effect_translations[ko_val]
                    indent = len(line) - len(line.lstrip())
                    indent_str = ' ' * indent
                    new_lines.append(line)
                    # effectEn이 없으면 추가
                    next_line = lines[i+1] if i+1 < len(lines) else ''
                    if 'effectEn:' not in next_line:
                        new_lines.append(f'{indent_str}effectEn: "{en}",\n')
                    new_lines.append(f'{indent_str}effectJa: "{ja}",\n')
                    new_lines.append(f'{indent_str}effectZh: "{zh}",\n')
                    effect_patched += 1
                    i += 1
                    continue

    # effectEn: "..." 라인 처리 (effectJa가 없는 경우)
    if re.search(r'^\s+effectEn: "', line):
        next_line = lines[i+1] if i+1 < len(lines) else ''
        if 'effectJa:' not in next_line:
            # 이전 라인에서 ko 값 찾기
            ko_val = None
            for j in range(max(0, i-3), i):
                m = re.search(r'effect: "([^"]+)"', lines[j])
                if m:
                    ko_val = m.group(1)
                    break
            if ko_val and ko_val in effect_translations:
                en, ja, zh = effect_translations[ko_val]
                indent = len(line) - len(line.lstrip())
                indent_str = ' ' * indent
                new_lines.append(line)
                new_lines.append(f'{indent_str}effectJa: "{ja}",\n')
                new_lines.append(f'{indent_str}effectZh: "{zh}",\n')
                effect_patched += 1
                i += 1
                continue

    # sessions: "..." 라인 처리
    if re.search(r'^\s+sessions: "', line):
        has_ja = False
        for j in range(i+1, min(i+4, len(lines))):
            if 'sessionsJa:' in lines[j]:
                has_ja = True
                break
            if re.search(r'^\s+(?:effect|detail|name|id|category|badge|caution|time|recovery|youtubeUrl|modalImage|steps|image|slug):', lines[j]):
                break

        if not has_ja:
            m = re.search(r'sessions: "([^"]+)"', line)
            if m:
                ko_val = m.group(1)
                if ko_val in sessions_translations:
                    en, ja, zh = sessions_translations[ko_val]
                    indent = len(line) - len(line.lstrip())
                    indent_str = ' ' * indent
                    new_lines.append(line)
                    next_line = lines[i+1] if i+1 < len(lines) else ''
                    if 'sessionsEn:' not in next_line:
                        new_lines.append(f'{indent_str}sessionsEn: "{en}",\n')
                    new_lines.append(f'{indent_str}sessionsJa: "{ja}",\n')
                    new_lines.append(f'{indent_str}sessionsZh: "{zh}",\n')
                    sessions_patched += 1
                    i += 1
                    continue

    # sessionsEn: "..." 라인 처리
    if re.search(r'^\s+sessionsEn: "', line):
        next_line = lines[i+1] if i+1 < len(lines) else ''
        if 'sessionsJa:' not in next_line:
            ko_val = None
            for j in range(max(0, i-3), i):
                m = re.search(r'sessions: "([^"]+)"', lines[j])
                if m:
                    ko_val = m.group(1)
                    break
            if ko_val and ko_val in sessions_translations:
                en, ja, zh = sessions_translations[ko_val]
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
sessions_list = re.findall(r'sessions: "([^"]+)"', content)
sessions_ja = re.findall(r'sessionsJa: "([^"]+)"', content)
print(f'effect 총 {len(effects)}개, effectJa 총 {len(effects_ja)}개')
print(f'sessions 총 {len(sessions_list)}개, sessionsJa 총 {len(sessions_ja)}개')
