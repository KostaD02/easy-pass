import dotenv from "dotenv";
import { logger } from "../utils/logger.mjs";
import { HEADERS } from "../utils/consts.mjs";

dotenv.config();

export function validateConnect(req, res, next) {
  const secret = req.headers[HEADERS.secret];

  if (!secret) {
    logger("Secret key is required", "error");
    return res.status(401).json({
      error: "Secret key is required",
    });
  }

  if (!process.env.SECRET_KEY) {
    logger("Secret key is not set", "error");
    return res.status(401).json({
      error: "Secret key is not set",
    });
  }

  if (secret !== process.env.SECRET_KEY) {
    logger("Invalid secret key", "error");
    return res.status(401).json({
      error: "Invalid secret key",
    });
  }

  next();
}
