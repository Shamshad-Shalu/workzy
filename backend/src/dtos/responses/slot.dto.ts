import { SlotOption } from "@/types/slot";

export class SlotOptionResponseDto {
  id!: string;
  date!: Date;
  startTime!: string;
  endTime!: string;
  isFullDay!: boolean;
  duration!: number;

  static fromEntity(entity: SlotOption): SlotOptionResponseDto {
    const dto = new SlotOptionResponseDto();

    dto.id = entity._id.toString();
    dto.date = entity.date;
    dto.startTime = entity.startTime;
    dto.endTime = entity.endTime;
    dto.duration = entity.duration;
    dto.isFullDay = entity.isFullDay;
    return dto;
  }
  static fromEntities(entities: SlotOption[]) {
    return entities.map((entity) => this.fromEntity(entity));
  }
}
