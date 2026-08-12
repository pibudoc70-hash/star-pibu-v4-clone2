import { encodeOAuthState, OAUTH_STATE_COOKIE } from "@shared/const";

export { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";

const OAUTH_STATE_MAX_AGE_SECONDS = 10 * 60;

function getCookieValue(name: string): string | undefined {
  if (typeof document === "undefined") return undefined;
  const prefix = `${name}=`;
  return document.cookie
    .split(";")
    .map(item => item.trim())
    .find(item => item.startsWith(prefix))
    ?.slice(prefix.length);
}

function createStateNonce(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID().replace(/-/g, "");
  }

  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, byte => byte.toString(16).padStart(2, "0")).join("");
}

function getOrCreateStateNonce(): string {
  const existing = getCookieValue(OAUTH_STATE_COOKIE);
  if (existing && /^[A-Za-z0-9_-]{16,128}$/.test(existing)) return existing;

  const nonce = createStateNonce();
  const secure = window.location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${OAUTH_STATE_COOKIE}=${nonce}; Path=/; Max-Age=${OAUTH_STATE_MAX_AGE_SECONDS}; SameSite=None${secure}`;
  return nonce;
}

// Generate login URL at runtime so redirect URI reflects the current origin.
export const getLoginUrl = () => {
  const oauthPortalUrl = import.meta.env.VITE_OAUTH_PORTAL_URL;
  const appId = import.meta.env.VITE_APP_ID;

  // 회원가입/로그인 없이 사용하는 사이트이므로, OAuth URL이 없으면 홈으로 리다이렉트
  if (!oauthPortalUrl) {
    return typeof window !== 'undefined' ? window.location.origin + '/' : '/';
  }

  const redirectUri = `${window.location.origin}/api/oauth/callback`;
  const state = encodeOAuthState({
    redirectUri,
    nonce: getOrCreateStateNonce(),
  });

  const url = new URL(`${oauthPortalUrl}/app-auth`);
  url.searchParams.set("appId", appId);
  url.searchParams.set("redirectUri", redirectUri);
  url.searchParams.set("state", state);
  url.searchParams.set("type", "signIn");

  return url.toString();
};
