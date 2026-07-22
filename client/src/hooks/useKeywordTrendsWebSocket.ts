import { useEffect, useRef, useCallback } from "react";

interface KeywordTrendUpdate {
  type: "new" | "update" | "delete";
  keyword: string;
  trendScore: number;
  searchVolume: number;
  category: string;
  timestamp: number;
}

interface WebSocketMessage {
  type: string;
  data?: unknown;
  clientId?: string;
  channel?: string;
  timestamp?: number;
}

export function useKeywordTrendsWebSocket(
  onUpdate?: (update: KeywordTrendUpdate) => void,
  onStatisticsUpdate?: (stats: {
    totalKeywords: number;
    avgTrendScore: number;
    topKeyword: string;
  }) => void,
  isAdmin?: boolean
) {
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectAttemptsRef = useRef(0);
  const maxReconnectAttempts = 5;
  const reconnectDelay = 3000;

  const connect = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      return;
    }

    try {
      const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
      const wsUrl = `${protocol}//${window.location.host}/ws/trends`;

      wsRef.current = new WebSocket(wsUrl);

      wsRef.current.onopen = () => {
        console.log("[WebSocket] Connected");
        reconnectAttemptsRef.current = 0;

        // 관리자인 경우 인증 및 구독
        if (isAdmin) {
          wsRef.current?.send(
            JSON.stringify({
              type: "auth",
              isAdmin: true,
              token: localStorage.getItem("auth_token"),
              userId: localStorage.getItem("user_id"),
            })
          );

          // 키워드 및 통계 채널 구독
          wsRef.current?.send(
            JSON.stringify({
              type: "subscribe",
              channel: "keywords",
            })
          );

          wsRef.current?.send(
            JSON.stringify({
              type: "subscribe",
              channel: "statistics",
            })
          );
        }
      };

      wsRef.current.onmessage = (event: MessageEvent) => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data);

          switch (message.type) {
            case "connected":
              console.log("[WebSocket] Connected with ID:", message.clientId);
              break;

            case "auth_success":
              console.log("[WebSocket] Admin authenticated");
              break;

            case "subscribed":
              console.log("[WebSocket] Subscribed to channel:", message.channel);
              break;

            case "keyword_update":
              if (onUpdate && message.data) {
                onUpdate(message.data as KeywordTrendUpdate);
              }
              break;

            case "statistics_update":
              if (onStatisticsUpdate && message.data) {
                onStatisticsUpdate(
                  message.data as {
                    totalKeywords: number;
                    avgTrendScore: number;
                    topKeyword: string;
                  }
                );
              }
              break;

            default:
              console.log("[WebSocket] Unknown message type:", message.type);
          }
        } catch (error) {
          console.error("[WebSocket] Failed to parse message:", error);
        }
      };

      wsRef.current.onerror = (error: Event) => {
        console.error("[WebSocket] Error:", error);
      };

      wsRef.current.onclose = () => {
        console.log("[WebSocket] Disconnected");
        wsRef.current = null;

        // 자동 재연결
        if (reconnectAttemptsRef.current < maxReconnectAttempts) {
          reconnectAttemptsRef.current++;
          console.log(
            `[WebSocket] Reconnecting... (attempt ${reconnectAttemptsRef.current}/${maxReconnectAttempts})`
          );
          reconnectTimeoutRef.current = setTimeout(connect, reconnectDelay);
        }
      };
    } catch (error) {
      console.error("[WebSocket] Connection error:", error);
    }
  }, [isAdmin, onUpdate, onStatisticsUpdate]);

  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
  }, []);

  const send = useCallback((message: WebSocketMessage) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(message));
    }
  }, []);

  useEffect(() => {
    connect();

    return () => {
      disconnect();
    };
  }, [connect, disconnect]);

  return {
    isConnected: wsRef.current?.readyState === WebSocket.OPEN,
    send,
    disconnect,
    reconnect: connect,
  };
}
