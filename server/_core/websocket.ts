import { Server as HTTPServer } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { logger } from "./logger";

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
  subscriptions: Set<string>;
}

class KeywordTrendWebSocketServer {
  private wss: WebSocketServer;
  private clients: Map<string, ClientConnection> = new Map();
  private clientCounter = 0;

  constructor(httpServer: HTTPServer) {
    this.wss = new WebSocketServer({ server: httpServer, path: "/ws/trends" });
    this.setupConnectionHandler();
  }

  private setupConnectionHandler() {
    this.wss.on("connection", (ws: WebSocket) => {
      const clientId = `client_${++this.clientCounter}`;
      const connection: ClientConnection = {
        ws,
        isAdmin: false,
        subscriptions: new Set(),
      };

      this.clients.set(clientId, connection);
      logger.info("WebSocket", `Client connected: ${clientId}`);

      ws.on("message", (data: Buffer) => {
        this.handleMessage(clientId, data);
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

  private handleMessage(clientId: string, data: Buffer) {
    try {
      const message = JSON.parse(data.toString());
      const connection = this.clients.get(clientId);

      if (!connection) return;

      switch (message.type) {
        case "auth":
          if (message.isAdmin && message.token) {
            connection.isAdmin = true;
            connection.userId = message.userId;
            connection.ws.send(
              JSON.stringify({
                type: "auth_success",
                message: "Admin authenticated",
              })
            );
          }
          break;

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
