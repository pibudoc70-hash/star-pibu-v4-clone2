import { TRPCError } from "@trpc/server";
import { ENV } from "./env";

export type NotificationPayload = {
  title: string;
  content: string;
};

const TITLE_MAX_LENGTH = 1200;
const CONTENT_MAX_LENGTH = 20000;

const trimValue = (value: string): string => value.trim();
const isNonEmptyString = (value: unknown): value is string =>
  typeof value === "string" && value.trim().length > 0;

const buildEndpointUrl = (baseUrl: string): string => {
  const normalizedBase = baseUrl.endsWith("/")
    ? baseUrl
    : `${baseUrl}/`;
  return new URL(
    "webdevtoken.v1.WebDevService/SendNotification",
    normalizedBase
  ).toString();
};

const validatePayload = (input: NotificationPayload): NotificationPayload => {
  if (!isNonEmptyString(input.title)) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Notification title is required.",
    });
  }
  if (!isNonEmptyString(input.content)) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Notification content is required.",
    });
  }

  const title = trimValue(input.title);
  const content = trimValue(input.content);

  if (title.length > TITLE_MAX_LENGTH) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: `Notification title must be at most ${TITLE_MAX_LENGTH} characters.`,
    });
  }

  if (content.length > CONTENT_MAX_LENGTH) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: `Notification content must be at most ${CONTENT_MAX_LENGTH} characters.`,
    });
  }

  return { title, content };
};

// [Step54-B] 일시적 실패에 대한 지수 백오프 재시도.
// 상담 알림 유실은 곧 매출 유실이므로 3회까지 시도한다.
// 4xx(설정/입력 오류)는 재시도해도 무의미하므로 즉시 중단한다.
const NOTIFY_MAX_ATTEMPTS = 3;
const NOTIFY_BACKOFF_MS = [0, 1_000, 3_000];

/**
 * 단일 시도로 알림을 전송한다. 내부 전용.
 * 반환: { ok: true, status } 성공 / { ok: false, status } 실패
 * 네트워크·타임아웃 예외 시: { ok: false, status: 0 }
 */
async function sendOwnerNotificationOnce(
  payload: { title: string; content: string },
  endpoint: string,
): Promise<{ ok: boolean; status: number }> {
  const { title, content } = payload;
  try {
    // [Step54-B] fetch 에 타임아웃과 리다이렉트 방어 추가
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        accept: "application/json",
        authorization: `Bearer ${ENV.forgeApiKey}`,
        "content-type": "application/json",
        "connect-protocol-version": "1",
      },
      body: JSON.stringify({ title, content }),
      redirect: "error",
      signal: AbortSignal.timeout(8000),
    });

    if (!response.ok) {
      const detail = await response.text().catch(() => "");
      console.warn(
        `[Notification] Failed to notify owner (${response.status} ${response.statusText})${
          detail ? `: ${detail}` : ""
        }`
      );
      return { ok: false, status: response.status };
    }

    return { ok: true, status: response.status };
  } catch (error) {
    console.warn("[Notification] Error calling notification service:", error);
    return { ok: false, status: 0 };
  }
}

/**
 * Dispatches a project-owner notification through the Manus Notification Service.
 * Returns `true` if the request was accepted, `false` when the upstream service
 * cannot be reached (callers can fall back to email/slack). Validation errors
 * bubble up as TRPC errors so callers can fix the payload.
 *
 * [Step54-B] 일시적 실패에 대해 최대 3회 지수 백오프 재시도.
 */
export async function notifyOwner(
  payload: NotificationPayload
): Promise<boolean> {
  // validatePayload 는 루프 밖에서 1회만 호출 (TRPCError 는 재시도 대상이 아님)
  const { title, content } = validatePayload(payload);

  // ENV 확인도 루프 앞에서 (TRPCError 는 재시도 대상이 아님)
  if (!ENV.forgeApiUrl) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Notification service URL is not configured.",
    });
  }

  if (!ENV.forgeApiKey) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Notification service API key is not configured.",
    });
  }

  const endpoint = buildEndpointUrl(ENV.forgeApiUrl);
  let lastStatus = 0;

  for (let attempt = 0; attempt < NOTIFY_MAX_ATTEMPTS; attempt++) {
    if (attempt > 0) {
      await new Promise((r) => setTimeout(r, NOTIFY_BACKOFF_MS[attempt]));
    }

    const result = await sendOwnerNotificationOnce({ title, content }, endpoint);
    if (result.ok) {
      if (attempt > 0) {
        console.warn(`[Notification] Succeeded on attempt ${attempt + 1}`);
      }
      return true;
    }

    lastStatus = result.status;

    // 4xx 는 재시도 무의미 (인증 실패·payload 오류)
    if (result.status >= 400 && result.status < 500) break;
  }

  // [Step54-B] 최종 실패는 error 레벨로 남긴다.
  // 상담 데이터는 DB 에 있으므로 관리자 화면에서 복구 가능하다.
  console.error(
    `[Notification][CRITICAL] Owner notification failed after retries ` +
    `(lastStatus=${lastStatus}). Consultation is saved in DB — check /admin.`
  );
  return false;
}
