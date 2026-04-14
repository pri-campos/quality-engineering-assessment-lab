import { CreateParticipantDTO } from "../dto/create-participant-dto";
import { ConflictError } from "../../domain/errors/conflict-error";
import { ParticipantRepository } from "../../domain/repositories/participant-repository";

export class CreateParticipantUseCase {
  constructor(private readonly participantRepository: ParticipantRepository) {}

  async execute(input: CreateParticipantDTO) {
    const existingParticipant = await this.participantRepository.findByEmail(input.email);

    if (existingParticipant) {
      throw new ConflictError("Participant email already exists");
    }

    return this.participantRepository.create(input);
  }
}
