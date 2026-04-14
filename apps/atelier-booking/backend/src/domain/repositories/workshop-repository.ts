import { Workshop } from "../entities/workshop";

export interface WorkshopRepository {
  create(data: {
    title: string;
    description: string;
    capacity: number;
    scheduledAt: Date;
  }): Promise<Workshop>;
  findById(id: string): Promise<Workshop | null>;
}
