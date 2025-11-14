import { Container } from "inversify";
import { IAuthController } from "@/core/interfaces/controllers/IAuthController";
import { TYPES } from "./types";
import { AuthController } from "@/controllers/auth.controller";

const container = new Container();

container.bind<IAuthController>(TYPES.AuthController).to(AuthController);

export { container };
