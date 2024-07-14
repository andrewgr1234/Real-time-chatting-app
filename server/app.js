const express = require("express");
const path = require("path");
const fs = require("fs");
const { profile } = require("console");
const app = express();
const port = 3001;

app.use(express.static("public"));
app.use(express.static("database"));
app.use(express.json());

const dbFilePath = path.join(__dirname, "../database/db.json");

let users = require(dbFilePath);

app.get("/users", (req, res) => {
  res.json(Object.values(users));
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/index.html"));
});

app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/login/index.html"));
});

app.get("/signup", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/signup/index.html"));
});

app.get("/home", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/home/index.html"));
});

app.post("/signup", (req, res) => {
  const { username, password, email } = req.body;
  let { profilePic } = req.body;

  if (!username || !password || !email) {
    return res
      .status(400)
      .json({ error: "A username, password and email are required." });
  } else if (!profilePic) {
    profilePic =
      "https://i.pinimg.com/736x/c0/27/be/c027bec07c2dc08b9df60921dfd539bd.jpg";
  }

  const existingUser = Object.values(users).find(
    (user) => user.username === username
  );

  if (existingUser) {
    return res.status(400).json({ error: "Username already exists." });
  }

  const existingEmail = Object.values(users).find(
    (user) => user.email === email
  );

  if (existingEmail) {
    return res.status(400).json({ error: "this email is already signed up." });
  }

  const userId = `user${Object.keys(users).length}`;
  users[userId] = {
    username,
    password,
    email,
    profilePic,
  };

  fs.writeFile(dbFilePath, JSON.stringify(users, null, 2), (err) => {
    if (err) {
      console.error("Error writing to db.json:", err);
      return res.status(500).json({ error: "Error saving user data." });
    }
    console.log("User signed up successfully:", username);
    res.status(200).json({ message: "User signed up successfully." });
  });
});

app.listen(port, () =>
  console.log(`Running on Port ${port} | http://localhost:${port}`)
);
