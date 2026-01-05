const asyncHandler = require("express-async-handler")
const jwt = require("jsonwebtoken")
exports.userProtected = asyncHandler(async (req, res, next) => {
    const token = req.cookies.USER
    if (!token) {
        return res.status(401).json({ message: "No Cookie Found !" })
    }
    jwt.verify(token, process.env.JWT_KEY, (err, data) => {
        if (err) {
            return res.status(401).json({ message: "Invalid Token !", error: err.message })
        }
        req.loggInUser = data._id
        next()
    })

})