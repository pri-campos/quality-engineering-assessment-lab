import { FastifyError, FastifyReply, FastifyRequest } from "fastify";
import { ZodError } from "zod";
import { DomainError } from "../../domain/errors/domain-error";

export async function errorHandler(
  error: FastifyError | Error,
  _request: FastifyRequest,
  reply: FastifyReply
) {
  if (error instanceof ZodError) {
    return reply.status(400).send({
      message: "Validation failed",
      issues: error.issues
    });
  }

  if (error instanceof DomainError) {
    return reply.status(error.statusCode).send({
      message: error.message
    });
  }

  console.error(error);

  return reply.status(500).send({
    message: "Internal server error"
  });
}
