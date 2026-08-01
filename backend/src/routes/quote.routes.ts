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

router.get("/", authenticate([ROLE.USER, ROLE.WORKER, ROLE.ADMIN]), controller.listQuotes);
router.get("/worker/stats", authenticate([ROLE.WORKER]), controller.getWorkerQuoteStats);

router.post("/", authenticate([ROLE.WORKER]), validateDto(CreateQuoteDto), controller.createQuote);

router.use(authenticate([ROLE.USER]));
router.post("/:quoteId/accept", controller.acceptQuote);
router.post("/:quoteId/reject", controller.rejectQuote);

export default router;
