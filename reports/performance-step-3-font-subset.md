# STEP 3 — Pretendard 서브셋 조사 및 적용 기록

## 조사 결론

첨부 제안의 과거 415 상태는 현재 운영 응답에서 재현되지 않았다. `https://star-pibu.com/api/storage/PretendardVariable_1ede78f7.woff2`는 `200`, `Content-Type: font/woff2`, `Content-Length: 2,057,688`으로 응답했다. 이는 앞선 MIME 정규화 개선이 적용된 결과다. 다만 전체 가변 폰트는 여전히 2.06MB이므로, 폴백을 보존하는 서브셋 전환은 독립적으로 유효한 개선 후보로 판단했다.

| 대상 | 크기 | 비고 |
|---|---:|---|
| 기존 Pretendard Variable | 2,057,688B | 단일 전체 WOFF2 |
| Latin·공통 기호 서브셋 | 91,572B | ASCII, UI 기호, 공통 구두점 |
| Korean 서브셋 | 548,764B | 공개 웹폰트 글리프 목록 및 현재 UI 범위 |
| 두 서브셋 합계 | 640,336B | 전체 대비 약 68.9% 감소 |

Korean 서브셋은 공개된 웹폰트용 한글 글리프 목록과 현재 클라이언트·공유 소스의 화면 문자 범위를 결합해 생성했다. CJK 희소 문자 및 서브셋 밖 글리프는 기존 `Noto Sans KR` 폴백으로 전달된다. Japanese/Chinese locale는 이미 Noto Sans JP/SC 우선 정책을 사용하므로 Pretendard 서브셋을 강제하지 않는다.

## 외부 출처

1. FontTools 프로젝트: <https://github.com/fonttools/fonttools> — `pyftsubset`으로 WOFF2 서브셋 생성. 2026-09-05 기준 5,231 stars, MIT license.
2. Korean webfont subset glyph 목록: <https://github.com/TetraTheta/webfont-subset-glyph> — `glyphs.txt`를 Korean 문자 기준으로 사용.
3. Sandoll의 한글 웹폰트 표준 설명: <https://en.sandoll.co.kr/Story/?bmode=view&idx=169263037> — 상용 한글 2,350자와 Latin·기호 범위에 대한 배경.

## 적용 안전장치

두 `@font-face`는 동일한 `Pretendard Web` family와 동일한 가변 weight 범위를 사용하되, 서로 겹치지 않는 `unicode-range`를 가진다. `font-display: swap`을 유지하고, 모든 기존 선언에서 기존 전체 폰트 URL을 새 family로 교체한다. 기존 Noto Sans KR 폴백 순서와 locale별 JP/SC 정책은 바꾸지 않는다.

## 구현 및 검증 결과

업로드한 영구 스토리지 URL은 Latin·공통 기호용 `/manus-storage/PretendardVariable-latin-subset_b24be58a.woff2`와 Korean용 `/manus-storage/PretendardVariable-korean-segment_87dfcb73.woff2`다. 개발 서버의 리다이렉트 뒤 응답에서 두 파일 모두 `200`, `Content-Type: font/woff2`, 1년 immutable cache를 확인했다. 전체 파일은 CSS에서 더 이상 참조되지 않는다.

소스 정책 테스트는 두 파일 URL, 상호 비중첩 `unicode-range`, `font-display: swap`, Noto Sans KR 폴백 및 기존 2.06MB URL 제거를 고정한다. 전체 2,009개 테스트, TypeScript 검사, 크기 예산, lint(오류 0건·기존 경고 106건), production build를 통과했다.

실제 브라우저 기반 글리프 프로브는 이 환경의 CDP 페이지 탐색 종료와 브라우저 서비스 crash-loop 제한으로 완료하지 못했다. 따라서 배포 전 시각 검증은 소스 문자집합·서브셋 도구·정적 응답 검증으로 한정하며, 배포 후 일반 브라우저에서 Korean/English 페이지를 우선 확인해야 한다. 이는 레이아웃이나 의료 콘텐츠를 임의로 바꾸지 않는 안전 우선 결론이다.
