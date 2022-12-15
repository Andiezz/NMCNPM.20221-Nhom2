const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema(
    {
        role: {
            type: String,
            required: true,
            enum: ["admin", "leader", "accountant"],
        },
        status: {
            type: Boolean,
            required: true,
            default: 1,
        },
        citizen_id: {
            type: Schema.Types.ObjectId,
            ref: "Citizen",
            required: true,
        },
        phone: {
            type: String,
            required: true,
        },
        password: {
            type: String,
            required: true,
            min: 8,
        },
        refreshToken: String,
        resetToken: String,
        resetTokenExpiration: String,
    },
    { timestamps: true }
);

module.exports = mongoose.model("User", userSchema)
