import path from "node:path";
//import all npm packages
import express from "express";
import session from "express-session";
import api from "./api";
import views from "./views";
import dotenv from "dotenv";
import { engine } from "express-handlebars";
import { PrismaClient } from "@prisma/client";
import bodyParser from "body-parser";
import { handlebars } from "hbs";
import { everyPageSessionData } from "./util";

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

  handlebars.registerHelper("checkIf", function (v1, operator, v2, options) {
    switch (operator) {
      case "==":
        // @ts-ignore
        return v1 == v2 ? options.fn(this) : options.inverse(this);
      case "===":
        // @ts-ignore
        return v1 === v2 ? options.fn(this) : options.inverse(this);
      case "!=":
        // @ts-ignore
        return v1 != v2 ? options.fn(this) : options.inverse(this);
      case "!==":
        // @ts-ignore
        return v1 !== v2 ? options.fn(this) : options.inverse(this);
      case "<":
        // @ts-ignore
        return v1 < v2 ? options.fn(this) : options.inverse(this);
      case "<=":
        // @ts-ignore
        return v1 <= v2 ? options.fn(this) : options.inverse(this);
      case ">":
        // @ts-ignore
        return v1 > v2 ? options.fn(this) : options.inverse(this);
      case ">=":
        // @ts-ignore
        return v1 >= v2 ? options.fn(this) : options.inverse(this);
      case "&&":
        // @ts-ignore
        return v1 && v2 ? options.fn(this) : options.inverse(this);
      case "||":
        // @ts-ignore
        return v1 || v2 ? options.fn(this) : options.inverse(this);
      default:
        // @ts-ignore
        return options.inverse(this);
    }
  });

  app.engine("handlebars", engine());
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
