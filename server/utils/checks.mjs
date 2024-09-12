import crypto from "crypto";
import dotenv from "dotenv";

import { logger } from "./logger.mjs";

dotenv.config();

export function checks() {
  if (!process.env.SECRET_KEY) {
    logger("Secret key is not set", "error", true);
    logger(
      `You could use similar secret key: ${crypto
        .randomBytes(12)
        .toString("base64")}`,
      "suggestion",
      true
    );
    process.exit(1);
  }

  if (!process.env.SECRET_PHRASE) {
    logger("Secret phrase is not set", "error", true);
    logger(
      `You could use similar secret phrase: ${crypto
        .randomBytes(32)
        .toString("base64")}`,
      "suggestion",
      true
    );
    process.exit(1);
  }

  if (!process.env.SECRET_IV) {
    logger("Secret IV is not set", "error", true);
    logger(
      `You could use similar secret iv: ${crypto
        .randomBytes(16)
        .toString("base64")}`,
      "suggestion",
      true
    );
    process.exit(1);
  }

  if (process.env.SECRET_PHRASE) {
    if (Buffer.from(process.env.SECRET_PHRASE, "base64").length !== 32) {
      logger("Invalid secret phrase length", "error", true);
      logger("Secret phrase should be 32 bytes long", "info", true);
      logger(
        `You could use similar secret key: ${crypto
          .randomBytes(32)
          .toString("base64")}`,
        "suggestion",
        true
      );
      process.exit(1);
    }
  }

  if (process.env.SECRET_IV) {
    if (Buffer.from(process.env.SECRET_IV, "base64").length !== 16) {
      logger("Invalid secret phrase length", "error", true);
      logger("Secret iv should be 16 bytes long", "info", true);
      logger(
        `You could use similar secret iv: ${crypto
          .randomBytes(16)
          .toString("base64")}`,
        "suggestion",
        true
      );
      process.exit(1);
    }
  }

  if (process.env.SILENT_LEVEL) {
    const level = process.env.SILENT_LEVEL;
    if (Number(level) < 0 || Number(level) > 2 || isNaN(level)) {
      logger("Invalid SILENT_LEVEL", "error", true);
      logger("SILENT_LEVEL should be 0, 1 or 2", "info", true);
      process.exit(1);
    }
  }
}
