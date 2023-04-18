import { NextFunction, Request, Response } from "express";

export async function requireLogin(
  req: Request,
  res: Response,
  next
): Promise<any> {
  if (!req.session.user_id) {
    return res.redirect(`/login?next=${encodeURI(req.url)}`);
  }

  return next();
}
