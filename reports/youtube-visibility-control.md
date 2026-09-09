# YouTube 영상·쇼츠 노출 상태 제어

## 구현 범위

기존 `youtubeVideos.isActive` enum을 그대로 사용했습니다. 기본값 `1`은 공개 노출이고 `0`은 숨김입니다. 이미 운영 테이블과 관리자 `update` mutation에 이 필드가 있어 migration이나 데이터 변경은 하지 않았습니다.

| 영역 | 동작 |
|---|---|
| 관리자 `/admin/youtube` | 썸네일 앞에 `노출`/`숨김` Eye 버튼 표시. 클릭하면 기존 admin update mutation으로 `isActive`만 반전 |
| 숨김 상태 | 행은 관리자 목록에 계속 남아 다시 노출 가능 |
| 공개 YouTube·Shorts | 서버 공개 query가 `isActive = '1'`만 반환하며, 클라이언트도 `isActive = '0'`을 한 번 더 제외 |
| 유지 사항 | 영상 ID, 순서, 편집·삭제, 썸네일·YouTube embed, 권한 경계 유지 |

## 접근성 및 검증

상태 버튼은 현재 값에 맞는 Eye/EyeOff 아이콘, visible Korean label, `aria-pressed`, 구체적인 접근성 이름과 keyboard focus ring을 제공합니다. 관리자 전용 router는 기존 `adminProcedure`로 보호됩니다.

focused 테스트 22건은 관리자 버튼 계약, 상태 반전, 숨김 레코드의 관리자 재조회, 공개 화면의 숨김 카드 차단을 확인했습니다. 전체 2,036개 테스트, TypeScript, lint 오류 0건, production build를 통과했습니다. 관리자 인증이 필요한 화면은 자동 캡처가 허용되지 않아, 배포 뒤 관리자 계정에서 한 번의 `숨김 → 노출` 왕복 확인이 남아 있습니다.
