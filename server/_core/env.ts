export const ENV = {
  appId: process.env.VITE_APP_ID ?? "",
  // [Step70-C] 프로덕션에서는 envSchema.validateEnv() 가
  // 부팅 시 JWT_SECRET 존재를 강제하므로 "" 폴백에 도달하지 않는다.
  cookieSecret: process.env.JWT_SECRET ?? "",
  databaseUrl: process.env.DATABASE_URL ?? "",
  oAuthServerUrl: process.env.OAUTH_SERVER_URL ?? "",
  ownerOpenId: process.env.OWNER_OPEN_ID ?? "",
  isProduction: process.env.NODE_ENV === "production",
  forgeApiUrl: process.env.BUILT_IN_FORGE_API_URL ?? "",
  forgeApiKey: process.env.BUILT_IN_FORGE_API_KEY ?? "",
};
