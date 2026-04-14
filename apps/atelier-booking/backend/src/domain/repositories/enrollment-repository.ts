import { Enrollment } from "../entities/enrollment";

export interface EnrollmentRepository {
  create(data: {
    participantId: string;
    workshopId: string;
    status: "CONFIRMED" | "WAITLIST";
  }): Promise<Enrollment>;

  findByParticipantAndWorkshop(
    participantId: string,
    workshopId: string
  ): Promise<Enrollment | null>;

  countConfirmedByWorkshop(workshopId: string): Promise<number>;

  cancel(id: string): Promise<void>;

  findById(id: string): Promise<Enrollment | null>;

  findFirstWaitlistedByWorkshop(workshopId: string): Promise<Enrollment | null>;

  updateStatus(id: string, status: "CONFIRMED" | "WAITLIST" | "CANCELLED"): Promise<void>;

  listByWorkshop(workshopId: string): Promise<Enrollment[]>;
}
