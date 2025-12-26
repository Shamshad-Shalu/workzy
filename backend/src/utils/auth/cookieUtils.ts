import { NODE_ENV, Role } from "@/constants";
import { Response } from "express";
import { generateRefreshToken } from "./jwt.util";

const isProd = NODE_ENV === "production";

export const setRefreshTokenCookie = (res: Response, payload: { _id: string; role: Role }) => {
  const refreshToken = generateRefreshToken(payload);

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "none" : "lax",
    path: "/",
  });
};

export const clearRefreshTokenCookie = (res: Response) => {
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "none" : "lax",
    path: "/",
  });
};
