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

/** OAuth 로그인 시작 브라우저와 callback을 결속하는 host-only nonce cookie 이름 */
export const OAUTH_STATE_COOKIE = "__Host-oauth_state";

export type OAuthState = {
  redirectUri: string;
  nonce: string;
};

/**
 * state는 URL에서 전달되므로 항상 신뢰할 수 없는 입력으로 취급한다.
 * base64 JSON은 기밀성 목적이 아니라 redirect URI와 one-time nonce를 함께 전달하기 위한 형식이다.
 */
export function encodeOAuthState(state: OAuthState): string {
  return btoa(JSON.stringify(state));
}

/** malformed state는 예외 대신 빈 객체로 처리해 callback이 fail-closed 하도록 한다. */
export function decodeOAuthState(value: string | undefined | null): Partial<OAuthState> {
  if (!value || value.length > 4096) return {};

  try {
    const parsed: unknown = JSON.parse(atob(value));
    if (!parsed || typeof parsed !== "object") return {};

    const { redirectUri, nonce } = parsed as Record<string, unknown>;
    if (
      typeof redirectUri !== "string" ||
      redirectUri.length === 0 ||
      redirectUri.length > 2048 ||
      typeof nonce !== "string" ||
      !/^[A-Za-z0-9_-]{16,128}$/.test(nonce)
    ) {
      return {};
    }

    const url = new URL(redirectUri);
    if (url.protocol !== "https:" && url.hostname !== "localhost") return {};

    return { redirectUri, nonce };
  } catch {
    return {};
  }
}
