#!/usr/bin/env python3
"""
sessions: "..." 필드 다음에 sessionsEn/sessionsJa/sessionsZh 삽입
- 이미 sessionsJa가 있는 경우 건너뜀
- sessions 없이 독립적으로 존재하는 sessionsJa/sessionsZh는 제거
"""
import re

sessions_translations = {
    '1~2회 (6~12개월 간격)': ('1-2 sessions (6-12 month intervals)', '1〜2回（6〜12ヶ月間隔）', '1-2次（间隔6-12个月）'),
    '1~2회 (12개월 간격)': ('1-2 sessions (12-month intervals)', '1〜2回（12ヶ月間隔）', '1-2次（间隔12个月）'),
    '2~4회 (4~8주 간격)': ('2-4 sessions (4-8 week intervals)', '2〜4回（4〜8週間隔）', '2-4次（间隔4-8周）'),
    '3~5회 (4~6주 간격)': ('3-5 sessions (4-6 week intervals)', '3〜5回（4〜6週間隔）', '3-5次（间隔4-6周）'),
    '2~4회 (4~6개월 간격)': ('2-4 sessions (4-6 month intervals)', '2〜4回（4〜6ヶ月間隔）', '2-4次（间隔4-6个月）'),
    '3~5회 (2~4주 간격)': ('3-5 sessions (2-4 week intervals)', '3〜5回（2〜4週間隔）', '3-5次（间隔2-4周）'),
    '1회 (반영구적 효과)': ('1 session (semi-permanent effect)', '1回（半永久的効果）', '1次（半永久效果）'),
    '4~6회 권장 (1~2주 간격)': ('4-6 sessions recommended (1-2 week intervals)', '4〜6回推奨（1〜2週間隔）', '建议4-6次（间隔1-2周）'),
    '4~6회 (2~4주 간격)': ('4-6 sessions (2-4 week intervals)', '4〜6回（2〜4週間隔）', '4-6次（间隔2-4周）'),
    '3~5회 (4주 간격)': ('3-5 sessions (4-week intervals)', '3〜5回（4週間隔）', '3-5次（间隔4周）'),
    '3~5회 (3~4주 간격)': ('3-5 sessions (3-4 week intervals)', '3〜5回（3〜4週間隔）', '3-5次（间隔3-4周）'),
    '3~6회 (3~4주 간격)': ('3-6 sessions (3-4 week intervals)', '3〜6回（3〜4週間隔）', '3-6次（间隔3-4周）'),
    '6~10회 (1~2주 간격)': ('6-10 sessions (1-2 week intervals)', '6〜10回（1〜2週間隔）', '6-10次（间隔1-2周）'),
    '1~3회 (필요에 따라 추가 시술)': ('1-3 sessions (additional treatments as needed)', '1〜3回（必要に応じて追加施術）', '1-3次（根据需要追加治疗）'),
    '3~5회 (4~6주 간격)': ('3-5 sessions (4-6 week intervals)', '3〜5回（4〜6週間隔）', '3-5次（间隔4-6周）'),
    '1~3회 (3~6개월 간격)': ('1-3 sessions (3-6 month intervals)', '1〜3回（3〜6ヶ月間隔）', '1-3次（间隔3-6个月）'),
    '3~4회 (2~4주 간격)': ('3-4 sessions (2-4 week intervals)', '3〜4回（2〜4週間隔）', '3-4次（间隔2-4周）'),
    '1~2회 (3~6개월 간격)': ('1-2 sessions (3-6 month intervals)', '1〜2回（3〜6ヶ月間隔）', '1-2次（间隔3-6个月）'),
    '2~4회 (4~6주 간격)': ('2-4 sessions (4-6 week intervals)', '2〜4回（4〜6週間隔）', '2-4次（间隔4-6周）'),
    '3~6회 (2~4주 간격)': ('3-6 sessions (2-4 week intervals)', '3〜6回（2〜4週間隔）', '3-6次（间隔2-4周）'),
    '2~3회 (4~6주 간격)': ('2-3 sessions (4-6 week intervals)', '2〜3回（4〜6週間隔）', '2-3次（间隔4-6周）'),
    '2~4회 (4주 간격)': ('2-4 sessions (4-week intervals)', '2〜4回（4週間隔）', '2-4次（间隔4周）'),
    '3~4개월 간격': ('3-4 month intervals', '3〜4ヶ月間隔', '间隔3-4个月'),
    '6~12개월 유지': ('Maintained for 6-12 months', '6〜12ヶ月維持', '维持6-12个月'),
    '4~6회 (2주 간격)': ('4-6 sessions (2-week intervals)', '4〜6回（2週間隔）', '4-6次（间隔2周）'),
    '1~2회 (효과 영구 지속)': ('1-2 sessions (permanent effect)', '1〜2回（効果永久持続）', '1-2次（效果永久持续）'),
    '1~2회 (효과 반영구 지속)': ('1-2 sessions (semi-permanent effect)', '1〜2回（効果半永久持続）', '1-2次（效果半永久持续）'),
    '연 1~2회 (효과 6~12개월 지속)': ('1-2 times per year (effects last 6-12 months)', '年1〜2回（効果6〜12ヶ月持続）', '每年1-2次（效果持续6-12个月）'),
    '4~8회 (2~4주 간격)': ('4-8 sessions (2-4 week intervals)', '4〜8回（2〜4週間隔）', '4-8次（间隔2-4周）'),
    '주 2~3회 (총 20~30회 권장)': ('2-3 times per week (20-30 sessions total recommended)', '週2〜3回（合計20〜30回推奨）', '每周2-3次（建议共20-30次）'),
    '주 2~3회 (장기 치료, 총 30~50회)': ('2-3 times per week (long-term treatment, 30-50 sessions total)', '週2〜3回（長期治療、合計30〜50回）', '每周2-3次（长期治疗，共30-50次）'),
    '1~2회 (6~12개월 간격)': ('1-2 sessions (6-12 month intervals)', '1〜2回（6〜12ヶ月間隔）', '1-2次（间隔6-12个月）'),
}

with open('client/src/components/TreatmentsEquipmentSection.tsx', 'r') as f:
    lines = f.readlines()

# Step 1: sessions 없이 독립적으로 존재하는 sessionsEn/sessionsJa/sessionsZh 제거
new_lines = []
removed = 0
i = 0
while i < len(lines):
    line = lines[i]
    if re.match(r'\s+(sessionsEn|sessionsJa|sessionsZh): "', line):
        # 앞 10라인 내에 sessions: 가 있는지 확인
        has_sessions = False
        for j in range(max(0, i-10), i):
            if re.search(r'\bsessions: "', lines[j]):
                has_sessions = True
                break
        if not has_sessions:
            removed += 1
            i += 1
            continue
    new_lines.append(line)
    i += 1

print(f'고아 sessionsJa/sessionsZh 제거: {removed}개')

# Step 2: sessions 있지만 sessionsJa 없는 항목에 번역 추가
final_lines = []
patched = 0
i = 0
while i < len(new_lines):
    line = new_lines[i]
    m = re.search(r'\bsessions: "([^"]+)"', line)
    if m:
        ko_val = m.group(1)
        # 다음 5라인 내에 sessionsJa가 있는지 확인
        has_ja = False
        for j in range(i+1, min(i+5, len(new_lines))):
            if 'sessionsJa:' in new_lines[j]:
                has_ja = True
                break
            if re.match(r'\s+\},?\s*$', new_lines[j]):
                break
        
        if not has_ja and ko_val in sessions_translations:
            en, ja, zh = sessions_translations[ko_val]
            indent = len(line) - len(line.lstrip())
            indent_str = ' ' * indent
            final_lines.append(line)
            final_lines.append(f'{indent_str}sessionsEn: "{en}",\n')
            final_lines.append(f'{indent_str}sessionsJa: "{ja}",\n')
            final_lines.append(f'{indent_str}sessionsZh: "{zh}",\n')
            patched += 1
            i += 1
            continue
    
    final_lines.append(line)
    i += 1

print(f'sessionsJa 추가: {patched}개')

with open('client/src/components/TreatmentsEquipmentSection.tsx', 'w') as f:
    f.writelines(final_lines)

# 결과 확인
with open('client/src/components/TreatmentsEquipmentSection.tsx', 'r') as f:
    content = f.read()
sessions_list = len(re.findall(r'\bsessions: "', content))
sessions_ja = len(re.findall(r'\bsessionsJa: "', content))
print(f'sessions {sessions_list}개, sessionsJa {sessions_ja}개')
