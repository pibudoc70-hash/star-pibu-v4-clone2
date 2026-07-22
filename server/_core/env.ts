export const ENV = {
  appId: process.env.VITE_APP_ID ?? "",
  cookieSecret: process.env.JWT_SECRET ?? "",
  databaseUrl: process.env.DATABASE_URL ?? "",
  oAuthServerUrl: process.env.OAUTH_SERVER_URL ?? "",
  ownerOpenId: process.env.OWNER_OPEN_ID ?? "",
  appOrigin: process.env.APP_ORIGIN ?? "",
  naverClientId: process.env.NAVER_CLIENT_ID ?? "",
  naverClientSecret: process.env.NAVER_CLIENT_SECRET ?? "",
  naverRedirectUri: process.env.NAVER_REDIRECT_URI ?? "",
  kakaoRestApiKey: process.env.KAKAO_REST_API_KEY ?? "",
  kakaoClientSecret: process.env.KAKAO_CLIENT_SECRET ?? "",
  kakaoRedirectUri: process.env.KAKAO_REDIRECT_URI ?? "",
  isProduction: process.env.NODE_ENV === "production",
  forgeApiUrl: process.env.BUILT_IN_FORGE_API_URL ?? "",
  forgeApiKey: process.env.BUILT_IN_FORGE_API_KEY ?? "",
};

/** Reject insecure production boot configuration instead of signing JWTs with an empty key. */
export function assertProductionEnvironment() {
  if (!ENV.isProduction) return;
  const required = ["JWT_SECRET", "DATABASE_URL", "APP_ORIGIN"];
  const missing = required.filter((key) => !process.env[key]);
  if (missing.length) throw new Error(`Missing required production environment variables: ${missing.join(", ")}`);
  if (!ENV.naverClientId && !ENV.kakaoRestApiKey) {
    throw new Error("At least one social login provider (Naver or Kakao) must be configured in production");
  }
  if (ENV.naverClientId && (!ENV.naverClientSecret || !ENV.naverRedirectUri)) {
    throw new Error("NAVER_CLIENT_SECRET and NAVER_REDIRECT_URI are required when Naver login is enabled");
  }
  if (ENV.kakaoRestApiKey && !ENV.kakaoRedirectUri) {
    throw new Error("KAKAO_REDIRECT_URI is required when Kakao login is enabled");
  }
}
