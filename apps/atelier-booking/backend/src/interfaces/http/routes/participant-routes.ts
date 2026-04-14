import { FastifyInstance } from "fastify";
import { CreateParticipantUseCase } from "../../../application/use-cases/create-participant-use-case";
import { PrismaParticipantRepository } from "../../../infrastructure/repositories/prisma-participant-repository";
import { createParticipantSchema } from "../validators/participant-schemas";

export async function participantRoutes(app: FastifyInstance) {
  app.post("/participants", async (request, reply) => {
    const input = createParticipantSchema.parse(request.body);

    const participantRepository = new PrismaParticipantRepository();
    const useCase = new CreateParticipantUseCase(participantRepository);

    const participant = await useCase.execute(input);

    return reply.status(201).send(participant.props);
  });
}
