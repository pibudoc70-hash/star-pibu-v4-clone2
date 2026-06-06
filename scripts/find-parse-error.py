#!/usr/bin/env python3
"""파싱 에러 원인 찾기"""
import re

with open('client/src/components/TreatmentsEquipmentSection.tsx', 'r') as f:
    src = f.read()

lines = src.split('\n')

# 1. 이중 백슬래시 이스케이프 찾기
print("=== 이중 백슬래시 이스케이프 ===")
for i, line in enumerate(lines):
    if '\\\\' in line and ('detailEn' in line or 'detailJa' in line or 'detailZh' in line or
                            'effectEn' in line or 'effectJa' in line or 'effectZh' in line or
                            'sessionsEn' in line or 'sessionsJa' in line or 'sessionsZh' in line):
        print(f"L{i+1}: {repr(line[:150])}")

# 2. 스크립트가 삽입한 번역 중 잘못된 이스케이프
print("\n=== 번역 라인 이스케이프 확인 ===")
pattern = re.compile(r'(detailEn|detailJa|detailZh|effectEn|effectJa|effectZh|sessionsEn|sessionsJa|sessionsZh): "(.*?)",', re.DOTALL)
for m in pattern.finditer(src):
    val = m.group(2)
    if '\\' in val:
        line_num = src[:m.start()].count('\n') + 1
        print(f"L{line_num} [{m.group(1)}]: {repr(val[:80])}")

# 3. 파일의 실제 파싱 에러 위치 - babel 파서 사용
print("\n=== 파일 구조 검증 ===")
# 간단한 방법: 문자열 따옴표 균형 확인
in_string = False
escape_next = False
for i, ch in enumerate(src):
    if escape_next:
        escape_next = False
        continue
    if ch == '\\':
        escape_next = True
        continue
    if ch == '"':
        in_string = not in_string

print(f"String balance OK: {not in_string}")

# 4. 특정 라인 주변 확인 (에러 위치 1346)
print("\n=== L1340-1360 ===")
for i in range(1339, min(1360, len(lines))):
    print(f"L{i+1}: {repr(lines[i][:120])}")
