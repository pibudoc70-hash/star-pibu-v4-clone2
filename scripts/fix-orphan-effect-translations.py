#!/usr/bin/env python3
"""
effect: "..." 필드 없이 독립적으로 존재하는 effectEn/effectJa/effectZh 제거
각 Treatment 객체 내에서 effect: 가 없는 상태에서 effectEn/effectJa/effectZh가 있으면 제거
"""
import re

with open('client/src/components/TreatmentsEquipmentSection.tsx', 'r') as f:
    lines = f.readlines()

new_lines = []
i = 0
removed = 0

# 각 객체 블록 내에서 effect: 가 있는지 추적
# 간단한 방법: 연속된 블록 내에서 effect: 없이 effectEn/effectJa/effectZh만 있으면 제거

# 더 정확한 방법: 전체 파일을 파싱하여 각 객체 내 effect 존재 여부 확인
# 여기서는 라인 기반으로 처리

# 각 객체의 시작/끝을 }, 패턴으로 감지
# 객체 내에서 effect: 가 있는지 확인하고, 없으면 effectEn/effectJa/effectZh 제거

# 전체 파일을 객체 단위로 분리
content = ''.join(lines)

# Treatment/Equipment 객체 블록 찾기
# { ... } 블록 파싱
def parse_objects(content):
    """각 객체 블록의 시작/끝 라인 번호 반환"""
    lines = content.split('\n')
    objects = []
    depth = 0
    obj_start = None
    obj_depth = None
    
    for i, line in enumerate(lines):
        stripped = line.strip()
        opens = stripped.count('{') - stripped.count('${') - stripped.count('`{')
        closes = stripped.count('}')
        
        for _ in range(opens):
            depth += 1
            if depth == 3 and obj_start is None:  # Treatment 객체 깊이
                obj_start = i
                obj_depth = depth
        
        for _ in range(closes):
            if depth == 3 and obj_start is not None:
                objects.append((obj_start, i))
                obj_start = None
                obj_depth = None
            depth = max(0, depth - 1)
    
    return objects

lines_list = content.split('\n')

# 각 라인에서 effect: 없이 effectEn/effectJa/effectZh가 있는 경우를 찾아 제거
# 방법: 각 effectEn/effectJa/effectZh 라인에 대해 같은 객체 내에 effect: 가 있는지 확인

# 간단한 방법: 라인 스캔으로 처리
# effectEn/effectJa/effectZh 라인을 만나면 앞뒤 50라인 내에 effect: 가 있는지 확인

new_lines = list(lines_list)
lines_to_remove = set()

for i, line in enumerate(new_lines):
    if re.match(r'\s+(effectEn|effectJa|effectZh): "', line):
        # 앞 30라인 내에 effect: 가 있는지 확인 (같은 객체 내)
        has_effect = False
        for j in range(max(0, i-30), i+30):
            if j == i:
                continue
            if j < len(new_lines) and re.search(r'\beffect: "', new_lines[j]):
                # 같은 객체 내인지 확인 (}, 가 사이에 없어야 함)
                between_lines = new_lines[min(i,j):max(i,j)]
                obj_boundary = any(re.match(r'\s+\},?\s*$', l) or re.match(r'\s+\{', l) for l in between_lines[1:-1])
                if not obj_boundary:
                    has_effect = True
                    break
        
        if not has_effect:
            lines_to_remove.add(i)

print(f'제거할 라인: {len(lines_to_remove)}개')
for idx in sorted(lines_to_remove)[:10]:
    print(f'  L{idx+1}: {repr(new_lines[idx][:80])}')

result = [line for i, line in enumerate(new_lines) if i not in lines_to_remove]

with open('client/src/components/TreatmentsEquipmentSection.tsx', 'w') as f:
    f.write('\n'.join(result))

# 결과 확인
with open('client/src/components/TreatmentsEquipmentSection.tsx', 'r') as f:
    content2 = f.read()
effects = re.findall(r'\beffect: "', content2)
effects_ja = re.findall(r'\beffectJa: "', content2)
sessions_list = re.findall(r'\bsessions: "', content2)
sessions_ja = re.findall(r'\bsessionsJa: "', content2)
print(f'effect 총 {len(effects)}개, effectJa 총 {len(effects_ja)}개')
print(f'sessions 총 {len(sessions_list)}개, sessionsJa 총 {len(sessions_ja)}개')
