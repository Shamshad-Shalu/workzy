import nodemailer from "nodemailer";

import { NODEMAILER_EMAIL, NODEMAILER_PASSWORD } from "@/constants";

export const transporter = nodemailer.createTransport({
  service: "gmail",
  port: 587,
  secure: false,
  requireTLS: true,
  auth: {
    user: NODEMAILER_EMAIL,
    pass: NODEMAILER_PASSWORD,
  },
});
