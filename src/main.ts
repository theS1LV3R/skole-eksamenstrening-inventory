import path from "node:path";
//import all npm packages
import express from "express";
import session from "express-session";
import bettersqlite from "better-sqlite3";
import api from "./api";
import views from "./views";
import dotenv from "dotenv";

const db = bettersqlite("database.sqlite3");
dotenv.config();

const app = express();
//start a session
app.use(
  session({
    secret: process.env.SESSION_SECRET ?? "secret",
    resave: false,
    saveUninitialized: false,
  })
);
//set up a views engine for our hbs files
app.set("views", path.resolve(__dirname, "views"));
app.set("view engine", "hbs");

//send the user to the right place
app.use("/api", api);
app.use("/", views);

//start the app at port 8080
app.listen(process.env.PORT, () => {
  console.log("Listening on 8080");
});
