import { BillType, PaymentStatus } from "@/constants";
import { IPayment } from "@/types/payment/payment.entity";

class PaymentBaseDTO {
  id!: string;
  refId!: string;
  transactionId!: string;
  title!: string;
  amount!: number;
  status!: PaymentStatus;
  billType!: BillType;
  failureReason?: string;
  createdAt!: Date;

  static baseMap(entity: IPayment): PaymentBaseDTO {
    const dto = new PaymentBaseDTO();

    dto.id = entity._id.toString();
    dto.refId = entity.referenceId.toString();
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

export class PaymentUserDTO extends PaymentBaseDTO {
  workerId!: string;
  workerName!: string;

  static fromEntity(entity: IPayment): PaymentUserDTO {
    const dto = new PaymentUserDTO();

    Object.assign(dto, PaymentBaseDTO.baseMap(entity));

    dto.workerId = entity.workerId?.toString() ?? "";
    dto.workerName = entity.workerName ?? "";

    return dto;
  }

  static fromEntities(entities: IPayment[]): PaymentUserDTO[] {
    return entities.map((e) => this.fromEntity(e));
  }
}

export class PaymentWorkerDTO extends PaymentBaseDTO {
  userId!: string;
  userName!: string;
  workerAmount!: number | null;

  static fromEntity(entity: IPayment): PaymentWorkerDTO {
    const dto = new PaymentWorkerDTO();

    Object.assign(dto, PaymentBaseDTO.baseMap(entity));

    dto.userId = entity.userId?.toString() ?? "";
    dto.userName = entity.userName ?? "";
    dto.workerAmount = entity.workerAmount ?? null;

    return dto;
  }

  static fromEntities(entities: IPayment[]): PaymentWorkerDTO[] {
    return entities.map((e) => this.fromEntity(e));
  }
}

export class PaymentAdminDTO extends PaymentBaseDTO {
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

  static fromEntity(entity: IPayment): PaymentAdminDTO {
    const dto = new PaymentAdminDTO();

    Object.assign(dto, PaymentBaseDTO.baseMap(entity));

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

  static fromEntities(entities: IPayment[]): PaymentAdminDTO[] {
    return entities.map((e) => this.fromEntity(e));
  }
}
