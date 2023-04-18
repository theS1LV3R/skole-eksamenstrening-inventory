import path from "node:path";

import express from "express";
import session from "express-session";
import api from "./api";
import views from "./views";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";

dotenv.config();
const prisma = new PrismaClient();
const app = express();

async function main() {
  await prisma.$connect();

  app.use(
    session({
      secret: process.env.SESSION_SECRET ?? "secret",
      resave: false,
      saveUninitialized: false,
    })
  );

  app.set("views", path.resolve(__dirname, "views"));
  app.set("view engine", "hbs");

  app.use("/api", api(prisma));
  app.use("/", views(prisma));

  const PORT = process.env.PORT ?? 8080;

  app.listen(PORT, () => {
    console.log(`Listening on ${PORT}`);
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
