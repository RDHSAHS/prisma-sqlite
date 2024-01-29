import { Router, Request, Response } from "express";
import { prisma, prismaExclude } from "../config";

const router = Router();
const excludePost = prismaExclude("Post", ["id", "docid"]);

//CODE API HERE
//------------------------------------------------------------------------------------------------

//GET POSTS
router.get("/", async (req: Request, res: Response) => {
  const posts = await prisma.post.findMany();

  res.json(posts);
});

//GET POST BY ID
router.get("/:docid", async (req: Request, res: Response) => {
  const { docid } = req.params;
  const post = await prisma.post.findUnique({
    where: {
      docid,
    },
    select: excludePost,
  });

  if (!post) return res.status(404).json({ error: "Post not found" });

  res.status(200).json(post);
});

//GET POSTS BY USER ID

//POST POST
router.post("/", async (req: Request, res: Response) => {
  try {
    const { title, content, published, authorId } = req.body;
    const newPost = await prisma.post.create({
      data: {
        title,
        content,
        published,
        author: { connect: { docid: authorId } },
      },
      select: excludePost,
    });

    // const { id, docid, ...sanitizedPost } = newPost;

    const message = `New post created`;

    res.status(202).json({
      message,
      data: newPost,
    });
  } catch (err) {
    console.error(err);
  }
});

//PUT POST
router.put("/:docid", async (req: Request, res: Response) => {
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

  const message = `Post with id ${foundPost.id} updated`;

  res.status(200).json({ message, data: updPost });
});

//DELETE POST
router.delete("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const delPost = await prisma.post.delete({
    where: {
      id: Number(id),
    },
    select: excludePost,
  });

  const message = `Post with id ${id} deleted`;

  if (!delPost) return res.status(404).json({ error: "Post not found" });

  res.status(200).json({ message, data: delPost });
});

//DELETE ALL POSTS
router.delete("/", async (req: Request, res: Response) => {
  await prisma.post.deleteMany();

  const message = `All Posts are deleted`;

  res.status(200).json({ message });
});

export default router;
