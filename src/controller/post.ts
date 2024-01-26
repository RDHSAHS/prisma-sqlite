import { Router, Request, Response, NextFunction } from "express";
import prisma, { prismaExclude } from "../config/prisma";

const router = Router();

//CODE API HERE
//------------------------------------------------------------------------------------------------

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

    const message = `New post created`;

    res.status(202).json({
      message,
      data: sanitizedPost,
    });
  } catch (err) {
    console.error(err);
  }
});

//PUT POST
router.put(
  "/:docid",
  async (req: Request, res: Response, next: NextFunction) => {
    const { docid } = req.params;
    const { title, content, published } = req.body;

    const foundPost = await prisma.post.findUnique({
      where: { docid },
    });

    if (!foundPost) return res.status(404).json({ error: `Post not found` });

    const updData: Record<string, any> = {};

    if (title && title !== foundPost.title) updData.title = title;
    if (content && content !== foundPost.content) updData.content = content;
    if (published && published !== foundPost.published) {
      updData.published = published;
    }

    const updPost = await prisma.post.update({
      where: { docid },
      data: updData,
      select: prismaExclude("Post", ["id", "docid"]),
    });

    const message = `Post with id ${updData.id} updated`;

    res.status(200).json({ message, data: updPost });
  }
);

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

    const message = `Post with id ${id} deleted`;

    if (!delPost) return res.status(404).json({ error: "Post not found" });

    res.status(200).json({ message, data: delPost });
  }
);

//DELETE ALL POSTS
router.delete("/", async (req: Request, res: Response, next: NextFunction) => {
  await prisma.post.deleteMany();

  const message = `All Posts are deleted`;

  res.status(200).json({ message });
});

export default router;
