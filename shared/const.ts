export const COOKIE_NAME = "app_session_id";

// 병원 연락처 상수 (서버사이드 사용 전용 — 프론트엔드는 client/src/lib/constants.ts 사용)
export const CLINIC_TEL = "051-818-2300";
export const CLINIC_TEL_INTL = "+82-51-818-2300";
export const CLINIC_TEL_HREF = "tel:051-818-2300";
export const CLINIC_TEL_INTL_HREF = "tel:+82-51-818-2300";
export const ONE_YEAR_MS = 1000 * 60 * 60 * 24 * 365;
export const AXIOS_TIMEOUT_MS = 30_000;
export const UNAUTHED_ERR_MSG = 'Please login (10001)';
export const NOT_ADMIN_ERR_MSG = 'You do not have required permission (10002)';
