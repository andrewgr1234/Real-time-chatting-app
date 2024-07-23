import express from "express";
import bcrypt from "bcryptjs";
import { fileURLToPath } from "url";
import path from "path";
import User from "./models/user.mjs";
import cookieParser from "cookie-parser";
import { getUserData } from "./controllers/userControllers.mjs";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

router.use(cookieParser());

router.get("/join", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/join/index.html"));
});

router.get("/home", async (req, res) => {
  res.sendFile(path.join(__dirname, "../public/home/index.html"));
});

router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) {
      console.log("User not found");
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      console.log("Password does not match");
      return res.status(401).json({ message: "Invalid credentials" });
    }

    req.session.userId = user._id.toString();

    res.cookie("sessionId", user._id.toString(), {
      httpOnly: false,
      secure: false,
      maxAge: 24 * 60 * 60 * 1000,
    });

    return res.json({ message: "Login successful", user });
  } catch (error) {
    console.error("Login error:", error);
    if (!res.headersSent) {
      return res.status(500).json({ message: "Internal Server Error" });
    }
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
    profilePic = process.env.DEFAULT_PROFILE_PICTURE;
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

router.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: "Error logging out" });
    }

    for (let cookieName in req.cookies) {
      res.clearCookie(cookieName);
    }

    res.json({ message: "Logged out successfully" });
  });
});

router.post("/deleteUser", async (req, res) => {
  try {
    const userId = req.cookies.sessionId;
    if (!userId) {
      return res.status(400).json({ message: "No logged-in user found." });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    await User.deleteOne({ _id: userId });

    req.session.destroy((err) => {
      if (err) {
        return res
          .status(500)
          .json({ message: "Error logging out after deletion" });
      }

      for (let cookieName in req.cookies) {
        res.clearCookie(cookieName);
      }

      res.json({ message: "User deleted successfully" });
    });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.post("/updateUserData", async (req, res) => {
  try {
    const { email, username, profilePic, currentPassword, newPassword } =
      req.body;

    const userId = req.cookies.sessionId;
    if (!userId) {
      return res.status(400).json({ error: "No logged-in user found." });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    if (email && email !== user.email) {
      const existingUserByEmail = await User.findOne({ email });
      if (existingUserByEmail) {
        return res.status(400).json({ error: "Email already in use." });
      }
    }

    if (username && username !== user.username) {
      const existingUserByUsername = await User.findOne({ username });
      if (existingUserByUsername) {
        return res.status(400).json({ error: "Username already in use." });
      }
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

export default router;
