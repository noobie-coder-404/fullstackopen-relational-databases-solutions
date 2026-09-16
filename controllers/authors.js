import express from "express";
import { Blog, User } from "../models/index.js";
import { sequelize } from "../utils/db.js";
const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const authors = await Blog.findAll({
      attributes: [
        "author",
        [sequelize.fn("COUNT", sequelize.col("id")), "blogs"],
        [sequelize.fn("SUM", sequelize.col("likes")), "likes"],
      ],
      group: ["author"],
      order: [[sequelize.fn("SUM", sequelize.col("likes")), "DESC"]],
    });
    res.json(authors);
  } catch (error) {
    next(error);
  }
});

export default router;
