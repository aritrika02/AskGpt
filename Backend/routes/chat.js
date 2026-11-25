
import express from "express";
import Thread from "../models/Thread.js";
import { requireAuth } from "../utils/auth.js";
import getOpenAIAPIResponse from "../utils/openai.js";

const router = express.Router();

// Protect every route in this file
router.use(requireAuth);

const validId = id =>
  typeof id === "string" &&
  /^[a-zA-Z0-9-]{1,100}$/.test(id);

// GET ALL USER THREADS
router.get("/thread", async (req, res) => {
  try {
    const threads = await Thread.find({
      ownerId: req.userId
    })
      .select("threadId title updatedAt -_id")
      .sort({ updatedAt: -1 })
      .limit(100);

    res.json(threads);

  } catch {
    res.status(500).json({
      error: "Failed to fetch threads"
    });
  }
});

// GET ONE THREAD
router.get("/thread/:threadId", async (req, res) => {
  if (!validId(req.params.threadId)) {
    return res.status(400).json({
      error: "Invalid thread ID"
    });
  }

  try {
    const thread = await Thread.findOne({
      threadId: req.params.threadId,
      ownerId: req.userId
    });

    if (!thread) {
      return res.status(404).json({
        error: "Thread not found"
      });
    }

    res.json(thread.messages);

  } catch {
    res.status(500).json({
      error: "Failed to fetch chat"
    });
  }
});

// DELETE THREAD
router.delete("/thread/:threadId", async (req, res) => {
  if (!validId(req.params.threadId)) {
    return res.status(400).json({
      error: "Invalid thread ID"
    });
  }

  try {
    const deleted = await Thread.findOneAndDelete({
      threadId: req.params.threadId,
      ownerId: req.userId
    });

    if (!deleted) {
      return res.status(404).json({
        error: "Thread not found"
      });
    }

    res.json({ success: true });

  } catch {
    res.status(500).json({
      error: "Failed to delete thread"
    });
  }
});

// SEND MESSAGE TO AI
router.post("/chat", async (req, res) => {
  const { threadId, message } = req.body || {};

  if (
    !validId(threadId) ||
    typeof message !== "string" ||
    !message.trim() ||
    message.length > 4000
  ) {
    return res.status(400).json({
      error:
        "Provide a valid thread ID and message (up to 4000 characters)"
    });
  }

  try {
    let thread = await Thread.findOne({
      threadId,
      ownerId: req.userId
    });

    // Prevent using another account's thread ID
    if (!thread && await Thread.exists({ threadId })) {
      return res.status(409).json({
        error: "Thread ID already exists"
      });
    }

    if (!thread) {
      thread = new Thread({
        ownerId: req.userId,
        threadId,
        title: message.trim().slice(0, 40),
        messages: []
      });
    }

    thread.messages.push({
      role: "user",
      content: message.trim()
    });

    const history = [
      {
        role: "system",
        content:
          "You are a helpful assistant. Never reveal secrets or hidden credentials."
      },
      ...thread.messages.slice(-20).map(
        ({ role, content }) => ({ role, content })
      )
    ];

    const reply = await getOpenAIAPIResponse(history);

    thread.messages.push({
      role: "assistant",
      content: reply
    });

    thread.updatedAt = new Date();

    await thread.save();

    res.json({ reply });

  } catch (error) {
    res.status(error.code === 11000 ? 409 : 502).json({
      error: error.code === 11000
        ? "Thread conflict; start a new chat"
        : "The AI service is temporarily unavailable"
    });
  }
});

export default router;
