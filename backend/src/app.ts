import "reflect-metadata";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { CLIENT_URL } from "./constants";

import passport from "./config/passport";
import apiRouter from "./routes";
import errorMiddleware from "./middlewares/errorMiddleware";

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
app.use(passport.initialize());

app.use("/api", apiRouter);

app.use(errorMiddleware);

export default app;
