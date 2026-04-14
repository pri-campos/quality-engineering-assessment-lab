import { Enrollment } from "../../domain/entities/enrollment";
import { EnrollmentRepository } from "../../domain/repositories/enrollment-repository";
import { prisma } from "../database/prisma";

export class PrismaEnrollmentRepository implements EnrollmentRepository {
  async create(data: {
    participantId: string;
    workshopId: string;
    status: "CONFIRMED" | "WAITLIST";
  }): Promise<Enrollment> {
    const enrollment = await prisma.enrollment.create({
      data
    });

    return new Enrollment(enrollment);
  }

  async findByParticipantAndWorkshop(
    participantId: string,
    workshopId: string
  ): Promise<Enrollment | null> {
    const enrollment = await prisma.enrollment.findFirst({
      where: {
        participantId,
        workshopId
      }
    });

    return enrollment ? new Enrollment(enrollment) : null;
  }

  async countConfirmedByWorkshop(workshopId: string): Promise<number> {
    return prisma.enrollment.count({
      where: {
        workshopId,
        status: "CONFIRMED"
      }
    });
  }

  async cancel(id: string): Promise<void> {
    await prisma.enrollment.update({
      where: { id },
      data: { status: "CANCELLED" }
    });
  }

  async findById(id: string): Promise<Enrollment | null> {
    const enrollment = await prisma.enrollment.findUnique({
      where: { id }
    });

    return enrollment ? new Enrollment(enrollment) : null;
  }

  async findFirstWaitlistedByWorkshop(workshopId: string): Promise<Enrollment | null> {
    const enrollment = await prisma.enrollment.findFirst({
      where: {
        workshopId,
        status: "WAITLIST"
      },
      orderBy: {
        createdAt: "asc"
      }
    });

    return enrollment ? new Enrollment(enrollment) : null;
  }

  async updateStatus(
    id: string,
    status: "CONFIRMED" | "WAITLIST" | "CANCELLED"
  ): Promise<void> {
    await prisma.enrollment.update({
      where: { id },
      data: { status }
    });
  }

  async listByWorkshop(workshopId: string): Promise<Enrollment[]> {
    const enrollments = await prisma.enrollment.findMany({
      where: { workshopId },
      orderBy: { createdAt: "asc" }
    });

    return enrollments.map((item) => new Enrollment(item));
  }
}
