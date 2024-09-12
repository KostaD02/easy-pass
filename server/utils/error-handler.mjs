import dotenv from "dotenv";
import { DEFAULT_SILENT_LEVEL } from "./consts.mjs";

dotenv.config();

const SILENT_LEVEL = Number(process.env.SILENT_LEVEL || DEFAULT_SILENT_LEVEL);
const isSilenet = SILENT_LEVEL === 0;

export function handleError(error, res = null, force = false) {
  if (!isSilenet || force) {
    console.error(
      `[${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}]:[SERVER-ERROR] - ${
        error.message
      } - ${error.stack || "stack not found"}`
    );
  }

  if (res) {
    res.status(400).json({ error: error.message });
  }
}
