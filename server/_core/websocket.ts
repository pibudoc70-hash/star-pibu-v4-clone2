import type { IncomingMessage, Server as HTTPServer } from "http";
import type { Request } from "express";
import { WebSocketServer, WebSocket } from "ws";
import { logger } from "./logger";
import { sdk } from "./sdk";
import { ENV } from "./env";

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
  userId?: number;
  isAdmin: boolean;
  subscriptions: Set<"keywords" | "statistics">;
}

const ALLOWED_CHANNELS = new Set(["keywords", "statistics"] as const);

class KeywordTrendWebSocketServer {
  private wss: WebSocketServer;
  private clients = new Map<string, ClientConnection>();
  private clientCounter = 0;

  constructor(httpServer: HTTPServer) {
    this.wss = new WebSocketServer({ server: httpServer, path: "/ws/trends", maxPayload: 8 * 1024 });
    this.setupConnectionHandler();
  }

  private isAllowedOrigin(request: IncomingMessage) {
    const origin = request.headers.origin;
    // Browsers send Origin for WebSocket handshakes. Allow non-browser clients only outside production.
    if (!origin) return !ENV.isProduction;
    const expected = ENV.appOrigin || `http://${request.headers.host}`;
    return origin === expected;
  }

  private setupConnectionHandler() {
    this.wss.on("connection", (ws: WebSocket, request: IncomingMessage) => {
      if (!this.isAllowedOrigin(request)) {
        ws.close(1008, "Origin not allowed");
        return;
      }
      const clientId = `client_${++this.clientCounter}`;
      const connection: ClientConnection = { ws, isAdmin: false, subscriptions: new Set() };
      this.clients.set(clientId, connection);

      ws.on("message", (data: Buffer) => void this.handleMessage(clientId, request, data));
      ws.on("close", () => this.clients.delete(clientId));
      ws.on("error", (error: Error) => logger.error("WebSocket", `Client error: ${error.message}`));
      ws.send(JSON.stringify({ type: "connected", clientId, timestamp: Date.now() }));
    });
  }

  private async authenticate(connection: ClientConnection, request: IncomingMessage) {
    try {
      // Session is read from the HttpOnly cookie sent during the WS handshake.
      // No client-supplied role, user id, or localStorage token is trusted.
      const user = await sdk.authenticateRequest(request as Request);
      if (user.role !== "admin") return false;
      connection.isAdmin = true;
      connection.userId = user.id;
      return true;
    } catch {
      return false;
    }
  }

  private async handleMessage(clientId: string, request: IncomingMessage, data: Buffer) {
    let message: { type?: unknown; channel?: unknown };
    try {
      message = JSON.parse(data.toString()) as { type?: unknown; channel?: unknown };
    } catch {
      this.clients.get(clientId)?.ws.close(1003, "Invalid message");
      return;
    }
    const connection = this.clients.get(clientId);
    if (!connection || typeof message.type !== "string") return;

    if (message.type === "auth") {
      if (!await this.authenticate(connection, request)) {
        connection.ws.send(JSON.stringify({ type: "auth_failed" }));
        return;
      }
      connection.ws.send(JSON.stringify({ type: "auth_success" }));
      return;
    }

    if (message.type === "subscribe" && typeof message.channel === "string") {
      if (!connection.isAdmin || !ALLOWED_CHANNELS.has(message.channel as "keywords" | "statistics")) {
        connection.ws.send(JSON.stringify({ type: "forbidden" }));
        return;
      }
      connection.subscriptions.add(message.channel as "keywords" | "statistics");
      connection.ws.send(JSON.stringify({ type: "subscribed", channel: message.channel }));
      return;
    }

    if (message.type === "unsubscribe" && typeof message.channel === "string") {
      connection.subscriptions.delete(message.channel as "keywords" | "statistics");
      return;
    }
    logger.warn("WebSocket", `Unknown message type: ${message.type}`);
  }

  public broadcastKeywordUpdate(update: KeywordTrendUpdate) {
    const message = JSON.stringify({ type: "keyword_update", data: update, timestamp: Date.now() });
    this.clients.forEach((connection) => {
      if (connection.isAdmin && connection.subscriptions.has("keywords") && connection.ws.readyState === WebSocket.OPEN) connection.ws.send(message);
    });
  }

  public broadcastStatisticsUpdate(stats: { totalKeywords: number; avgTrendScore: number; topKeyword: string }) {
    const message = JSON.stringify({ type: "statistics_update", data: stats, timestamp: Date.now() });
    this.clients.forEach((connection) => {
      if (connection.isAdmin && connection.subscriptions.has("statistics") && connection.ws.readyState === WebSocket.OPEN) connection.ws.send(message);
    });
  }

  public getConnectedClientsCount() { return this.clients.size; }
  public getAdminClientsCount() { return Array.from(this.clients.values()).filter((client) => client.isAdmin).length; }
}

let wsServer: KeywordTrendWebSocketServer | null = null;
export function initializeWebSocketServer(httpServer: HTTPServer) {
  if (!wsServer) wsServer = new KeywordTrendWebSocketServer(httpServer);
  return wsServer;
}
export function getWebSocketServer() { return wsServer; }
