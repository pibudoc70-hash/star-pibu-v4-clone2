#!/usr/bin/env python3
"""
중복 effectJa/effectZh/sessionsJa/sessionsZh 제거
각 Treatment/Equipment 객체 내에서 동일한 키가 두 번 이상 나오면 두 번째 이후를 제거
"""
import re

with open('client/src/components/TreatmentsEquipmentSection.tsx', 'r') as f:
    lines = f.readlines()

# 각 객체의 시작과 끝을 추적하면서 중복 키 제거
# 방법: 연속된 effectJa 라인을 찾아서 두 번째를 제거
new_lines = []
i = 0
removed = 0
target_keys = {'effectJa', 'effectZh', 'sessionsJa', 'sessionsZh', 'effectEn', 'sessionsEn'}

# 각 객체 내 키 추적을 위해 객체 경계를 감지
# 간단한 방법: 연속된 같은 키를 찾아서 두 번째 제거
# 더 정확한 방법: 각 객체 블록 내에서 키 중복 확인

# 객체 블록 파싱
# { ... } 블록 내에서 키 중복 확인
depth = 0
# depth별 키 세트 (depth 2 = Treatment 객체 내부)
keys_at_depth = {}

while i < len(lines):
    line = lines[i]
    stripped = line.strip()

    # 깊이 계산 (템플릿 리터럴 내부 { 제외)
    # 간단하게: 라인의 { } 개수로 계산
    open_count = stripped.count('{') - stripped.count('${')
    close_count = stripped.count('}')

    # 현재 라인에서 키 확인 (깊이 변경 전)
    key_match = re.match(r'\s+(effectJa|effectZh|sessionsJa|sessionsZh|effectEn|sessionsEn): "', line)
    if key_match:
        key = key_match.group(1)
        if depth not in keys_at_depth:
            keys_at_depth[depth] = set()
        if key in keys_at_depth[depth]:
            # 중복 - 제거
            removed += 1
            i += 1
            continue
        else:
            keys_at_depth[depth].add(key)

    new_lines.append(line)

    # 깊이 업데이트
    for _ in range(open_count):
        depth += 1
        if depth not in keys_at_depth:
            keys_at_depth[depth] = set()

    for _ in range(close_count):
        if depth in keys_at_depth:
            del keys_at_depth[depth]
        depth = max(0, depth - 1)

    i += 1

with open('client/src/components/TreatmentsEquipmentSection.tsx', 'w') as f:
    f.writelines(new_lines)

print(f'중복 제거: {removed}개')

# 결과 확인
with open('client/src/components/TreatmentsEquipmentSection.tsx', 'r') as f:
    content = f.read()
effects = re.findall(r'\beffect: "', content)
effects_ja = re.findall(r'\beffectJa: "', content)
sessions_list = re.findall(r'\bsessions: "', content)
sessions_ja = re.findall(r'\bsessionsJa: "', content)
print(f'effect 총 {len(effects)}개, effectJa 총 {len(effects_ja)}개')
print(f'sessions 총 {len(sessions_list)}개, sessionsJa 총 {len(sessions_ja)}개')
