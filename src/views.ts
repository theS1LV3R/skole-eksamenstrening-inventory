import { PrismaClient, ItemType } from "@prisma/client";
import { Request, Response, Router } from "express";
import { LoginRequest, RegisterRequest, ReqWithBody } from "./types";
import { compare, compareSync, hash } from "bcrypt";
import { hashSync } from "bcrypt";
import { genSaltSync } from "bcrypt";
import { requireLogin, requireRoleId } from "./util";

export default function views(prisma: PrismaClient): Router {
  const router = Router();

  router.get("/", async (req, res) => {
    const types = await prisma.itemType.findMany({ orderBy: { id: "asc" } });
    const itemCounts: Record<ItemType["name"], number> = {};

    // Promise.all + .map to make sure the requests are done before the page gets rendered
    await Promise.all(
      types.map(async (type) => {
        const items = await prisma.item.findMany({ where: { type } });
        itemCounts[type.name] = items.length;
      })
    );

    const pageData: ((typeof types)[number] & { count: number })[] = [];
    types.forEach((type) => {
      pageData.push({ ...type, count: itemCounts[type.name] ?? 0 });
    });

    return res.render("FrontPage", { items: pageData });
  });

  router.get("/register", async (req, res) => {
    const users = await prisma.user.findMany();

    return res.render("Register", { firstUser: !users.length });
  });

  router.post("/register", async (req: ReqWithBody<RegisterRequest>, res) => {
    const users = await prisma.user.findMany();
    const isAdmin = !users.length;
    const body = req.body;

    if (!body.fullname || !body.password || !body.username)
      return res.render("Register");

    if (users.find((user) => user.username === body.username))
      return res.render("Register", { usernameTaken: true });

    const passwordHash = hashSync(body.password, genSaltSync(10));

    const newUser = await prisma.user.create({
      data: {
        username: body.username,
        full_name: body.fullname,
        password_hash: passwordHash,
        role_id: isAdmin ? 3 : 0,
      },
    });

    req.session.user_id = newUser.id;
    return res.redirect("/");
  });

  router.get("/login", async (req: ReqWithBody<{}>, res) => {
    const users = await prisma.user.findMany();

    if (!users.length) return res.redirect(307, "/register");

    if (res.locals.user) {
      return res.redirect("/");
    }
    const params = new URLSearchParams(
      new URL(`http://localhost:8080${req.url}`).searchParams
    );

    res.render("Login", { next: params.get("next") });
  });

  router.post("/login", async (req: ReqWithBody<LoginRequest>, res) => {
    const user = await prisma.user.findFirst({
      where: { username: req.body.username },
    });

    if (!user) {
      return res
        .status(400)
        .render("Login", { invalidUsernameOrPassword: true });
    }

    if (!compareSync(req.body.password, user.password_hash)) {
      return res
        .status(400)
        .render("Login", { invalidUsernameOrPassword: true });
    }

    req.session.user_id = user.id;

    if (req.body.next) {
      return res.redirect(decodeURI(req.body.next));
    }

    return res.redirect("/");
  });

  router.get(
    "/teacher",
    requireLogin,
    requireRoleId(2),
    async (req: Request, res: Response) => {
      return res.render("TeacherPage");
    }
  );

  router.get(
    "/admin",
    requireLogin,
    requireRoleId(3),
    async (req: Request, res: Response) => {
      const users = await prisma.user.findMany();
      const roles = await prisma.userRole.findMany();
      const items = await prisma.item.findMany();
      const itemTypes = await prisma.itemType.findMany();

      return res.render("AdminPage", { users, roles, items, itemTypes });
    }
  );

  router.get("/profile", requireLogin, async (req, res) => {
    return res.render("UserProfile");
  });

  router.get("/requests", requireLogin, async (req, res) => {
    return res.render("Requests");
  });

  return router;
}
