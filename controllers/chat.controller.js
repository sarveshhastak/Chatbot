const asyncHandler = require("express-async-handler")
const Chat = require("../models/Chat")
const Groq = require("groq-sdk")
const groq = new Groq({ apiKey: process.env.GROK_API_KEY })

exports.createChat = asyncHandler(async (req, res) => {

    // Save user message
    const userMsg = await Chat.create({
        user: req.loggInUser,
        role: "user",
        message: req.body.message
    })

    // AI Reply
    const completion = await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",  //groq ai model
        messages: [
            { role: "system", content: "You are a helpful chatbot." },
            { role: "user", content: req.body.message }
        ]
    })

    const botReply = completion.choices[0]?.message?.content
        || "Sorry, I can't reply right now."

    const botMsg = await Chat.create({
        user: req.loggInUser,
        role: "bot",
        message: botReply
    })

    res.json({
        message: "Chat + AI Reply Success",
        user: userMsg,
        bot: botMsg
    })
})


exports.readChat = asyncHandler(async (req, res) => {
    console.log(req.loggInUser);

    const result = await Chat.find({ user: req.loggInUser }).sort({ createdAt: 1 })
    res.json({ message: "Chat Read Success", result })
})





