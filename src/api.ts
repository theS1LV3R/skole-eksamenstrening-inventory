import { PrismaClient } from "@prisma/client";
import { Router } from "express";

export default function api(prisma: PrismaClient): Router {
  const router = Router();

  router.all("/", async (req, res) => {
    const data = await prisma.userRole.findMany();
    console.log(data);
    res.send(data);
  });

  return router;
}
