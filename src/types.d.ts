import { User } from "@prisma/client";
import { Request } from "express";

export type LoginRequest = {
  username: string;
  password: string;
};

export type ReqWithBody<Body> = Request<Record<string, string>, any, Body>;

declare module "express-session" {
  interface SessionData {
    user_id: User["id"];
  }
}
