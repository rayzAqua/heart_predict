import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: String,
    },
    gender: {
      type: String,
      required: true,
    },
    birthDay: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
      unique: true,
    },
    familyPhoneNumber: {
      type: String,
      required: true,
      unique: true,
    },
    height: {
      type: String,
      required: true,
    },
    weight: {
      type: String,
      required: true,
    },
    history: {
      type: [String],
      ref: "History",
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", UserSchema);
