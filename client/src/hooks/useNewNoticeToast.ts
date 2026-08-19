/**
 * useNewNoticeToast
 *
 * 새 공지사항/이벤트가 등록되면 홈페이지에서 sonner 토스트로 알림을 표시합니다.
 *
 * 동작 방식:
 * - notices.list API에서 최신 공지사항 목록을 가져옵니다.
 * - localStorage("star_last_seen_notice_id")에 마지막으로 본 공지 ID를 저장합니다.
 * - 새 공지가 있으면 토스트를 표시하고 클릭 시 /notice 페이지로 이동합니다.
 * - 토스트는 세션당 1회만 표시합니다 (sessionStorage 활용).
 */
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import { useLang } from "@/contexts/LangContext";

const STORAGE_KEY = "star_last_seen_notice_id";
const SESSION_KEY = "star_notice_toast_shown";

export function useNewNoticeToast(navigate: (path: string) => void) {
  const { lang } = useLang();
  const shownRef = useRef(false);
  const [isIdle, setIsIdle] = useState(false);

  useEffect(() => {
    if (typeof window.requestIdleCallback === "function") {
      const idleId = window.requestIdleCallback(() => setIsIdle(true), { timeout: 2000 });
      return () => {
        if (typeof window.cancelIdleCallback === "function") {
          window.cancelIdleCallback(idleId);
        }
      };
    }

    const timeoutId = window.setTimeout(() => setIsIdle(true), 1200);
    return () => window.clearTimeout(timeoutId);
  }, []);

  const { data: notices } = trpc.notices.list.useQuery(
    { lang },
    {
      enabled: isIdle,
      staleTime: 5 * 60 * 1000, // 5분 캐시
      refetchOnWindowFocus: false,
    }
  );

  useEffect(() => {
    if (!isIdle) return;
    if (!notices || notices.length === 0) return;
    if (shownRef.current) return;

    // 세션당 1회만 표시
    if (sessionStorage.getItem(SESSION_KEY)) return;

    const latestNotice = notices[0];
    const lastSeenId = localStorage.getItem(STORAGE_KEY);

    // 처음 방문이거나 새 공지가 있을 때
    if (!lastSeenId || lastSeenId !== String(latestNotice.id)) {
      shownRef.current = true;
      sessionStorage.setItem(SESSION_KEY, "1");

      const label = lang === "ja"
        ? "新しいお知らせがあります"
        : lang === "zh"
        ? "有新公告"
        : lang === "en"
        ? "New notice available"
        : "새 공지사항이 있습니다";

      const actionLabel = lang === "ja"
        ? "確認する"
        : lang === "zh"
        ? "查看"
        : lang === "en"
        ? "View"
        : "확인하기";

      const langPrefix = lang !== "ko" ? `/${lang}` : "";

      toast(label, {
        description: latestNotice.title,
        duration: 6000,
        action: {
          label: actionLabel,
          onClick: () => {
            localStorage.setItem(STORAGE_KEY, String(latestNotice.id));
            navigate(`${langPrefix}/notice`);
          },
        },
        onDismiss: () => {
          localStorage.setItem(STORAGE_KEY, String(latestNotice.id));
        },
        onAutoClose: () => {
          localStorage.setItem(STORAGE_KEY, String(latestNotice.id));
        },
      });
    }
  }, [notices, lang, navigate, isIdle]);
}
