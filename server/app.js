const express = require("express");
const path = require("path");
const fs = require("fs");
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
  res.sendFile(path.join(__dirname, "../public/login/index.html"));
});

app.get("/signup", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/signup/index.html"));
});

app.get("/home", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/home/index.html"));
});

app.post("/signup", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ error: "Username and password are required." });
  }

  const existingUser = Object.values(users).find(
    (user) => user.username === username
  );

  if (existingUser) {
    return res.status(400).json({ error: "Username already exists." });
  }

  const userId = `user${Object.keys(users).length}`;
  users[userId] = {
    username,
    password,
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
