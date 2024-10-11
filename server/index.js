import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import postRoutes from "./routes/postRoutes.js";

const config = dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/api", authRoutes);
app.use("/api", userRoutes);
app.use("/api", postRoutes);

app.get("/", (req, res) => {
  res.status(200).json({ message: "Server is running..." });
});

app.listen(PORT, () => {
  console.log(`Server is running...`);
});
