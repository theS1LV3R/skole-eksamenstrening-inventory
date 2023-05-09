import path from "node:path";
//import all npm packages
import express from "express";
import session from "express-session";
import api from "./api";
import views from "./views";
import dotenv from "dotenv";
import { engine, ExpressHandlebars } from "express-handlebars";
import { PrismaClient } from "@prisma/client";
import bodyParser from "body-parser";
import { HelperDelegate } from "handlebars";
import { everyPageSessionData } from "./util";

dotenv.config();
const prisma = new PrismaClient();
const app = express();

async function main() {
  await prisma.$connect();

  const handlebarsConfig: ExpressHandlebars["config"] = {
    helpers: {
      eq: (v1, v2) => v1 === v2,
      ne: (v1, v2) => v1 !== v2,
      lt: (v1, v2) => v1 < v2,
      gt: (v1, v2) => v1 > v2,
      lte: (v1, v2) => v1 <= v2,
      gte: (v1, v2) => v1 >= v2,
      and() {
        return Array.prototype.every.call(arguments, Boolean);
      },
      or() {
        return Array.prototype.slice.call(arguments, 0, -1).some(Boolean);
      },
    } satisfies Record<string, HelperDelegate>,
  };

  app.use(
    session({
      secret: process.env.SESSION_SECRET ?? "secret",
      resave: false,
      saveUninitialized: false,
    })
  );

  app.engine("handlebars", engine(handlebarsConfig));
  app.set("view engine", "handlebars");
  app.set("views", path.resolve(__dirname, "views"));
  app.use(express.static(path.resolve(__dirname, "public")));
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use("*", everyPageSessionData(prisma));

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
