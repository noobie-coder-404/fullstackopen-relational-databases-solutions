// routes/users.js

// import { sequelize } from "./cli.js";
import dotenv from "dotenv";
dotenv.config();
import { Model, DataTypes, Sequelize } from "sequelize";
import express from "express";
const router = express.Router();

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: "postgres",
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
});

class Blog extends Model {}
Blog.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    author: {
      type: DataTypes.TEXT,
    },
    url: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    title: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    likes: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  },
  { sequelize, underscored: true, timestamps: false, modelName: "blog" },
);
Blog.sync();
// GET all users (Maps to /api/users)
router.get("/", async (req, res) => {
  const blogs = await Blog.findAll();

  return res.json(blogs);
});

// POST a new user (Maps to /api/users)
router.post("/", async (req, res) => {
  const newBlog = req.body;

  try {
    const blogToSave = await Blog.build(newBlog);
    const savedBlog = await blogToSave.save();
    return res.status(201).json(savedBlog);
  } catch (error) {
    console.log("error occured");
  }
});

// GET a single user by ID (Maps to /api/users/:id)
router.delete("/:id", async (req, res) => {
  const blogId = req.params.id;
  console.log(blogId);
  try {
    const blogToDelete = await Blog.findByPk(blogId);
    console.log("blog found", blogToDelete);
    if (blogToDelete) {
      await blogToDelete.destroy();
      return res.status(204).end();
    }
    return res.status(404).end();
  } catch (error) {
    console.log("error occured", error);
  }
});

export default router;
