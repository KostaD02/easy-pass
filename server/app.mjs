import express from "express";
import dotenv from "dotenv";

import mongoose from "../db/mongoose.mjs";

import { logger } from "./utils/logger.mjs";
import { checks } from "./utils/checks.mjs";
import { handleError } from "./utils/error-handler.mjs";
import { DEFAULT_PORT } from "./utils/consts.mjs";
import { validateConnect } from "../middleware/password.mjs";
import { router as passwordRoutes } from "./routes/password.mjs";

dotenv.config();

const app = express();
app.use(express.json());
app.use(validateConnect);

const PORT = process.env.PORT || DEFAULT_PORT;

checks();

app.get("/", (req, res) => {
  res.json({
    message: "Welcome to password manager",
    author: "Konstantine Datunishvili",
    github: "https://github.com/KostaD02/easy-pass",
    info: "Star if you liked the project",
  });
});

// Routes

app.use("/password", passwordRoutes);

app.listen(PORT, () => {
  logger(`Server is running on port ${PORT}`);
});

process.on("uncaughtException", handleError);
