import mongoose from "mongoose";

export function validMongooseId(req, res, next) {
  const id = req.params.id;

  if (!id) {
    return res.status(400).json({
      error: "ID is required",
    });
  }

  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({
      error: "Invalid ID",
    });
  }

  next();
}
