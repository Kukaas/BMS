import mongoose from "mongoose";

const userVerificationSchema = new mongoose.Schema({
    userId: String,
    uniqueString: String,
    createdAt: Date,
    expireAt: Date,
});

const UserVerification = mongoose.model("UserVerification", userVerificationSchema);

export default UserVerification;
