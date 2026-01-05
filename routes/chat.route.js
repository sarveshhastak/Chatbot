const { createChat, readChat } = require("../controllers/chat.controller")

const router = require("express").Router()
router
    .post("/create", createChat)
    .get("/read", readChat)

module.exports = router