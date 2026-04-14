import { Participant } from "../entities/participant";

export interface ParticipantRepository {
  create(data: { name: string; email: string }): Promise<Participant>;
  findById(id: string): Promise<Participant | null>;
  findByEmail(email: string): Promise<Participant | null>;
}
