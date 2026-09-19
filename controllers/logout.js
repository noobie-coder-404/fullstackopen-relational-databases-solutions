import express from "express";
import { tokenExtractor } from "../utils/middleware.js";
import { Session } from "../models/index.js";
const router = express.Router();

router.delete("/", tokenExtractor, async (req, res, next) => {
  await Session.destroy({
    where: {
      userId: req.decodedToken.id,
    },
  });
  return res.status(204).end();
});

export default router;
