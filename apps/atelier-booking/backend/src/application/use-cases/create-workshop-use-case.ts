import { CreateWorkshopDTO } from "../dto/create-workshop-dto";
import { ValidationError } from "../../domain/errors/validation-error";
import { WorkshopRepository } from "../../domain/repositories/workshop-repository";

export class CreateWorkshopUseCase {
  constructor(private readonly workshopRepository: WorkshopRepository) {}

  async execute(input: CreateWorkshopDTO) {
    if (input.capacity <= 0) {
      throw new ValidationError("Workshop capacity must be greater than zero");
    }

    return this.workshopRepository.create({
      title: input.title,
      description: input.description,
      capacity: input.capacity,
      scheduledAt: new Date(input.scheduledAt)
    });
  }
}
