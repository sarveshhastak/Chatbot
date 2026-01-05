const mongoose = require("mongoose")

module.exports = mongoose.model("chat", new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    role: { type: String, required: true },
    message: { type: String, required: true },
}, { timestamps: true }))