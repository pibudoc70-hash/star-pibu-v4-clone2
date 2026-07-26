import { z } from "zod";

/**
 * 환경변수 스키마.
 * 부팅 시 1회 검증하여 누락·오타를 즉시 발견한다.
 * 검증 실패 시 프로세스를 종료하므로, 잘못된 설정으로 서버가 뜨는 것을 막는다.
 *
 * 필수 항목 선정 기준:
 * - DATABASE_URL: 모든 DB 의존 페이지(공지·이벤트·장비·관리자)의 전제
 * - BUILT_IN_FORGE_API_URL / KEY: 이미지 스토리지 프록시의 전제
 * 나머지는 optional 로 두어 회원 기능 폐지 이후에도 부팅이 가능하게 한다.
 */
const EnvSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  PORT: z.coerce.number().int().min(1).max(65535).default(3000),

  // 필수: DB
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),

  // 필수: 스토리지 (이미지 업로드·프록시)
  BUILT_IN_FORGE_API_URL: z.string().url("BUILT_IN_FORGE_API_URL must be a valid URL"),
  BUILT_IN_FORGE_API_KEY: z.string().min(1, "BUILT_IN_FORGE_API_KEY is required"),

  // 선택: 인증 (회원 기능 폐지 예정이므로 optional)
  JWT_SECRET: z.string().min(16).optional(),
  OAUTH_SERVER_URL: z.string().url().optional(),
  OWNER_OPEN_ID: z.string().optional(),
  OWNER_NAME: z.string().optional(),

  // [Step52-A] Cloudflare Turnstile 시크릿.
  // 프로덕션에서는 필수. 누락 시 봇 방어가 조용히 꺼지는 사고를 막는다.
  TURNSTILE_SECRET_KEY: z.string().min(1).optional(),

  // 선택: 캐시·풀 튜닝
  IMAGE_CACHE_MAX: z.coerce.number().int().positive().optional(),
  IMAGE_CACHE_MAX_MB: z.coerce.number().int().positive().optional(),
  DB_POOL_SIZE: z.coerce.number().int().positive().optional(),
  RL_IMAGE_PER_MIN: z.coerce.number().int().positive().optional(),
  RL_TRPC_PER_MIN: z.coerce.number().int().positive().optional(),
});

export type AppEnv = z.infer<typeof EnvSchema>;

/**
 * 환경변수를 검증하고 반환한다. 실패 시 상세 메시지를 출력하고 프로세스를 종료한다.
 * 서버 부팅 초반(DB 연결 전)에 1회만 호출한다.
 */
export function validateEnv(): AppEnv {
  const result = EnvSchema.safeParse(process.env);

  if (!result.success) {
    console.error("[FATAL] Environment variable validation failed:");
    for (const issue of result.error.issues) {
      console.error(`  - ${issue.path.join(".")}: ${issue.message}`);
    }
    console.error("[FATAL] Fix the .env file or deployment environment and restart.");
    process.exit(1);
  }

  const parsed = result.data;

  // [Step52-A] 프로덕션에서 TURNSTILE_SECRET_KEY 누락 시 즉시 종료 (fail-closed)
  if (parsed.NODE_ENV === "production" && !parsed.TURNSTILE_SECRET_KEY) {
    console.error(
      "[FATAL] TURNSTILE_SECRET_KEY is required in production. " +
      "Bot protection would be silently disabled.",
    );
    process.exit(1);
  }

  // [Step70-C] JWT_SECRET 누락 시 env.ts 가 "" 로 폴백해
  // 빈 키로 세션이 서명된다 → 관리자 세션 위조 가능.
  // 관리자 로그인이 살아 있는 한 프로덕션 필수다.
  if (parsed.NODE_ENV === "production" && !parsed.JWT_SECRET) {
    console.error(
      "[FATAL] JWT_SECRET is required in production. " +
      "Empty signing key allows admin session forgery.",
    );
    process.exit(1);
  }

  return parsed;
}
