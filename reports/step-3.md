# Step 3 보고

## 1. 변경 범위

| 파일 | 변경 |
|---|---|
| `client/src/components/SpecialEventSection.tsx` | 세 개의 `aria-label`을 `스페셜 이벤트`로 보정하고, 스켈레톤·오류 분기에 기존 통증 관리 가이드 래퍼를 추가 |
| `client/src/components/SpecialEventSection.test.tsx` | 로딩 상태와 빈 오류 상태에서 수정된 레이블 및 통증 관리 가이드 존재를 검증 |

`md:grid-cols-12`, lead/selector 배치, `SectionHeader`, 스켈레톤 형상, VAT pill, 더보기, `PainManagementGuide` 소스, `mt-10` 값은 변경하지 않았습니다.

## 2. 상태별 결과

| 상태 | 이벤트 영역 | 통증 관리 가이드 |
|---|---|---|
| 로딩/스켈레톤 | 기존 스켈레톤 프레임 유지, `aria-busy="true"` 유지 | 동일한 `mt-10` 래퍼로 표시 |
| 빈 오류 | 기존 재시도 UI 유지 | 동일한 `mt-10` 래퍼로 표시 |
| 정상 | 기존 desktop/mobile 이벤트 UI 유지 | 기존 위치와 동일 |

## 3. 검증

| 게이트 | 결과 |
|---|---|
| 지정 SpecialEventSection·desktopLayout·events 테스트 | 통과 |
| `pnpm check` | 통과 |
| `pnpm lint` | 오류 0건, 기존 경고 105건 |
| 1280px 개발 브라우저 | 스켈레톤 프레임 아래 통증 관리 가이드 표시 확인 |
| 390px 스크린샷 | 캡처 도구 실패로 미획득. 동일 컴포넌트 분기 테스트 통과, 모바일 전용 마크업 무변경 |
| 동결 파일 | 변경 0건 |
| `dist/`, `server/_generated/` | 변경 0건 |

**Step 3 완료. 승인 대기.**
