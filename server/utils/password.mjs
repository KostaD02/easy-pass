import crypto from "crypto";
import dotenv from "dotenv";

import {
  DEFAULT_PASSWORD_CHARSET,
  DEFAULT_PASSOWRD_MINIMUM_LENGTH,
} from "../utils/consts.mjs";

dotenv.config();

export function generateRandomPassword(
  length = DEFAULT_PASSOWRD_MINIMUM_LENGTH
) {
  let password = "";
  for (let i = 0; i < length; i++) {
    password += DEFAULT_PASSWORD_CHARSET.charAt(
      Math.floor(Math.random() * DEFAULT_PASSWORD_CHARSET.length)
    );
  }
  return password;
}

export function encrypt(text = "") {
  if (!text) {
    throw new Error("Text is required");
  }
  const cipher = crypto.createCipheriv(
    "aes-256-cbc",
    Buffer.from(process.env.SECRET_PHRASE, "base64"),
    Buffer.from(process.env.SECRET_IV, "base64")
  );
  let encrypted = cipher.update(text, "utf8", "base64");
  encrypted += cipher.final("base64");
  return encrypted;
}

export function decrypt(text = "") {
  if (!text) {
    throw new Error("Text is required");
  }

  const decipher = crypto.createDecipheriv(
    "aes-256-cbc",
    Buffer.from(process.env.SECRET_PHRASE, "base64"),
    Buffer.from(process.env.SECRET_IV, "base64")
  );

  let decrypted = decipher.update(text, "base64", "utf8");
  decrypted += decipher.final("utf8");

  return decrypted;
}
