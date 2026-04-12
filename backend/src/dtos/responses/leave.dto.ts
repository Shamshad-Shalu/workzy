import { ILeave, LeaveLean } from "@/types/leave";

export class LeaveResponseDTO {
  id!: string;
  startDate!: Date;
  endDate!: Date;
  reason?: string;

  static fromEntity(entity: ILeave | LeaveLean): LeaveResponseDTO {
    const dto = new LeaveResponseDTO();

    dto.id = entity._id.toString();
    dto.startDate = entity.startDate;
    dto.endDate = entity.endDate;
    dto.reason = entity.reason;
    return dto;
  }
  static fromEntities(entities: LeaveLean[]) {
    return entities.map((entity) => this.fromEntity(entity));
  }
}
