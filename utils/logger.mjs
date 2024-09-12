import dotenv from "dotenv";
import { DEFAULT_SILENT_LEVEL } from "./consts.mjs";

dotenv.config();

const SILENT_LEVEL = Number(process.env.SILENT_LEVEL || DEFAULT_SILENT_LEVEL);
const isSilenet = SILENT_LEVEL === 0 || SILENT_LEVEL === 1;

export function logger(message, type = "info", force = false) {
  if (!isSilenet || force) {
    console.info(
      `[${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}]:[${type.toUpperCase()}] - ${message}`
    );
  }
}
