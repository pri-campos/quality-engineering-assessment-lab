import { NotFoundError } from "../../domain/errors/not-found-error";
import { EnrollmentRepository } from "../../domain/repositories/enrollment-repository";
import { WorkshopRepository } from "../../domain/repositories/workshop-repository";

export class GetWorkshopDetailsUseCase {
  constructor(
    private readonly workshopRepository: WorkshopRepository,
    private readonly enrollmentRepository: EnrollmentRepository
  ) {}

  async execute(workshopId: string) {
    const workshop = await this.workshopRepository.findById(workshopId);

    if (!workshop) {
      throw new NotFoundError("Workshop not found");
    }

    const enrollments = await this.enrollmentRepository.listByWorkshop(workshopId);

    return {
      id: workshop.props.id,
      title: workshop.props.title,
      description: workshop.props.description,
      capacity: workshop.props.capacity,
      scheduledAt: workshop.props.scheduledAt,
      summary: {
        confirmed: enrollments.filter((item) => item.props.status === "CONFIRMED").length,
        waitlist: enrollments.filter((item) => item.props.status === "WAITLIST").length,
        cancelled: enrollments.filter((item) => item.props.status === "CANCELLED").length
      },
      enrollments: enrollments.map((item) => ({
        id: item.props.id,
        participantId: item.props.participantId,
        status: item.props.status,
        createdAt: item.props.createdAt
      }))
    };
  }
}
