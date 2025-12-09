import { NODE_ENV, Role } from "@/constants";
import { Response } from "express";
import { generateRefreshToken } from "./jwt.util";

export const setRefreshTokenCookie = (res: Response, payload: { _id: string; role: Role }) => {
  const refreshToken = generateRefreshToken(payload);

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: NODE_ENV === "production",
    sameSite: "strict",
  });
};

export const clearRefreshTokenCookie = (res: Response) => {
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    path: "/",
  });
};
