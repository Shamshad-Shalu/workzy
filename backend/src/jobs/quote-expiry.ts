import cron from "node-cron";

import logger from "@/config/logger";
import { IQuoteService } from "@/core/interfaces/services/IQuoteService";
import { container } from "@/di/container";
import { TYPES } from "@/di/types";

const quoteService = container.get<IQuoteService>(TYPES.QuoteService);

export function startQuoteExpiryJob() {
  cron.schedule("0 3 * * *", async () => {
    try {
      const count = await quoteService.expireQuotes();
      if (count > 0) logger.info(`Expired ${count} pending quotes`);
    } catch (error) {
      logger.error("Error expiring quotes:", error);
    }
  });
}
