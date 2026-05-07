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

router.get("/worker", authenticate([ROLE.WORKER]), controller.listWorkerQuotes);
router.get("/worker/stats", authenticate([ROLE.WORKER]), controller.getWokerQuoteStats);
router.use(authenticate([ROLE.USER, ROLE.WORKER]));

router.post("/:quoteId/accept", controller.acceptQuote);
router.post("/:quoteId/reject", controller.rejectQuote);
router.get("/user", controller.listUserQuotes);
router.post("/", validateDto(CreateQuoteDto), controller.createQuote);

export default router;
