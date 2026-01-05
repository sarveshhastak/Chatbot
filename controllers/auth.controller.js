const asyncHandler = require("express-async-handler")
const User = require("../models/User")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")


exports.registerUser = asyncHandler(async (req, res) => {
    const { email, mobile, password } = req.body
    const result = await User.findOne({ $or: [{ email }, { mobile }] })
    if (result) {
        return res.status(401).json({ message: "Email or Mobile Already Exist !" })
    }
    const hash = await bcrypt.hash(password, 10)
    await User.create({ ...req.body, password: hash })
    res.json({ message: "User Register Success" })
})


exports.loginUser = asyncHandler(async (req, res) => {
    const { username, password } = req.body
    const result = await User.findOne({ $or: [{ email: username }, { mobile: username }] })
    if (!result) {
        return res.status(401).json({ message: "Email or Mobile Does Not Exist !" })
    }
    const verify = await bcrypt.compare(password, result.password)
    if (!verify) {
        return res.status(401).json({ message: "Invalid Password !" })
    }
    const token = jwt.sign({ _id: result._id, name: result.name }, process.env.JWT_KEY)
    res.cookie("USER", token, { maxAge: 1000 * 60 * 60 * 24, httpOnly: true, secure: false, sameSite: "none" })
    res.json({
        message: "User Login Success", result: {
            _id: result._id,
            name: result.name,
            email: result.email,
        }
    })
})
exports.logoutUser = asyncHandler(async (req, res) => {
    res.clearCookie("USER")
    res.json({ message: "User Logout Success" })
})



