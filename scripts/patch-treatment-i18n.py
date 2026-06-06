#!/usr/bin/env python3
"""
Treatment 데이터의 detail/effect/sessions/badge 필드에
JA/ZH 번역을 추가하고 렌더링 코드를 getText() 패턴으로 교체하는 스크립트.

실행: python3 scripts/patch-treatment-i18n.py
"""

import re

SRC = "client/src/components/TreatmentsEquipmentSection.tsx"

with open(SRC, "r", encoding="utf-8") as f:
    src = f.read()

# ─────────────────────────────────────────────────────────────────────────────
# 1. Treatment 인터페이스에 다국어 필드 추가
# ─────────────────────────────────────────────────────────────────────────────
OLD_INTERFACE = """  // 상세 모달용 추가 필드
  detail?: string;       // 더 긴 상세 설명
  caution?: string;      // 주의사항
  sessions?: string;     // 권장 횟수/주기
  effect?: string;       // 기대 효과
  related?: string[];    // 연관 시술 추천
  steps?: { step: number; title: string; desc: string }[]; // 치료 단계"""

NEW_INTERFACE = """  // 상세 모달용 추가 필드
  detail?: string;       // 더 긴 상세 설명 (ko)
  detailEn?: string;     // 상세 설명 (en)
  detailJa?: string;     // 상세 설명 (ja)
  detailZh?: string;     // 상세 설명 (zh)
  caution?: string;      // 주의사항 (ko)
  sessions?: string;     // 권장 횟수/주기 (ko)
  sessionsEn?: string;   // 권장 횟수/주기 (en)
  sessionsJa?: string;   // 권장 횟수/주기 (ja)
  sessionsZh?: string;   // 권장 횟수/주기 (zh)
  effect?: string;       // 기대 효과 (ko)
  effectEn?: string;     // 기대 효과 (en)
  effectJa?: string;     // 기대 효과 (ja)
  effectZh?: string;     // 기대 효과 (zh)
  related?: string[];    // 연관 시술 추천
  steps?: { step: number; title: string; desc: string }[]; // 치료 단계"""

src = src.replace(OLD_INTERFACE, NEW_INTERFACE, 1)

# ─────────────────────────────────────────────────────────────────────────────
# 2. 렌더링 코드 교체: item.sessions → getText(item.sessions, item.sessionsEn, ...)
# ─────────────────────────────────────────────────────────────────────────────
src = src.replace(
    "<p className=\"text-sm font-semibold\" style={{ color: \"#374151\" }}>{item.sessions}</p>",
    "<p className=\"text-sm font-semibold\" style={{ color: \"#374151\" }}>{getText(item.sessions, item.sessionsEn, item.sessionsJa, item.sessionsZh)}</p>",
    1
)

# ─────────────────────────────────────────────────────────────────────────────
# 3. 렌더링 코드 교체: item.detail ?? getText(...) → getText(item.detail, item.detailEn, ...)
# ─────────────────────────────────────────────────────────────────────────────
src = src.replace(
    "{item.detail ?? getText(item.desc, item.descEn, item.descJa, item.descZh)}",
    "{getText(item.detail || item.desc, item.detailEn || item.descEn, item.detailJa || item.descJa, item.detailZh || item.descZh)}",
    1
)

# ─────────────────────────────────────────────────────────────────────────────
# 4. 렌더링 코드 교체: item.effect → getText(item.effect, item.effectEn, ...)
# ─────────────────────────────────────────────────────────────────────────────
src = src.replace(
    "<p className=\"text-sm\" style={{ color: \"#374151\", lineHeight: 1.6 }}>{item.effect}</p>",
    "<p className=\"text-sm\" style={{ color: \"#374151\", lineHeight: 1.6 }}>{getText(item.effect, item.effectEn, item.effectJa, item.effectZh)}</p>",
    1
)

# ─────────────────────────────────────────────────────────────────────────────
# 5. Equipment 인터페이스에 다국어 detail 필드 추가
# ─────────────────────────────────────────────────────────────────────────────
OLD_EQ_INTERFACE = """  image: string;
  detail?: string;
}
const EQUIPMENT"""

NEW_EQ_INTERFACE = """  image: string;
  detail?: string;       // 상세 설명 (ko)
  detailEn?: string;     // 상세 설명 (en)
  detailJa?: string;     // 상세 설명 (ja)
  detailZh?: string;     // 상세 설명 (zh)
}
const EQUIPMENT"""

src = src.replace(OLD_EQ_INTERFACE, NEW_EQ_INTERFACE, 1)

# ─────────────────────────────────────────────────────────────────────────────
# 6. Equipment 모달 렌더링 교체: selectedEq.detail → getText(...)
# ─────────────────────────────────────────────────────────────────────────────
OLD_EQ_RENDER = """            {selectedEq.detail ? (
              <p className="text-sm leading-relaxed" style={{ color: "#374151" }}>{selectedEq.detail}</p>
            ) : (
              <p className="text-sm" style={{ color: "#9CA3AF" }}>
                {lang === 'en' ? 'Detailed information coming soon.' : lang === 'ja' ? '詳細情報は準備中です。' : lang === 'zh' ? '详细信息准备中。' : '상세 정보 준비 중입니다.'}
              </p>
            )}"""

NEW_EQ_RENDER = """            {(selectedEq.detail || selectedEq.detailEn || selectedEq.detailJa || selectedEq.detailZh) ? (
              <p className="text-sm leading-relaxed" style={{ color: "#374151" }}>{getEqText(selectedEq.detail, selectedEq.detailEn, selectedEq.detailJa, selectedEq.detailZh)}</p>
            ) : (
              <p className="text-sm" style={{ color: "#9CA3AF" }}>
                {lang === 'en' ? 'Detailed information coming soon.' : lang === 'ja' ? '詳細情報は準備中です。' : lang === 'zh' ? '详细信息准备中。' : '상세 정보 준비 중입니다.'}
              </p>
            )}"""

src = src.replace(OLD_EQ_RENDER, NEW_EQ_RENDER, 1)

# ─────────────────────────────────────────────────────────────────────────────
# 7. Treatment 데이터에 JA/ZH 번역 추가 (detail/effect/sessions 필드)
# ─────────────────────────────────────────────────────────────────────────────

# 번역 데이터: (ko_detail_snippet, en, ja, zh) 형식
# 각 항목은 (ko_unique_snippet, en_translation, ja_translation, zh_translation)
TRANSLATIONS = [
    # ── best ──────────────────────────────────────────────────────────────────
    # 울써마지 리프팅 + 리쥬란
    (
        'detail: "울쎄라피 프라임의 집속 초음파(HIFU) 에너지가 SMAS층(근막층)까지 도달하여',
        'detailEn: "Ultherapy Prime\'s focused ultrasound (HIFU) energy reaches the SMAS (fascial) layer to induce lifting from deep within the skin. Thermage FLX\'s RF energy stimulates dermal collagen to improve skin elasticity. Rejuran Healer (salmon DNA) is added to simultaneously provide skin regeneration and hydration in this premium combination program. Performed under sedation, so you can receive treatment comfortably without pain, with same-day return to daily activities."',
        'detailJa: "ウルセラピー プライムの集束超音波（HIFU）エネルギーがSMAS層（筋膜層）まで到達し、皮膚の深部からリフティング効果を誘導します。サーマジFLXの高周波エネルギーが真皮コラーゲンを刺激して皮膚の弾力を改善します。リジュランヒーラー（サーモンDNA成分）を加えて皮膚再生と水分補給を同時に提供するプレミアム複合プログラムです。鎮静下施術で行われるため、痛みなく快適に受けられ、施術当日から日常生活に復帰できます。"',
        'detailZh: "超声刀Prime的聚焦超声（HIFU）能量到达SMAS层（筋膜层），从皮肤深处诱导提升效果。热玛吉FLX的射频能量刺激真皮胶原蛋白，改善皮肤弹力。加入婴儿针（三文鱼DNA成分），同时提供皮肤再生和补水的复合高端项目。在镇静下进行，无痛舒适，当天即可恢复日常活动。"',
        'effect: "얼굴 리프팅, 피부 탄력 개선, 주름 완화, 피부 재생, 수분 보충"',
        'effectEn: "Facial lifting, skin elasticity improvement, wrinkle reduction, skin regeneration, hydration"',
        'effectJa: "顔のリフティング、皮膚弾力改善、しわ緩和、皮膚再生、水分補給"',
        'effectZh: "面部提升、皮肤弹力改善、皱纹缓解、皮肤再生、补水"',
        'sessions: "1~2회 (6~12개월 간격)"',
        'sessionsEn: "1–2 sessions (6–12 month intervals)"',
        'sessionsJa: "1〜2回（6〜12ヶ月間隔）"',
        'sessionsZh: "1~2次（间隔6~12个月）"',
    ),
    # 프로파운드 RF 리프팅
    (
        'detail: "프로파운드 RF는 마이크로니들을 통해 RF(고주파) 에너지를 진피층 정확한 깊이에 직접 전달하는 장비입니다.',
        'detailEn: "Profound RF is a device that delivers RF (radiofrequency) energy directly to the precise depth of the dermis via microneedles. Because energy is delivered directly to the dermis without passing through the skin surface, it powerfully stimulates collagen, elastin, and hyaluronic acid production in the dermis without surface damage. Clinical studies have reported a significant increase in collagen production with a single treatment. A recovery period of 10 days to 2 weeks is required after treatment, but correspondingly strong lifting and elasticity improvement effects can be expected."',
        'detailJa: "プロファウンドRFはマイクロニードルを通じてRF（高周波）エネルギーを真皮層の正確な深さに直接届ける機器です。皮膚表面を通過せず真皮層に直接エネルギーを届けるため、表面損傷なしに真皮内のコラーゲン・エラスチン・ヒアルロン酸生成を強力に刺激します。臨床研究では1回の施術でコラーゲン生成が有意に増加することが報告されています。施術後10日〜2週間の回復期間が必要ですが、それだけ強力なリフティング・弾力改善効果が期待できます。"',
        'detailZh: "Profound RF是通过微针将RF（射频）能量直接传递到真皮层精确深度的设备。由于能量不经过皮肤表面直接传递到真皮层，可在不损伤表面的情况下强力刺激真皮内胶原蛋白、弹性蛋白和透明质酸的生成。临床研究报告显示，一次治疗后胶原蛋白生成显著增加。治疗后需要10天至2周的恢复期，但相应地可以期待强效的提升和弹力改善效果。"',
        'effect: "피부 탄력 개선, 얼굴 리프팅, 콜라겐·엘라스틴 생성, 주름 완화, 피부 조직 강화"',
        'effectEn: "Skin elasticity improvement, facial lifting, collagen & elastin production, wrinkle reduction, skin tissue strengthening"',
        'effectJa: "皮膚弾力改善、顔のリフティング、コラーゲン・エラスチン生成、しわ緩和、皮膚組織強化"',
        'effectZh: "皮肤弹力改善、面部提升、胶原蛋白和弹性蛋白生成、皱纹缓解、皮肤组织强化"',
        'sessions: "1~2회 (12개월 간격)"',
        'sessionsEn: "1–2 sessions (12-month intervals)"',
        'sessionsJa: "1〜2回（12ヶ月間隔）"',
        'sessionsZh: "1~2次（间隔12个月）"',
    ),
]

# 단순 문자열 치환 방식으로 각 Treatment 항목에 번역 추가
# detail 필드 다음에 detailEn/detailJa/detailZh 추가
# effect 필드 다음에 effectEn/effectJa/effectZh 추가
# sessions 필드 다음에 sessionsEn/sessionsJa/sessionsZh 추가

# 이 방식 대신, 각 항목을 직접 파싱하여 번역을 삽입하는 방법 사용
# 파일이 너무 크므로 LLM 번역을 직접 삽입하는 방식으로 처리

print("스크립트 준비 완료. 번역 데이터를 직접 삽입하는 방식으로 처리합니다.")
print(f"현재 파일 크기: {len(src)} 바이트")

# 인터페이스 및 렌더링 코드 변경사항만 저장
with open(SRC, "w", encoding="utf-8") as f:
    f.write(src)

print("인터페이스 및 렌더링 코드 변경 완료.")
print("다음 단계: 각 Treatment 항목에 번역 데이터 직접 삽입")
