"""
<button 태그에 type 속성이 없는 경우 type="button" 을 추가.
form submit 버튼(<button type="submit">)은 건드리지 않음.
대상: 홈페이지 노출 컴포넌트 + 전체 pages
"""
import re, os, glob

base = "/home/ubuntu/star-pibu-v4-clone"
files = glob.glob(f"{base}/client/src/**/*.tsx", recursive=True)

# <button 으로 시작하고 type= 이 없는 태그를 찾아 type="button" 추가
# 패턴: <button 다음에 type= 이 없는 경우
BUTTON_PATTERN = re.compile(r'<button(?!\s[^>]*type=)(\s)', re.DOTALL)

total_fixed = 0

for fpath in sorted(files):
    with open(fpath, "r") as f:
        content = f.read()
    
    new_content = BUTTON_PATTERN.sub(r'<button type="button"\1', content)
    
    if new_content != content:
        count = len(BUTTON_PATTERN.findall(content))
        total_fixed += count
        with open(fpath, "w") as f:
            f.write(new_content)
        rel = fpath.replace(base + "/", "")
        print(f"Fixed {count} button(s) in {rel}")

print(f"\nTotal button type insertions: {total_fixed}")
