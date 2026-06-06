#!/usr/bin/env python3
"""
각 Treatment/Equipment 객체 내에서 effectEn/effectJa/effectZh/sessionsEn/sessionsJa/sessionsZh/detailEn/detailJa/detailZh 중복 제거
- 각 객체 블록 내에서 같은 키가 여러 번 나오면 첫 번째만 유지
"""
import re

with open('client/src/components/TreatmentsEquipmentSection.tsx', 'r') as f:
    content = f.read()

lines = content.split('\n')

# 객체 경계를 추적하면서 중복 키 제거
# 간단한 방법: 연속된 객체 내에서 같은 키가 두 번 나오면 두 번째를 제거

KEYS_TO_DEDUP = ['effectEn', 'effectJa', 'effectZh', 'sessionsEn', 'sessionsJa', 'sessionsZh', 'detailEn', 'detailJa', 'detailZh']

# 객체 깊이 추적
depth = 0
# 현재 객체 내에서 본 키들
seen_keys = {}  # depth -> set of keys
new_lines = []
removed = 0

for i, line in enumerate(lines):
    stripped = line.strip()
    
    # 깊이 계산 (간단한 방법)
    opens = stripped.count('{') - stripped.count('${')
    closes = stripped.count('}')
    
    # 현재 깊이에서 키 체크
    key_match = None
    for key in KEYS_TO_DEDUP:
        if re.match(rf'\s+{key}: "', line):
            key_match = key
            break
    
    if key_match:
        current_depth = depth
        if current_depth not in seen_keys:
            seen_keys[current_depth] = set()
        
        if key_match in seen_keys[current_depth]:
            # 중복 - 제거
            removed += 1
            # 깊이 업데이트
            depth += opens - closes
            continue
        else:
            seen_keys[current_depth].add(key_match)
    
    # 깊이 업데이트
    depth += opens - closes
    
    # 깊이가 줄어들면 해당 깊이의 seen_keys 초기화
    if closes > 0:
        for d in list(seen_keys.keys()):
            if d >= depth:
                del seen_keys[d]
    
    new_lines.append(line)

print(f'제거된 중복: {removed}개')

result = '\n'.join(new_lines)
with open('client/src/components/TreatmentsEquipmentSection.tsx', 'w') as f:
    f.write(result)

# 결과 확인
with open('client/src/components/TreatmentsEquipmentSection.tsx', 'r') as f:
    content2 = f.read()
effects = len(re.findall(r'\beffect: "', content2))
effects_ja = len(re.findall(r'\beffectJa: "', content2))
sessions_list = len(re.findall(r'\bsessions: "', content2))
sessions_ja = len(re.findall(r'\bsessionsJa: "', content2))
detail_list = len(re.findall(r'\bdetail: "', content2))
detail_ja = len(re.findall(r'\bdetailJa: "', content2))
print(f'effect {effects}개, effectJa {effects_ja}개')
print(f'sessions {sessions_list}개, sessionsJa {sessions_ja}개')
print(f'detail {detail_list}개, detailJa {detail_ja}개')
