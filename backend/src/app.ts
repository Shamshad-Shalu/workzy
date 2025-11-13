import "reflect-metadata";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { CLIENT_URL } from "./constants";

const app = express();

const allowedOrigins = [CLIENT_URL, "http://13.204.5.195:5173"].filter(Boolean) as string[];

const corsOptions = {
  origin: allowedOrigins,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/api/", (req, res) => {
  res.json({ message: "hlo this is backend" });
});

export default app;
