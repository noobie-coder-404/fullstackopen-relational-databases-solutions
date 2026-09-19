// server.js
import express from "express";

import cors from "cors";
const app = express();
import { PORT } from "./utils/config.js";
import { connectToDatabase } from "./utils/db.js";
import { User, Blog, ReadingList, Session } from "./models/index.js";

// Import your modular route
import blogRoutes from "./controllers/blogs.js";
import userRoutes from "./controllers/users.js";
import loginRoutes from "./controllers/login.js";
import authorRoutes from "./controllers/authors.js";
import readingListsRouter from "./controllers/readingLists.js";
import logoutRouter from "./controllers/logout.js";

const errorHandler = (error, req, res, next) => {
  const errors = error.errors;
  const errorMessages =
    errors &&
    errors.map((error) => {
      return error.message;
    });
  if (errorMessages && errorMessages.length > 0) {
    return res.status(400).json({ error: errorMessages });
  }
  return res.status(400).json("error occured");
};

app.use(cors());
app.use(express.json());

// Link the routes file to a specific path prefix
app.get("/", (req, res) => res.status(200).end());
app.post("/api/reset", async (req, res, next) => {
  try {
    await ReadingList.destroy({ where: {} });
    await Session.destroy({ where: {} });
    await Blog.destroy({ where: {} });
    await User.destroy({ where: {} });

    return res.status(204).end();
  } catch (error) {
    next(error);
  }
});

app.use("/api/blogs", blogRoutes);
app.use("/api/users", userRoutes);
app.use("/api/login", loginRoutes);
app.use("/api/authors", authorRoutes);
app.use("/api/readinglists", readingListsRouter);
app.use("/api/logout", logoutRouter);
app.use(errorHandler);

const start = async () => {
  await connectToDatabase();

  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
};

start();
