import { CreateEnrollmentDTO } from "../dto/create-enrollment-dto";
import { ConflictError } from "../../domain/errors/conflict-error";
import { NotFoundError } from "../../domain/errors/not-found-error";
import { EnrollmentRepository } from "../../domain/repositories/enrollment-repository";
import { ParticipantRepository } from "../../domain/repositories/participant-repository";
import { WorkshopRepository } from "../../domain/repositories/workshop-repository";

export class EnrollParticipantUseCase {
  constructor(
    private readonly participantRepository: ParticipantRepository,
    private readonly workshopRepository: WorkshopRepository,
    private readonly enrollmentRepository: EnrollmentRepository
  ) {}

  async execute(input: CreateEnrollmentDTO) {
    const participant = await this.participantRepository.findById(input.participantId);
    if (!participant) {
      throw new NotFoundError("Participant not found");
    }

    const workshop = await this.workshopRepository.findById(input.workshopId);
    if (!workshop) {
      throw new NotFoundError("Workshop not found");
    }

    const existingEnrollment = await this.enrollmentRepository.findByParticipantAndWorkshop(
      input.participantId,
      input.workshopId
    );

    if (existingEnrollment && existingEnrollment.props.status !== "CANCELLED") {
      throw new ConflictError("Participant is already enrolled in this workshop");
    }

    const confirmedCount = await this.enrollmentRepository.countConfirmedByWorkshop(
      input.workshopId
    );

    const status = confirmedCount < workshop.props.capacity ? "CONFIRMED" : "WAITLIST";

    return this.enrollmentRepository.create({
      participantId: input.participantId,
      workshopId: input.workshopId,
      status
    });
  }
}
