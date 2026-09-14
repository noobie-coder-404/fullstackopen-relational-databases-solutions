// server.js
import express from "express";

import cors from "cors";
const app = express();
const PORT = process.env.PORT || 3000;

// Import your modular route
import blogRoutes from "./blogs.js";
app.use(cors());
app.use(express.json());

// Link the routes file to a specific path prefix
app.use("/api/blogs", blogRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
