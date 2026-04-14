import { NotFoundError } from "../../domain/errors/not-found-error"; 
import { EnrollmentRepository } from "../../domain/repositories/enrollment-repository";

export class CancelEnrollmentUseCase {
  constructor(private readonly enrollmentRepository: EnrollmentRepository) {}

  async execute(enrollmentId: string) {
    const enrollment = await this.enrollmentRepository.findById(enrollmentId);

    if (!enrollment) {
      throw new NotFoundError("Enrollment not found");
    }

    if (enrollment.props.status === "CANCELLED") {
      return {
        message: "Enrollment already cancelled"
      };
    }

    await this.enrollmentRepository.updateStatus(enrollmentId, "CANCELLED");

    if (enrollment.props.status === "CONFIRMED") {
      const nextWaitlisted = await this.enrollmentRepository.findFirstWaitlistedByWorkshop(
        enrollment.props.workshopId
      );

      if (nextWaitlisted) {
        await this.enrollmentRepository.updateStatus(nextWaitlisted.props.id, "CONFIRMED");
      }
    }

    return {
      message: "Enrollment cancelled successfully"
    };
  }
}
