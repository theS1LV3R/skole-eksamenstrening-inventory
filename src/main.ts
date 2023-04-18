import path from "node:path";

import express from "express";
import session from "express-session";
import bettersqlite from "better-sqlite3";
import api from "./api";
import views from "./views";
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
app.use("/", views);

app.listen(process.env.PORT, () => {
  console.log("Listening on 8080");
});
