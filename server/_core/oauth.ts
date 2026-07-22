import { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";
import type { Express, Request, Response } from "express";
import * as db from "../db";
import { getSessionCookieOptions } from "./cookies";
import { sdk } from "./sdk";
import { consumeOAuthState, getSocialProfile, startSocialLogin, type SocialProvider } from "./socialAuth";

function getQueryParam(req: Request, key: string): string | undefined {
  const value = req.query[key];
  return typeof value === "string" ? value : undefined;
}

export function registerOAuthRoutes(app: Express) {
  for (const provider of ["naver", "kakao"] as const) {
    app.get(`/api/auth/${provider}/start`, (req, res) => startSocialLogin(req, res, provider));
    app.get(`/api/auth/${provider}/callback`, async (req, res) => {
      const code = getQueryParam(req, "code");
      const state = getQueryParam(req, "state");
      const oauthState = consumeOAuthState(req, res, provider as SocialProvider, state);
      if (!code || !oauthState) {
        return res.status(400).json({ error: "invalid_oauth_state" });
      }
      try {
        const profile = await getSocialProfile(provider, code, oauthState.codeVerifier, oauthState.state);
        const user = await db.findOrCreateSocialUser(profile);
        const sessionToken = await sdk.createSessionToken(user.openId, {
          name: user.name || "",
          expiresInMs: ONE_YEAR_MS,
        });
        res.cookie(COOKIE_NAME, sessionToken, { ...getSessionCookieOptions(req), maxAge: ONE_YEAR_MS });
        return res.redirect(302, oauthState.returnTo);
      } catch (error) {
        console.error(`[OAuth] ${provider} callback failed`, error);
        return res.status(502).json({ error: "social_login_failed" });
      }
    });
  }

  // Legacy Manus callback. New patient accounts should use Naver or Kakao.
  app.get("/api/oauth/callback", async (req: Request, res: Response) => {
    const code = getQueryParam(req, "code");
    const state = getQueryParam(req, "state");

    if (!code || !state) {
      res.status(400).json({ error: "code and state are required" });
      return;
    }

    try {
      const tokenResponse = await sdk.exchangeCodeForToken(code, state);
      const userInfo = await sdk.getUserInfo(tokenResponse.accessToken);

      if (!userInfo.openId) {
        res.status(400).json({ error: "openId missing from user info" });
        return;
      }

      await db.upsertUser({
        openId: userInfo.openId,
        name: userInfo.name || null,
        email: userInfo.email ?? null,
        loginMethod: userInfo.loginMethod ?? userInfo.platform ?? null,
        lastSignedIn: new Date(),
      });

      const sessionToken = await sdk.createSessionToken(userInfo.openId, {
        name: userInfo.name || "",
        expiresInMs: ONE_YEAR_MS,
      });

      const cookieOptions = getSessionCookieOptions(req);
      res.cookie(COOKIE_NAME, sessionToken, { ...cookieOptions, maxAge: ONE_YEAR_MS });

      res.redirect(302, "/");
    } catch (error) {
      console.error("[OAuth] Callback failed", error);
      res.status(500).json({ error: "OAuth callback failed" });
    }
  });
}
