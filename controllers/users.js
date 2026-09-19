import express from "express";
import { User, Blog, ReadingList } from "../models/index.js";
import { Op } from "sequelize";
const router = express.Router();

//working
router.get("/", async (req, res, next) => {
  try {
    const allUsers = await User.findAll({
      include: {
        model: Blog,
        attributes: {
          exclude: ["userId"],
        },
      },
    });

    return res.status(200).json(allUsers);
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  const query = req.query;
  let where;
  if (!query || !(query.read === "true" || query.read === "false")) {
    where = {};
  } else {
    where = {
      read: query.read === "true",
    };
  }

  try {
    const user = await User.findByPk(req.params.id, {
      include: [
        {
          model: Blog,
          attributes: {
            include: ["userId"],
          },
        },
        {
          model: Blog,
          as: "readings",
          attributes: {
            exclude: ["userId", "createdAt", "updatedAt"],
          },
          through: {
            attributes: ["read", "id"],
            where,
          },
        },
      ],
    });
    if (!user) {
      return res.status(404).end();
    }
    return res.status(200).json(user);
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  const { username, name } = req.body;
  if (!username) {
    return res.status(400).json({ error: "username missing" });
  }
  try {
    const savedUser = await User.create({ username, name });
    res.status(201).json(savedUser);
  } catch (error) {
    next(error);
  }
});

router.put("/:username", async (req, res, next) => {
  const { username } = req.body;
  const newName = username;
  if (!newName) {
    return res.status(400).end();
  }
  try {
    const username = req.params.username;
    const user = await User.findOne({
      where: {
        username: username,
      },
    });
    if (!user) {
      return res.status(404).end();
    }
    user.username = newName;
    const updatedUser = await user.save();
    return res.status(200).json(updatedUser);
  } catch (error) {
    next(error);
  }
});

export default router;
