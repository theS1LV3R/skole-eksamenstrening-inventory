import { User } from "@prisma/client";
import { Request } from "express";

export type LoginRequest = {
  username: string;
  password: string;
  next?: string;
};

export type ReqWithBody<Body> = Request<Record<string, string>, any, Body>;

declare module "express-session" {
  interface SessionData {
    user_id: User["id"];
  }
}

declare module "express-serve-static-core" {
  interface Locals {
    user: User | undefined | null;
  }
}

export type RegisterRequest = {
  username: string;
  fullname: string;
  password: string;
};
