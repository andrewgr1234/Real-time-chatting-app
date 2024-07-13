const express = require("express");
const path = require("path");
const app = express();
const port = 3001;

app.use(express.static("public"));
app.use(express.static("database"));
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/main/index.html"));
});

app.listen(port, () =>
  console.log(`Running on Port ${port} | http://localhost:${port}`)
);
