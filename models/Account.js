import mongoose from "mongoose";

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
            unique: true,
        },
        userInfo: {
            type: String,
            ref: "User"
        }
    },
    { timestamps: true }
);

export default mongoose.Model("Account", AccountSchema);