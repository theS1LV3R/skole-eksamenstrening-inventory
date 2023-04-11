import path from "node:path";

import express from "express";
import session from "express-session";
import bettersqlite from "better-sqlite3";
import { handlebars as hbs } from "hbs";
import api from "./api";
import dotenv from "dotenv";

const db = bettersqlite("database.sqlite3");
dotenv.config();

const app = express();
app.use(
  session({
    secret: process.env.SESSION_SECRET ?? "secret",
    resave: false,
    saveUninitialized: false,
  })
);
app.set("views", path.resolve(__dirname, "views"));
app.set("view engine", "hbs");

app.use("/api", api);
app.listen(process.env.PORT, () => {
  console.log("Listening on 8080");
});
