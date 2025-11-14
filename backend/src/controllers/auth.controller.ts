import { IAuthController } from "@/core/interfaces/controllers/IAuthController";
import { injectable } from "inversify";
import asyncHandler from "express-async-handler";
import { Request, Response } from "express";

@injectable()
export class AuthController implements IAuthController {
  // Register a new user and send OTP to email
  register = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    console.log(req.body);
    res.status(201).json({ message: "User registered successfully" });
  });
}
