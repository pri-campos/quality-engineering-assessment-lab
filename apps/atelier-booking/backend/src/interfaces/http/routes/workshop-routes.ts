import { FastifyInstance } from "fastify";
import { CreateWorkshopUseCase } from "../../../application/use-cases/create-workshop-use-case";
import { GetWorkshopDetailsUseCase } from "../../../application/use-cases/get-workshop-details-use-case";
import { PrismaEnrollmentRepository } from "../../../infrastructure/repositories/prisma-enrollment-repository";
import { PrismaWorkshopRepository } from "../../../infrastructure/repositories/prisma-workshop-repository";
import { createWorkshopSchema } from "../validators/workshop-schemas";
import { idParamSchema } from "../validators/enrollment-schemas";

export async function workshopRoutes(app: FastifyInstance) {
  app.post("/workshops", async (request, reply) => {
    const input = createWorkshopSchema.parse(request.body);

    const workshopRepository = new PrismaWorkshopRepository();
    const useCase = new CreateWorkshopUseCase(workshopRepository);

    const workshop = await useCase.execute(input);

    return reply.status(201).send(workshop.props);
  });

  app.get("/workshops/:id", async (request, reply) => {
    const { id } = idParamSchema.parse(request.params);

    const workshopRepository = new PrismaWorkshopRepository();
    const enrollmentRepository = new PrismaEnrollmentRepository();

    const useCase = new GetWorkshopDetailsUseCase(
      workshopRepository,
      enrollmentRepository
    );

    const details = await useCase.execute(id);

    return reply.status(200).send(details);
  });
}
