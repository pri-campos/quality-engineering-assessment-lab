import { Workshop } from "../../domain/entities/workshop";
import { WorkshopRepository } from "../../domain/repositories/workshop-repository";
import { prisma } from "../database/prisma";

export class PrismaWorkshopRepository implements WorkshopRepository {
  async create(data: {
    title: string;
    description: string;
    capacity: number;
    scheduledAt: Date;
  }): Promise<Workshop> {
    const workshop = await prisma.workshop.create({
      data
    });

    return new Workshop(workshop);
  }

  async findById(id: string): Promise<Workshop | null> {
    const workshop = await prisma.workshop.findUnique({
      where: { id }
    });

    return workshop ? new Workshop(workshop) : null;
  }
}
