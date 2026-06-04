"""
target="_blank" 가 있는 JSX 엘리먼트에서 rel="noopener noreferrer" 가 없는 케이스를 찾아 수정.
JSX 속성은 멀티라인으로 작성되므로 태그 전체를 파싱해서 판단.
"""
import re, os, glob

base = "/home/ubuntu/star-pibu-v4-clone"
files = glob.glob(f"{base}/client/src/**/*.tsx", recursive=True)

# <a ... target="_blank" ... > 블록 전체를 찾는 패턴 (멀티라인)
# 여는 태그 전체: < 로 시작해서 > 또는 /> 로 끝나는 블록
TAG_PATTERN = re.compile(r'<(?:a|button|Link)\b([^>]*?)(?:/>|>)', re.DOTALL)

total_fixed = 0
results = []

for fpath in sorted(files):
    with open(fpath, "r") as f:
        content = f.read()
    
    new_content = content
    
    for m in TAG_PATTERN.finditer(content):
        attrs = m.group(1)
        if 'target="_blank"' in attrs and 'rel=' not in attrs:
            # rel 누락 확인
            old_tag = m.group(0)
            # target="_blank" 뒤에 rel 추가
            new_tag = old_tag.replace('target="_blank"', 'target="_blank"\n              rel="noopener noreferrer"')
            new_content = new_content.replace(old_tag, new_tag, 1)
            total_fixed += 1
            rel_path = fpath.replace(base + "/", "")
            results.append(f"  Fixed in {rel_path}: {old_tag[:60].strip()}...")
    
    if new_content != content:
        with open(fpath, "w") as f:
            f.write(new_content)

print(f"Total rel insertions: {total_fixed}")
for r in results:
    print(r)
