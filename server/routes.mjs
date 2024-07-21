import express from "express";
import bcrypt from "bcryptjs";
import { fileURLToPath } from "url";
import path from "path";
import User from "./models/user.mjs";
import cookieParser from "cookie-parser";
import { getUserData } from "./controllers/userControllers.mjs";
import functions from "../src/public-functions.js";

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

router.use(cookieParser());

router.get("/join", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/join/index.html"));
});

router.get("/home", async (req, res) => {
  try {
    const userData = await functions.fetchUserData(req.session.userId);

    if (!userData) {
      return res.status(404).json({ message: "User not found" });
    }

    // Only send response once
    res.json(userData);
  } catch (error) {
    console.error("Error fetching user data:", error);
    // Ensure headers are not set after sending response
    if (!res.headersSent) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: "Username does not exist." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect password." });
    }

    req.session.userId = user._id;
    res.cookie("sessionId", req.session.userId.toString(), {
      httpOnly: false,
      secure: true,
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });
    res.redirect("/home");

    res.json({
      message: "Success",
      username: user.username,
      email: user.email,
      profilePic: user.profilePic,
    });
  } catch (err) {
    console.error("Server error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/signup", async (req, res) => {
  const { username, password, email } = req.body;
  let { profilePic } = req.body;

  if (!username || !password || !email) {
    return res
      .status(400)
      .json({ error: "A username, password, and email are required." });
  }

  if (!profilePic) {
    profilePic =
      "https://i.pinimg.com/736x/c0/27/be/c027bec07c2dc08b9df60921dfd539bd.jpg";
  }

  try {
    const existingUserByUsername = await User.findOne({ username });
    if (existingUserByUsername) {
      return res.status(400).json({ error: "Username already exists." });
    }

    const existingUserByEmail = await User.findOne({ email });
    if (existingUserByEmail) {
      return res
        .status(400)
        .json({ error: "This email is already signed up." });
    }

    const user = new User({ username, password, email, profilePic });
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    await user.save();

    res.status(201).json({ message: "User signed up successfully." });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server error" });
  }
});

router.post("/updateUserData", async (req, res) => {
  try {
    const { email, username, profilePic, currentPassword, newPassword } =
      req.body;

    // Get user ID from session cookie
    const userId = req.cookies.sessionId;
    if (!userId) {
      return res.status(400).json({ error: "No logged-in user found." });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    if (currentPassword && newPassword) {
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res
          .status(400)
          .json({ error: "Current password is incorrect." });
      }
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);
    }

    if (email) user.email = email;
    if (username) user.username = username;
    if (profilePic) user.profilePic = profilePic;

    await user.save();

    res.json(user);
  } catch (error) {
    console.error("Error updating user data:", error);
    res.status(500).json({ error: "Failed to update user data" });
  }
});

router.get("/getUserData", async (req, res) => {
  try {
    const userId = req.cookies.sessionId;
    if (!userId) {
      return res.status(400).json({ error: "No logged-in user found." });
    }

    const user = await getUserData(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    res.json(user);
  } catch (error) {
    console.error("Error fetching user data:", error);
    res.status(500).json({ error: "Failed to fetch user data" });
  }
});

router.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: "Failed to destroy session" });
    }

    res.clearCookie("connect.sid"); // Clear the session cookie
    res.clearCookie("sessionId"); // Clear any other cookies
    res.status(200).json({ message: "Logged out successfully" });
  });
});

export default router;
