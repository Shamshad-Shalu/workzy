import { Router } from "express";

import { ROLE } from "@/constants";
import { IQuoteController } from "@/core/interfaces/controllers/IQuoteController";
import { container } from "@/di/container";
import { TYPES } from "@/di/types";
import { CreateQuoteDto } from "@/dtos/requests/quote.dto";
import { authenticate } from "@/middlewares/auth.middleware";
import { validateDto } from "@/middlewares/validate-dto.middleware";

const router = Router();
const controller = container.get<IQuoteController>(TYPES.QuoteController);

router.use(authenticate([ROLE.USER, ROLE.WORKER]));

router.post("/", validateDto(CreateQuoteDto), controller.createQuote);

export default router;
