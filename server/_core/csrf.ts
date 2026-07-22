import type { NextFunction, Request, Response } from "express";
import { ENV } from "./env";

const SAFE_METHODS = new Set(["GET", "HEAD", "OPTIONS"]);

/**
 * Cookie-authenticated tRPC mutations must originate from this application.
 * SameSite=Lax is the first layer; Origin checking protects same-site cookie
 * exceptions and future browser behavior changes.
 */
export function csrfProtection(req: Request, res: Response, next: NextFunction) {
  if (SAFE_METHODS.has(req.method)) return next();
  const origin = req.get("origin");
  if (!origin) {
    if (!ENV.isProduction) return next();
    return res.status(403).json({ error: "csrf_origin_required" });
  }
  const expectedOrigin = ENV.appOrigin || `${req.protocol}://${req.get("host")}`;
  if (origin !== expectedOrigin) {
    return res.status(403).json({ error: "csrf_origin_rejected" });
  }
  return next();
}
