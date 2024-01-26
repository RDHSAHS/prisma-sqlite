import { Router, Request, Response, NextFunction } from "express";
import prisma from "../config/prisma";

const router = Router();

//CODE API HERE
//GET POSTS
router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  const posts = await prisma.post.findMany();

  res.json(posts);
});

//GET POST BY ID
router.get(
  "/:docid",
  async (req: Request, res: Response, next: NextFunction) => {
    const { docid } = req.params;
    const post = await prisma.post.findUnique({
      where: {
        docid,
      },
    });

    if (!post) return res.status(404).json({ error: "Post not found" });

    res.status(200).json(post);
  }
);

//GET POSTS BY USER ID

//POST POST
router.post("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { title, content, published, authorId } = req.body;
    const newPost = await prisma.post.create({
      data: {
        title,
        content,
        published,
        author: { connect: { docid: authorId } },
      },
    });

    const { id, docid, ...sanitizedPost } = newPost;

    const resp = `New post created`;

    res.status(202).json({
      message: resp,
      data: sanitizedPost,
    });
  } catch (err) {
    console.error(err);
  }
});

//DELETE POST
router.delete(
  "/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const delPost = await prisma.post.delete({
      where: {
        id: Number(id),
      },
    });

    const resp = `Post with id ${id} deleted`;

    if (!delPost) return res.status(404).json({ error: "Post not found" });

    res.status(200).json({ message: resp, data: delPost });
  }
);

export default router;
