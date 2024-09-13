import express from "express";
import { Password } from "../db/models/password.mjs";
import {
  generateRandomPassword,
  encrypt,
  decrypt,
} from "../utils/password.mjs";
import { handleError } from "../utils/error-handler.mjs";
import { HEADERS, DEFAULT_PASSOWRD_MINIMUM_LENGTH } from "../utils/consts.mjs";
import { validMongooseId } from "../middleware/mongoose.mjs";
import { validateConnect } from "../middleware/password.mjs";

const router = express.Router();

router.get("/all", async (req, res) => {
  const result = await Password.find({});

  result.forEach((item) => {
    item.password = decrypt(item.password);
  });

  return res.json(result);
});

router.get("/random", validateConnect, (req, res) => {
  const length = req.headers[HEADERS.length] || DEFAULT_PASSOWRD_MINIMUM_LENGTH;
  return res.json({
    password: generateRandomPassword(length),
  });
});

router.post("/create", validateConnect, async (req, res) => {
  const { title, url } = req.body;

  const isDuplicated = await Password.exists({ title });

  if (isDuplicated) {
    return res.status(400).json({
      error: "Password with this title already exists",
    });
  }

  if (url === "") {
    return res.status(400).json({
      error: "URL can't be empty",
    });
  }

  try {
    const randomPassword = generateRandomPassword(
      DEFAULT_PASSOWRD_MINIMUM_LENGTH
    );
    const encryptedPassword = encrypt(randomPassword, process.env.SECRET_KEY);
    const model = new Password({
      url,
      title,
      password: encryptedPassword,
    });
    model
      .save()
      .then((result) => {
        result.password = decrypt(result.password);
        res.json(result);
      })
      .catch((error) => {
        handleError(error, res);
      });
  } catch (error) {
    return handleError(error, res);
  }
});

router.get("/id/:id", validateConnect, validMongooseId, async (req, res) => {
  const exists = await Password.exists({ _id: req.params.id });

  if (!exists) {
    return res.status(404).json({
      error: "Not found",
    });
  }

  return res.json(await Password.findById(req.params.id));
});

router.patch("/id/:id", validateConnect, validMongooseId, async (req, res) => {
  const { title, url, updatePassword } = req.body;
  const updated = {};

  const exists = await Password.exists({ _id: req.params.id });

  if (!exists) {
    return res.status(404).json({
      error: "Not found",
    });
  }

  if (!title && !url && !updatePassword) {
    return res.status(400).json({
      error: "Nothing to update",
    });
  }

  if (title) {
    const isDuplicated = await Password.exists({ title });

    if (isDuplicated) {
      return res.status(400).json({
        error: "Password with this title already exists",
      });
    }

    updated.title = title;
  }

  if (url) {
    if (url === "") {
      return res.status(400).json({
        error: "URL can't be empty",
      });
    }

    updated.url = url;
  }

  if (updatePassword) {
    const randomPassword = generateRandomPassword(
      DEFAULT_PASSOWRD_MINIMUM_LENGTH
    );
    const encryptedPassword = encrypt(randomPassword, process.env.SECRET_KEY);
    updated.password = encryptedPassword;
  }

  try {
    const result = await Password.findByIdAndUpdate(req.params.id, updated, {
      new: true,
    });
    result.password = decrypt(result.password);
    return res.json(result);
  } catch (error) {
    return handleError(error, res);
  }
});

router.delete("/id/:id", validateConnect, validMongooseId, (req, res) => {
  Password.findByIdAndDelete(req.params.id)
    .then((result) => {
      if (result === null) {
        return res.status(404).json({
          error: "Not found",
        });
      }
      return res.json({ info: "Deleted successfully" });
    })
    .catch((error) => {
      handleError(error, res);
    });
});

router.delete("/all", validateConnect, (req, res) => {
  Password.deleteMany({})
    .then((result) => {
      return res.json(result);
    })
    .catch((error) => {
      handleError(error, res);
    });
});

export { router };
