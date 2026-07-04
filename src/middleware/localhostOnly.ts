// NOTE: No longer used, consider to delete
import type { Request, Response, NextFunction } from "express";

export function localhostOnly(req: Request, res: Response, next: NextFunction) {
  const ip = req.ip || req.socket.remoteAddress || "";
  if (
    ip === "127.0.0.1" ||
    ip === "::1" ||
    ip === "::ffff:127.0.0.1" ||
    req.hostname === "localhost"
  ) {
    return next();
  }
  res.status(403).json({ error: "Forbidden" });
}
