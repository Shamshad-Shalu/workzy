import { BillType, PaymentStatus } from "@/constants";
import { IPayment } from "@/types/payment/payment.entity";

class PaymentBaseDto {
  id!: string;
  refId!: string;
  transactionId!: string;
  title!: string;
  amount!: number;
  status!: PaymentStatus;
  billType!: BillType;
  failureReason?: string;
  createdAt!: Date;

  static mapBase(entity: IPayment): PaymentBaseDto {
    const dto = new PaymentBaseDto();

    dto.id = entity._id.toString();
    dto.refId = entity.bookingId.toString();
    dto.transactionId = entity.transactionId;
    dto.title = entity.title ?? "";
    dto.amount = entity.amount;
    dto.status = entity.status;
    dto.billType = entity.billType;
    dto.failureReason = entity.failureReason;
    dto.createdAt = entity.createdAt;
    return dto;
  }
}

export class PaymentUserDto extends PaymentBaseDto {
  workerId!: string;
  workerName!: string;

  static fromEntity(entity: IPayment): PaymentUserDto {
    const dto = new PaymentUserDto();

    Object.assign(dto, PaymentBaseDto.mapBase(entity));

    dto.workerId = entity.workerId?.toString() ?? "";
    dto.workerName = entity.workerName ?? "";

    return dto;
  }

  static fromEntities(entities: IPayment[]): PaymentUserDto[] {
    return entities.map((e) => this.fromEntity(e));
  }
}

export class PaymentWorkerDto extends PaymentBaseDto {
  userId!: string;
  userName!: string;
  workerAmount!: number | null;

  static fromEntity(entity: IPayment): PaymentWorkerDto {
    const dto = new PaymentWorkerDto();

    Object.assign(dto, PaymentBaseDto.mapBase(entity));

    dto.userId = entity.userId?.toString() ?? "";
    dto.userName = entity.userName ?? "";
    dto.workerAmount = entity.workerAmount ?? null;

    return dto;
  }

  static fromEntities(entities: IPayment[]): PaymentWorkerDto[] {
    return entities.map((e) => this.fromEntity(e));
  }
}

export class PaymentAdminDto extends PaymentBaseDto {
  user!: {
    id: string;
    name: string;
  };
  worker!: {
    id: string;
    name: string;
  };
  workerAmount!: number | null;
  platformFee!: number | null;

  static fromEntity(entity: IPayment): PaymentAdminDto {
    const dto = new PaymentAdminDto();

    Object.assign(dto, PaymentBaseDto.mapBase(entity));

    dto.worker = {
      id: entity.workerId?.toString() ?? "",
      name: entity.workerName ?? "",
    };
    dto.user = {
      id: entity.userId?.toString() ?? "",
      name: entity.userName ?? "",
    };
    dto.platformFee = entity.platformFee ?? null;
    dto.workerAmount = entity.workerAmount ?? null;
    return dto;
  }

  static fromEntities(entities: IPayment[]): PaymentAdminDto[] {
    return entities.map((e) => this.fromEntity(e));
  }
}
