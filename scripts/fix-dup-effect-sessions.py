#!/usr/bin/env python3
"""
중복 effectJa/effectZh/sessionsJa/sessionsZh 제거
각 Treatment 객체 내에서 동일한 키가 두 번 이상 나오면 첫 번째만 유지
"""
import re

with open('client/src/components/TreatmentsEquipmentSection.tsx', 'r') as f:
    content = f.read()

# 각 객체 블록 내에서 중복 키 제거
# 접근: 라인 기반으로 처리
lines = content.split('\n')
new_lines = []
# 현재 객체 내에서 본 키들을 추적
# 객체 시작/끝을 { } 기준으로 추적
depth = 0
obj_keys_seen = {}  # depth -> set of keys

i = 0
removed = 0

while i < len(lines):
    line = lines[i]
    stripped = line.strip()

    # 중괄호 깊이 추적
    opens = stripped.count('{') - stripped.count('${') - stripped.count('`{')
    closes = stripped.count('}')

    # 새 객체 시작 (depth 증가 전에 키 세트 초기화)
    for _ in range(opens):
        depth += 1
        if depth not in obj_keys_seen:
            obj_keys_seen[depth] = set()

    # effectJa/effectZh/sessionsJa/sessionsZh 중복 체크
    dup_key_match = re.match(r'\s+(effectJa|effectZh|sessionsJa|sessionsZh): "', line)
    if dup_key_match:
        key = dup_key_match.group(1)
        if depth in obj_keys_seen and key in obj_keys_seen[depth]:
            # 중복 - 제거
            removed += 1
            for _ in range(closes):
                if depth in obj_keys_seen:
                    del obj_keys_seen[depth]
                depth = max(0, depth - 1)
            i += 1
            continue
        else:
            if depth not in obj_keys_seen:
                obj_keys_seen[depth] = set()
            obj_keys_seen[depth].add(key)

    new_lines.append(line)

    # 객체 끝 (depth 감소)
    for _ in range(closes):
        if depth in obj_keys_seen:
            del obj_keys_seen[depth]
        depth = max(0, depth - 1)

    i += 1

new_content = '\n'.join(new_lines)
with open('client/src/components/TreatmentsEquipmentSection.tsx', 'w') as f:
    f.write(new_content)

print(f'중복 제거: {removed}개')

# 결과 확인
with open('client/src/components/TreatmentsEquipmentSection.tsx', 'r') as f:
    content = f.read()
effects = re.findall(r'effect: "([^"]+)"', content)
effects_ja = re.findall(r'effectJa: "([^"]+)"', content)
sessions_list = re.findall(r'sessions: "([^"]+)"', content)
sessions_ja = re.findall(r'sessionsJa: "([^"]+)"', content)
print(f'effect 총 {len(effects)}개, effectJa 총 {len(effects_ja)}개')
print(f'sessions 총 {len(sessions_list)}개, sessionsJa 총 {len(sessions_ja)}개')
