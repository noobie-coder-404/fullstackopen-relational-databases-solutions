import jwt from "jsonwebtoken";
import { SECRET } from "../utils/config.js";
import { User, Session, Blog } from "../models/index.js";

export const blogFinder = async (req, res, next) => {
  const blog = await Blog.findByPk(req.params.id);
  if (!blog) {
    return res.status(404).end();
  }
  req.blog = blog;
  next();
};

export const tokenExtractor = async (req, res, next) => {
  const authorization = req.get("authorization");
  if (authorization && authorization.toLowerCase().startsWith("bearer")) {
    try {
      const tokenRecieved = authorization.split(" ")[1];
      const savedTokenEntry = await Session.findOne({
        where: {
          token: tokenRecieved,
        },
      });

      if (savedTokenEntry?.token !== tokenRecieved) {
        return res.status(401).end();
      }

      const decodedToken = jwt.verify(tokenRecieved, SECRET);
      const user = await User.findByPk(decodedToken.id);
      if (user.disabled) {
        return res
          .status(401)
          .json({ error: "this user's access has been blocked" });
      }
      req.decodedToken = decodedToken;
    } catch (error) {
      return res.status(401).json({ error: "invalid token" });
    }
  } else {
    return res.status(401).json("token not found");
  }
  next();
};
