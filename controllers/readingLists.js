import express from "express";
import { Blog, User, ReadingList } from "../models/index.js";
import { tokenExtractor } from "../utils/middleware.js";
const router = express.Router();

router.put("/:id", tokenExtractor, async (req, res, next) => {
  console.log("put triggered");
  if (typeof req.body.read !== "boolean") {
    return res.status(400).end();
  }
  try {
    const readingListEntry = await ReadingList.findByPk(req.params.id, {
      attributes: {
        include: ["userId"],
      },
    });
    if (!readingListEntry) {
      return res.status(404).json({ error: "reading list entry not found" });
    }
    if (readingListEntry.userId !== req.decodedToken.id) {
      return res.status(401).end();
    }
    readingListEntry.read = req.body.read;
    const savedEntry = await readingListEntry.save();
    res.status(200).json({
      read: savedEntry.read,
      id: savedEntry.id,
      user_id: savedEntry.userId,
      blog_id: savedEntry.blogId,
    });
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  console.log("post triggered");
  const { blogId, userId } = req.body;
  if (!blogId) {
    return res.status(400).json({ error: "blogId is required" });
  } else if (!userId) {
    return res.status(400).json({ error: "userId is required" });
  }
  try {
    const user = await User.findByPk(userId);
    const blog = await Blog.findByPk(blogId);
    if (!user || !blog) {
      return res.status(404).json({ error: "user or blog not found" });
    }

    const readingListSearch = await ReadingList.findOne({
      where: {
        userId: user.id,
        blogId: blog.id,
      },
    });

    if (readingListSearch) {
      return res.status(400).end();
    }
    const readingBlogsForUser = await ReadingList.create({
      userId: user.id,
      blogId: blog.id,
    });
    return res.status(201).json({
      id: readingBlogsForUser.id,
      user_id: readingBlogsForUser.userId,
      blog_id: readingBlogsForUser.blogId,
      read: readingBlogsForUser.read,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
