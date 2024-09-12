import mongoose from "mongoose";

const passwordSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    trim: true,
    minlength: 16,
  },
  url: {
    type: String,
    required: false,
    trim: true,
    default: null,
  },
  icon: {
    type: Boolean,
    default: false,
  },
});

export const Password = mongoose.model("Password", passwordSchema);
