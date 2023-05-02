import { PrismaClient, UserRole } from "@prisma/client";
import { NextFunction, Request, Response } from "express";

export const requireRoleId =
  (role_id: UserRole["id"]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    if (res.locals.user!.role_id < role_id) {
      return res.redirect("/");
    }

    return next();
  };

export const requireLogin = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  if (!req.session.user_id) {
    return res.redirect(`/login?next=${encodeURI(req.url)}`);
  }

  next();
};

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

    res.locals.user = user;
    return next();
  };
