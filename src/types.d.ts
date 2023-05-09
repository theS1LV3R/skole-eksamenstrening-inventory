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

export type AdminRequest =
  | EditUserAdminRequest
  | EditItemAdminRequest
  | CreateItemAdminRequest
  | EditExtensionAdminRequest
  | CreateExtensionAdminRequest;

export type EditUserAdminRequest = {
  action: "edit_user";
};

export type EditItemAdminRequest = {
  action: "edit_item";
};

export type CreateItemAdminRequest = {
  action: "create_item";
};

export type EditExtensionAdminRequest = {
  action: "edit_extension";
};

export type CreateExtensionAdminRequest = {
  action: "create_extension";
};
