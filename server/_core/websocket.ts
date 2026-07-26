import { Server as HTTPServer } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { logger } from "./logger";
import { sdk } from "./sdk";
import { getUserByOpenId } from "../db/users";

// [Step53-B] 리소스 한계
const MAX_CLIENTS = 100;
const MAX_MESSAGE_BYTES = 4 * 1024;
const HEARTBEAT_MS = 30_000;

// [Step54-C] 연결당 auth 시도 상한
const MAX_AUTH_ATTEMPTS = 5;

// [Step54-D] 프로덕션 신뢰 경계는 실서비스 도메인으로만 한정한다.
// 개발 환경은 verifyClient 의 isDev 분기에서 이미 전체 허용되므로
// 프리뷰 도메인을 여기에 넣을 필요가 없다.
// 스테이징에서 임시 허용이 필요하면 ENV WS_EXTRA_ORIGIN 으로 주입한다.
const ALLOWED_WS_ORIGINS = new Set(
  [
    "https://star-pibu.com",
    "https://www.star-pibu.com",
    process.env.WS_EXTRA_ORIGIN,
  ].filter((v): v is string => typeof v === "string" && v.length > 0),
);

interface KeywordTrendUpdate {
  type: "new" | "update" | "delete";
  keyword: string;
  trendScore: number;
  searchVolume: number;
  category: string;
  timestamp: number;
}

interface ClientConnection {
  ws: WebSocket;
  userId?: string;
  isAdmin: boolean;
  isAlive: boolean; // [Step53-B] heartbeat 추적
  authAttempts: number; // [Step54-C] auth 시도 횟수
  subscriptions: Set<string>;
}

class KeywordTrendWebSocketServer {
  private wss: WebSocketServer;
  private clients: Map<string, ClientConnection> = new Map();
  private clientCounter = 0;
  private heartbeatTimer?: ReturnType<typeof setInterval>;

  constructor(httpServer: HTTPServer) {
    this.wss = new WebSocketServer({
      server: httpServer,
      path: "/ws/trends",
      maxPayload: MAX_MESSAGE_BYTES,
      // [Step53-B] CSWSH 방지: 허용된 Origin 만 연결 허용
      verifyClient: (info, done) => {
        const origin = info.origin;
        const isDev = process.env.NODE_ENV !== "production";
        if (isDev || (origin && ALLOWED_WS_ORIGINS.has(origin))) {
          done(true);
        } else {
          done(false, 403, "Forbidden origin");
        }
      },
    });
    this.setupConnectionHandler();
    this.startHeartbeat();
  }

  private setupConnectionHandler() {
    this.wss.on("connection", (ws: WebSocket) => {
      // [Step53-B] 연결 수 제한
      if (this.clients.size >= MAX_CLIENTS) {
        ws.close(1013, "Server busy");
        return;
      }

      const clientId = `client_${++this.clientCounter}`;
      const connection: ClientConnection = {
        ws,
        isAdmin: false,
        isAlive: true,
        authAttempts: 0, // [Step54-C]
        subscriptions: new Set(),
      };

      this.clients.set(clientId, connection);
      logger.info("WebSocket", `Client connected: ${clientId}`);

      // [Step53-B] pong 수신 시 isAlive 갱신
      ws.on("pong", () => {
        connection.isAlive = true;
      });

      ws.on("message", (data: Buffer) => {
        void this.handleMessage(clientId, data);
      });

      ws.on("close", () => {
        this.clients.delete(clientId);
        logger.info("WebSocket", `Client disconnected: ${clientId}`);
      });

      ws.on("error", (error: Error) => {
        logger.error("WebSocket", `Client error: ${error.message}`);
      });

      ws.send(
        JSON.stringify({
          type: "connected",
          clientId,
          timestamp: Date.now(),
        })
      );
    });
  }

  // [Step53-B] handleMessage 를 async 로 변경 (토큰 검증 await 필요)
  private async handleMessage(clientId: string, data: Buffer) {
    try {
      const message = JSON.parse(data.toString());
      const connection = this.clients.get(clientId);

      if (!connection) return;

      switch (message.type) {
        case "auth": {
          // [Step54-C] JWT 서명 검증(verifySession) + 조회 전용 getUserByOpenId 로 대체.
          // DB 쓰기(이전 구현의 upsertUser) 및 fakeReq 이중 단언 제거.
          const token = typeof message.token === "string" ? message.token : "";
          if (!token || token.length > 4096) {
            connection.ws.send(JSON.stringify({ type: "auth_failed" }));
            break;
          }

          // [Step54-C] auth 시도 횟수 제한 — 인증 서버·DB 남용 방지
          connection.authAttempts += 1;
          if (connection.authAttempts > MAX_AUTH_ATTEMPTS) {
            connection.ws.close(1008, "Too many auth attempts");
            this.clients.delete(clientId);
            break;
          }

          try {
            const session = await sdk.verifySession(token);
            if (!session) {
              connection.ws.send(JSON.stringify({ type: "auth_failed" }));
              break;
            }
            const user = await getUserByOpenId(session.openId);
            if (user && user.role === "admin") {
              connection.isAdmin = true;
              connection.userId = String(user.id);
              connection.ws.send(JSON.stringify({ type: "auth_success" }));
            } else {
              connection.ws.send(JSON.stringify({ type: "auth_failed" }));
            }
          } catch {
            connection.ws.send(JSON.stringify({ type: "auth_failed" }));
          }
          break;
        }

        case "subscribe":
          if (message.channel) {
            connection.subscriptions.add(message.channel);
            connection.ws.send(
              JSON.stringify({
                type: "subscribed",
                channel: message.channel,
              })
            );
          }
          break;

        case "unsubscribe":
          if (message.channel) {
            connection.subscriptions.delete(message.channel);
          }
          break;

        default:
          logger.warn("WebSocket", `Unknown message type: ${message.type}`);
      }
    } catch (error) {
      logger.error("WebSocket", `Failed to parse message: ${error}`);
    }
  }

  // [Step53-B] heartbeat — 죽은 연결 정리
  private startHeartbeat() {
    this.heartbeatTimer = setInterval(() => {
      this.clients.forEach((conn, id) => {
        if (conn.ws.readyState !== WebSocket.OPEN) {
          this.clients.delete(id);
          return;
        }
        if (conn.isAlive === false) {
          conn.ws.terminate();
          this.clients.delete(id);
          return;
        }
        conn.isAlive = false;
        conn.ws.ping();
      });
    }, HEARTBEAT_MS);
    this.heartbeatTimer.unref?.();
  }

  // [Step53-B] graceful shutdown
  public close(): Promise<void> {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
    }
    return new Promise((resolve) => {
      this.wss.close(() => resolve());
    });
  }

  public broadcastKeywordUpdate(update: KeywordTrendUpdate) {
    const message = JSON.stringify({
      type: "keyword_update",
      data: update,
      timestamp: Date.now(),
    });

    this.clients.forEach((connection) => {
      if (connection.isAdmin && connection.subscriptions.has("keywords")) {
        if (connection.ws.readyState === WebSocket.OPEN) {
          connection.ws.send(message);
        }
      }
    });
  }

  public broadcastStatisticsUpdate(stats: {
    totalKeywords: number;
    avgTrendScore: number;
    topKeyword: string;
  }) {
    const message = JSON.stringify({
      type: "statistics_update",
      data: stats,
      timestamp: Date.now(),
    });

    this.clients.forEach((connection) => {
      if (connection.isAdmin && connection.subscriptions.has("statistics")) {
        if (connection.ws.readyState === WebSocket.OPEN) {
          connection.ws.send(message);
        }
      }
    });
  }

  public getConnectedClientsCount(): number {
    return this.clients.size;
  }

  public getAdminClientsCount(): number {
    let count = 0;
    this.clients.forEach((c) => {
      if (c.isAdmin) count++;
    });
    return count;
  }
}

let wsServer: KeywordTrendWebSocketServer | null = null;

export function initializeWebSocketServer(httpServer: HTTPServer) {
  if (!wsServer) {
    wsServer = new KeywordTrendWebSocketServer(httpServer);
    logger.info("WebSocket", "WebSocket server initialized");
  }
  return wsServer;
}

export function getWebSocketServer(): KeywordTrendWebSocketServer | null {
  return wsServer;
}

// [Step53-B] graceful shutdown 용 close 함수 export
export async function closeWebSocketServer(): Promise<void> {
  if (wsServer) {
    await wsServer.close();
    wsServer = null;
  }
}
