import { PrismaClient } from "@prisma/client";
import { Router } from "express";

export default function views(prisma: PrismaClient): Router {
  const router = Router();

  return router;
}
