import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import session from "express-session";
import connectDB from "./mongoose.mjs";
import routes from "./routes.mjs";
import cookieParser from "cookie-parser";
import cors from "cors";
import fs from "fs";
import https from "https";

dotenv.config();

const app = express();
const port = 3001;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const privateKey = fs.readFileSync(
  path.join(__dirname, "./ssl/key.pem"),
  "utf8"
);
const certificate = fs.readFileSync(
  path.join(__dirname, "./ssl/cert.pem"),
  "utf8"
);
const credentials = { key: privateKey, cert: certificate };

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: true, 
      httpOnly: false, 
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
  })
);


app.use(
  cors({
    origin: `https://localhost:${port}`,
    credentials: true,
  })
);

app.use(cookieParser());

// Serve static files
app.use(express.static(path.join(__dirname, "../public")));
app.use("/src", express.static(path.join(__dirname, "../src")));

// Parse request bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Use routes
app.use("/", routes);

// Serve the main index.html for the root URL
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/index.html"));
});

const httpsServer = https.createServer(credentials, app);

connectDB()
  .then(() => {
    httpsServer.listen(port, () => {
      console.log(`Running on Port ${port} | https://localhost:${port}`);
    });
  })
  .catch((err) => console.log(err));
