
import express from "express";
import User from "../models/User.js";

import {
  generateSalt,
  hashPassword,
  verifyPassword,
  makeToken,
  requireAuth
} from "../utils/auth.js";

const router = express.Router();

// REGISTER
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body || {};

  if (
    typeof name !== "string" ||
    !name.trim() ||
    name.length > 80 ||
    typeof email !== "string" ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
    typeof password !== "string" ||
    password.length < 10 ||
    password.length > 128
  ) {
    return res.status(400).json({
      error:
        "Enter a name, valid email and password (10–128 characters)"
    });
  }

  try {
    const salt = generateSalt();

    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      salt,
      passwordHash: hashPassword(password, salt)
    });

    res.status(201).json({
      token: makeToken(user.id),
      user: {
        name: user.name,
        email: user.email
      }
    });

  } catch (error) {
    res.status(error.code === 11000 ? 409 : 500).json({
      error: error.code === 11000
        ? "Email already registered"
        : "Registration failed"
    });
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  const { email, password } = req.body || {};

  if (
    typeof email !== "string" ||
    typeof password !== "string"
  ) {
    return res.status(400).json({
      error: "Email and password required"
    });
  }

  try {
    const user = await User.findOne({
      email: email.trim().toLowerCase()
    });

    if (
      !user ||
      !verifyPassword(
        password,
        user.salt,
        user.passwordHash
      )
    ) {
      return res.status(401).json({
        error: "Invalid email or password"
      });
    }

    res.json({
      token: makeToken(user.id),
      user: {
        name: user.name,
        email: user.email
      }
    });

  } catch {
    res.status(500).json({
      error: "Login failed"
    });
  }
});

// CURRENT USER
router.get("/me", requireAuth, async (req, res) => {
  const user = await User.findById(req.userId)
    .select("name email");

  if (!user) {
    return res.status(401).json({
      error: "Account not found"
    });
  }

  res.json({ user });
});

export default router;
