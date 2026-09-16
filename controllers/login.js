import express from "express";
import jwt from "jsonwebtoken";
import { SECRET } from "../utils/config.js";
import { User } from "../models/index.js";
const router = express.Router();

router.post("/", async (req, res, next) => {
  const username = req.body.username;

  if (!username) return res.status(400).json({ error: "username missing" });
  try {
    const user = await User.findOne({
      where: {
        username: username,
      },
    });

    if (!user) return res.status(401).end();

    const token = jwt.sign({ username: user.username, id: user.id }, SECRET);
    return res
      .status(200)
      .json({ token, username: user.username, name: user.name });
  } catch (error) {
    next(error);
  }
});

export default router;
