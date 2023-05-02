import { PrismaClient } from "@prisma/client";
import { Router } from "express";

export default function api(prisma: PrismaClient): Router {
  const router = Router();

  router.all("/", async (req, res) => {
    const data = await prisma.userRole.findMany();
    res.send(data);
  });

  return router;
}
