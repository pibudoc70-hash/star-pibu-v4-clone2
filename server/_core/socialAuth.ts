import { createHash, createHmac, randomBytes, timingSafeEqual } from "crypto";
import type { Request, Response } from "express";
import { parse as parseCookieHeader } from "cookie";
import { ENV } from "./env";

export type SocialProvider = "naver" | "kakao";

type OAuthState = {
  provider: SocialProvider;
  state: string;
  codeVerifier: string;
  returnTo: string;
  expiresAt: number;
};

export type SocialProfile = {
  provider: SocialProvider;
  providerUserId: string;
  name: string | null;
  email: string | null;
};

const STATE_COOKIE = "social_oauth_state";
const STATE_TTL_MS = 10 * 60 * 1000;

function base64Url(value: Buffer) {
  return value.toString("base64url");
}

function sign(value: string) {
  return createHmac("sha256", ENV.cookieSecret).update(value).digest("base64url");
}

function safeEqual(left: string, right: string) {
  const a = Buffer.from(left);
  const b = Buffer.from(right);
  return a.length === b.length && timingSafeEqual(a, b);
}

function redirectUri(provider: SocialProvider) {
  return provider === "naver" ? ENV.naverRedirectUri : ENV.kakaoRedirectUri;
}

function credentialsConfigured(provider: SocialProvider) {
  return provider === "naver"
    ? Boolean(ENV.naverClientId && ENV.naverClientSecret && ENV.naverRedirectUri)
    : Boolean(ENV.kakaoRestApiKey && ENV.kakaoRedirectUri);
}

function parseReturnTo(value: unknown): string {
  if (typeof value !== "string" || !value.startsWith("/") || value.startsWith("//")) return "/reservation";
  return value;
}

export function startSocialLogin(req: Request, res: Response, provider: SocialProvider) {
  if (!credentialsConfigured(provider)) {
    return res.status(503).json({ error: "social_login_not_configured" });
  }

  const state = base64Url(randomBytes(32));
  const codeVerifier = base64Url(randomBytes(48));
  const codeChallenge = createHash("sha256").update(codeVerifier).digest("base64url");
  const payload: OAuthState = {
    provider,
    state,
    codeVerifier,
    returnTo: parseReturnTo(req.query.returnTo),
    expiresAt: Date.now() + STATE_TTL_MS,
  };
  const encoded = base64Url(Buffer.from(JSON.stringify(payload)));
  res.cookie(STATE_COOKIE, `${encoded}.${sign(encoded)}`, {
    httpOnly: true,
    sameSite: "lax",
    secure: req.secure || req.headers["x-forwarded-proto"] === "https",
    path: "/api/auth",
    maxAge: STATE_TTL_MS,
  });

  const url = new URL(provider === "naver"
    ? "https://nid.naver.com/oauth2.0/authorize"
    : "https://kauth.kakao.com/oauth/authorize");
  url.searchParams.set("response_type", "code");
  url.searchParams.set("client_id", provider === "naver" ? ENV.naverClientId : ENV.kakaoRestApiKey);
  url.searchParams.set("redirect_uri", redirectUri(provider));
  url.searchParams.set("state", state);
  // Both providers accept PKCE-compatible authorization parameters. Providers that
  // do not enforce PKCE safely ignore them while state validation remains mandatory.
  url.searchParams.set("code_challenge", codeChallenge);
  url.searchParams.set("code_challenge_method", "S256");
  if (provider === "naver") url.searchParams.set("auth_type", "reprompt");
  else url.searchParams.set("scope", "profile_nickname account_email");
  return res.redirect(302, url.toString());
}

export function consumeOAuthState(req: Request, res: Response, provider: SocialProvider, returnedState: string | undefined) {
  const raw = parseCookieHeader(req.headers.cookie ?? "")[STATE_COOKIE];
  res.clearCookie(STATE_COOKIE, { httpOnly: true, sameSite: "lax", path: "/api/auth" });
  if (!raw || !returnedState) return null;
  const [encoded, signature] = raw.split(".");
  if (!encoded || !signature || !safeEqual(signature, sign(encoded))) return null;
  try {
    const payload = JSON.parse(Buffer.from(encoded, "base64url").toString("utf8")) as OAuthState;
    if (payload.provider !== provider || payload.expiresAt < Date.now() || !safeEqual(payload.state, returnedState)) return null;
    return payload;
  } catch {
    return null;
  }
}

export async function getSocialProfile(provider: SocialProvider, code: string, codeVerifier: string, state: string): Promise<SocialProfile> {
  if (provider === "naver") {
    const tokenUrl = new URL("https://nid.naver.com/oauth2.0/token");
    tokenUrl.search = new URLSearchParams({
      grant_type: "authorization_code",
      client_id: ENV.naverClientId,
      client_secret: ENV.naverClientSecret,
      code,
      state,
      code_verifier: codeVerifier,
    }).toString();
    const tokenResponse = await fetch(tokenUrl);
    const token = await tokenResponse.json() as { access_token?: string; error?: string };
    if (!tokenResponse.ok || !token.access_token) throw new Error(`Naver token exchange failed: ${token.error ?? tokenResponse.status}`);
    const profileResponse = await fetch("https://openapi.naver.com/v1/nid/me", { headers: { Authorization: `Bearer ${token.access_token}` } });
    const profile = await profileResponse.json() as { response?: { id?: string; name?: string; nickname?: string; email?: string } };
    const data = profile.response;
    if (!profileResponse.ok || !data?.id) throw new Error("Naver profile response did not include an id");
    return { provider, providerUserId: data.id, name: data.name ?? data.nickname ?? null, email: data.email ?? null };
  }

  const body = new URLSearchParams({
    grant_type: "authorization_code",
    client_id: ENV.kakaoRestApiKey,
    redirect_uri: ENV.kakaoRedirectUri,
    code,
    code_verifier: codeVerifier,
  });
  if (ENV.kakaoClientSecret) body.set("client_secret", ENV.kakaoClientSecret);
  const tokenResponse = await fetch("https://kauth.kakao.com/oauth/token", { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded;charset=utf-8" }, body });
  const token = await tokenResponse.json() as { access_token?: string; error?: string };
  if (!tokenResponse.ok || !token.access_token) throw new Error(`Kakao token exchange failed: ${token.error ?? tokenResponse.status}`);
  const profileResponse = await fetch("https://kapi.kakao.com/v2/user/me", { headers: { Authorization: `Bearer ${token.access_token}` } });
  const profile = await profileResponse.json() as { id?: number | string; properties?: { nickname?: string }; kakao_account?: { email?: string; profile?: { nickname?: string } } };
  if (!profileResponse.ok || profile.id === undefined || profile.id === null) throw new Error("Kakao profile response did not include an id");
  return { provider, providerUserId: String(profile.id), name: profile.kakao_account?.profile?.nickname ?? profile.properties?.nickname ?? null, email: profile.kakao_account?.email ?? null };
}
