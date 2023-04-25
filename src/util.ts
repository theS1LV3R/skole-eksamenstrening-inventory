import { PrismaClient } from "@prisma/client";
import { NextFunction, Request, Response } from "express";

export async function requireLogin(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> {
  if (!req.session.user_id) {
    return res.redirect(`/login?next=${encodeURI(req.url)}`);
  }

  return next();
}

export const everyPageSessionData = (prisma: PrismaClient) =>
  async function (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    if (!req.session.user_id) return next();

    const user = await prisma.user.findUnique({
      where: { id: req.session.user_id },
    });

    console.log(user)

    // res.locals.user = user;
  };
