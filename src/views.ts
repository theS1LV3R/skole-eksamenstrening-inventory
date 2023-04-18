
import { PrismaClient, ItemType } from "@prisma/client";
import { Router } from "express";
import { LoginRequest, ReqWithBody } from "./types";
import { compare } from "bcrypt";

export default function views(prisma: PrismaClient): Router {
  const router = Router();

  router.get("/", async (req, res) => {
    const types = await prisma.itemType.findMany();
    const itemCounts: Record<ItemType['name'], number> = {}

    types.forEach(async (type) => {
      const items = await prisma.item.findMany({ where: { type } })
      itemCounts[type.name] = items.length
    })

    const pageData: (typeof types[number] & { count: number })[] = []
    types.forEach(type => {
      pageData.push({ ...type, count: itemCounts[type.name] })
    })

    return res.render("FrontPage", { items: pageData })
  })



  router.post("/login", async (req: ReqWithBody<LoginRequest>, res) => {
    const user = await prisma.user.findFirst({
      where: { name: req.body.username },
    });

    if (!user) {
      return res
        .status(400)
        .redirect("/login?status=invalid_username_password");
    }

    if (!(await compare(req.body.password, user.password_hash))) {
      return res
        .status(400)
        .redirect("/login?status=invalid_username_password");
    }

    req.session.user_id = user.id;

    if (req.params.next) {
      return res.redirect(decodeURI(req.params.next));
    }

    return res.redirect("/");
  });

  return router;
}
