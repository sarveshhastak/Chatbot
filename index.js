const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const path = require("path")
const cookieParser = require("cookie-parser")
const { userProtected } = require("./middleware/auth.middleware")
require("dotenv").config()


const app = express()
app.use(express.json())
app.use(cors({ origin: "https://chatbot-frontend-gamma-opal.vercel.app", credentials: true }))
app.use(cookieParser())
app.use("/api/auth", require("./routes/auth.route"))
app.use("/api/chat", userProtected, require("./routes/chat.route"))
app.use("*", (req, res) => {
    res.status(404).json({ message: "Resource Not Found !" })
})
app.use((err, req, res, next) => {
    console.log(err);
    res.status(500).json({ message: "Server Error !", error: err.message })
})
mongoose.connect(process.env.MONGO_URL)
mongoose.connection.once("open", () => {
    console.log("MongoDB Connected...");
    app.listen(process.env.PORT, console.log("Server Running..."))

})