import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import session from "express-session";
import mongoose from "mongoose";
import connectDB from "./mongoose.mjs";
import routes from "./routes.mjs";
import cookieParser from "cookie-parser";
import cors from "cors";

dotenv.config();

const app = express();
const port = 3001;

app.use(cookieParser());
app.use(express.static("public"));
app.use(express.static("database"));
app.use(express.static("src"));
app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

connectDB();

app.use(
  session({
    secret:
      process.env.SESSION_SECRET ||
      "94942517264ccf43bf6698c39a83d9b6577b31aacf2ef8ac9cbd85523e7362bd405d4c4180ea7325978cb5ba2836cec372aae5756897aec7e966a2527a95ba36",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }, // Set to true if you're using HTTPS
  })
);

app.use(
  cors({
    origin: "http://localhost:3001", // Adjust according to your setup
    credentials: true,
  })
);

app.use("/", routes);

app.listen(port, () =>
  console.log(`Running on Port ${port} | http://localhost:${port}`)
);
