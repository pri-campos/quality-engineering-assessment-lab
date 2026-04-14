import { Participant } from "../../domain/entities/participant";
import { ParticipantRepository } from "../../domain/repositories/participant-repository";
import { prisma } from "../database/prisma";

export class PrismaParticipantRepository implements ParticipantRepository {
  async create(data: { name: string; email: string }): Promise<Participant> {
    const participant = await prisma.participant.create({
      data
    });

    return new Participant(participant);
  }

  async findById(id: string): Promise<Participant | null> {
    const participant = await prisma.participant.findUnique({
      where: { id }
    });

    return participant ? new Participant(participant) : null;
  }

  async findByEmail(email: string): Promise<Participant | null> {
    const participant = await prisma.participant.findUnique({
      where: { email }
    });

    return participant ? new Participant(participant) : null;
  }
}
