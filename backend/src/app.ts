import "reflect-metadata";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";

import passport from "./config/passport";
import { CLIENT_URL, DUMMY_URL } from "./constants";
import errorMiddleware from "./middlewares/errorMiddleware";
import apiRouter from "./routes";

const app = express();

const allowedOrigins = [CLIENT_URL, DUMMY_URL, "http://13.204.5.195:5173"].filter(
  Boolean
) as string[];

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
