import express from "express";
import dotenv from "dotenv";
import path from "path";
import cors from "cors";

import mongoose from "./db/mongoose.mjs";

import { logger } from "./utils/logger.mjs";
import { checks } from "./utils/checks.mjs";
import { handleError } from "./utils/error-handler.mjs";
import { DEFAULT_PORT } from "./utils/consts.mjs";
import { router as passwordRoutes } from "./routes/password.mjs";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || DEFAULT_PORT;

checks();

app.get("/", (req, res) => {
  res.sendFile(path.join(path.resolve(), "index.html"));
});

// Routes

app.use("/password", passwordRoutes);

app.listen(PORT, () => {
  logger(`Server is running on port ${PORT}`);
});

process.on("uncaughtException", handleError);
