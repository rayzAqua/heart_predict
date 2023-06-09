import mongoose from "mongoose";
import passportLocalMongoose from "passport-local-mongoose";

const AccountSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    userInfo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

AccountSchema.plugin(passportLocalMongoose);
export default mongoose.model("Account", AccountSchema);
