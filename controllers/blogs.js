// routes/users.js

// import { sequelize } from "./cli.js";

import { SECRET } from "../utils/config.js";
import { Blog, User } from "../models/index.js";
import express from "express";
import jwt from "jsonwebtoken";
import { Op } from "sequelize";
import { blogFinder, tokenExtractor } from "../utils/middleware.js";
const router = express.Router();

// const blogFinder = async (req, res, next) => {
//   const blog = await Blog.findByPk(req.params.id);
//   if (!blog) {
//     return res.status(404).end();
//   }
//   req.blog = blog;
//   next();
// };

// const tokenExtractor = (req, res, next) => {
//   const authorization = req.get("authorization");

//   if (authorization && authorization.toLowerCase().startsWith("bearer")) {
//     try {
//       req.decodedToken = jwt.verify(authorization.split(" ")[1], SECRET);
//     } catch (error) {
//       return res.status(401).json({ error: "invalid token" });
//     }
//   } else {
//     return res.status(400).json("token not found");
//   }
//   next();
// };

// GET all users (Maps to /api/users)
router.get("/", async (req, res, next) => {
  let where = {};
  if (req.query.search) {
    const search = { [Op.iLike]: `%${req.query.search}%` };
    where = { [Op.or]: [{ title: search }, { author: search }] };
  }

  try {
    let blogs = await Blog.findAll({
      where,
      order: [["likes", "DESC"]],
      include: {
        model: User,
        attributes: {
          exclude: ["id"],
        },
      },
    });

    return res.json(blogs);
  } catch (error) {
    next(error);
  }
});

// POST a new user (Maps to /api/users)
router.post("/", tokenExtractor, async (req, res, next) => {
  const newBlog = req.body;
  const username = req.decodedToken.username;
  try {
    const userInDb = await User.findOne({
      where: {
        username: username,
      },
    });
    if (!userInDb) return res.status(401).end();
    const blogToSave = Blog.build(newBlog);
    blogToSave.userId = userInDb.id;
    const savedBlog = await blogToSave.save();
    return res.status(201).json(savedBlog);
  } catch (error) {
    next(error);
  }
});

// GET a single user by ID (Maps to /api/users/:id)
router.delete("/:id", blogFinder, tokenExtractor, async (req, res, next) => {
  try {
    const blogToDelete = req.blog;
    const user = await User.findOne({
      where: {
        username: req.decodedToken.username,
      },
    });
    if (blogToDelete) {
      if (blogToDelete.userId !== user.id) {
        return res.status(401).end();
      }
      await blogToDelete.destroy();
      return res.status(204).end();
    }
    return res.status(404).end();
  } catch (error) {
    next(error);
  }
});

router.put("/:id", blogFinder, async (req, res, next) => {
  try {
    const blogToUpdate = req.blog;

    blogToUpdate.likes = req.body.likes;
    const updatedBlog = await blogToUpdate.save();
    res.json(updatedBlog);
  } catch (error) {
    next(error);
  }
});

export default router;
