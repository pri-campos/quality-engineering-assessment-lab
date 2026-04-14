import { FastifyInstance } from "fastify";
import { CancelEnrollmentUseCase } from "../../../application/use-cases/cancel-enrollment-use-case";
import { EnrollParticipantUseCase } from "../../../application/use-cases/enroll-participant-use-case";
import { PrismaEnrollmentRepository } from "../../../infrastructure/repositories/prisma-enrollment-repository";
import { PrismaParticipantRepository } from "../../../infrastructure/repositories/prisma-participant-repository";
import { PrismaWorkshopRepository } from "../../../infrastructure/repositories/prisma-workshop-repository";
import { createEnrollmentSchema, idParamSchema } from "../validators/enrollment-schemas";

export async function enrollmentRoutes(app: FastifyInstance) {
  app.post("/enrollments", async (request, reply) => {
    const input = createEnrollmentSchema.parse(request.body);

    const participantRepository = new PrismaParticipantRepository();
    const workshopRepository = new PrismaWorkshopRepository();
    const enrollmentRepository = new PrismaEnrollmentRepository();

    const useCase = new EnrollParticipantUseCase(
      participantRepository,
      workshopRepository,
      enrollmentRepository
    );

    const enrollment = await useCase.execute(input);

    return reply.status(201).send(enrollment.props);
  });

  app.patch("/enrollments/:id/cancel", async (request, reply) => {
    const { id } = idParamSchema.parse(request.params);

    const enrollmentRepository = new PrismaEnrollmentRepository();
    const useCase = new CancelEnrollmentUseCase(enrollmentRepository);

    const result = await useCase.execute(id);

    return reply.status(200).send(result);
  });
}
