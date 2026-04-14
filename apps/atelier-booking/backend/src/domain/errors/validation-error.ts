import { DomainError } from "./domain-error";

export class ValidationError extends DomainError {
  constructor(message: string) {
    super(message, 422);
    this.name = "ValidationError";
  }
}
