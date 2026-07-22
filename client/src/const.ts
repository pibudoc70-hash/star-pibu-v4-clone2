export { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";

// Patient accounts are created only through Naver/Kakao OAuth on first sign-in.
// This route lets patients choose a provider instead of exposing a password signup flow.
export const getLoginUrl = (returnTo = "/my-reservations") =>
  `/login?returnTo=${encodeURIComponent(returnTo)}`;

export const getSocialLoginUrl = (provider: "naver" | "kakao", returnTo = "/my-reservations") =>
  `/api/auth/${provider}/start?returnTo=${encodeURIComponent(returnTo)}`;
