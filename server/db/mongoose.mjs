import dotenv from "dotenv";
import mongoose from "mongoose";
import { handleError } from "../utils/error-handler.mjs";
import { logger } from "../utils/logger.mjs";

dotenv.config();

mongoose.set("strictQuery", true);

mongoose.plugin((schema) => {
  schema.set("strict", true);
  schema.set("timestamps", true);
  schema.set("versionKey", false);
});

mongoose
  .connect(process.env.DATABASE_URL)
  .then(() => {
    logger("Connected to database succesfully");
  })
  .catch(handleError);

export default mongoose;
