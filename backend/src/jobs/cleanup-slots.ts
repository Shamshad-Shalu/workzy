import cron from "node-cron";

import logger from "@/config/logger";
import { ISlotService } from "@/core/interfaces/services/ISlotService";
import { container } from "@/di/container";
import { TYPES } from "@/di/types";

const slotService = container.get<ISlotService>(TYPES.SlotService);

export function startCleanupJob() {
  cron.schedule("*/5 * * * *", async () => {
    try {
      const count = await slotService.cleanupExpired();
      if (count > 0) logger.info(`Cleaned ${count} expired slot reservations`);
    } catch (error) {
      logger.error("Error cleaning up expired slot reservations:", error);
    }
  });
}
