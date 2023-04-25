import { PrismaClient, ItemType } from "@prisma/client";
import { Router } from "express";
import { LoginRequest, RegisterRequest, ReqWithBody } from "./types";
import { compare, compareSync, hash } from "bcrypt";

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
    const isAdmin = !users;
    const body = req.body;

    if (!body.fullname || !body.password || !body.username)
      return res.render("Register");

    if (users.find((user) => user.username === body.username))
      return res.render("/register", { usernameTaken: true });

    const newUser = await prisma.user.create({
      data: {
        username: body.username,
        full_name: body.fullname,
        password_hash: await hash(body.password, 10000),
        role_id: isAdmin ? 3 : 0,
      },
    });

    req.session.user_id = newUser.id;
    return res.redirect("/");
  });

  router.get("/login", async (req, res) => {
    const users = await prisma.user.findMany();

    if (!users) return res.redirect(307, "/register");

    res.render("Login");
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

    if (req.params.next) {
      return res.redirect(decodeURI(req.params.next));
    }

    return res.redirect("/");
  });

  return router;
}
