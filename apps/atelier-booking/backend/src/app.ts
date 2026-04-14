import Fastify from "fastify";
import { participantRoutes } from "./interfaces/http/routes/participant-routes";
import { workshopRoutes } from "./interfaces/http/routes/workshop-routes";
import { enrollmentRoutes } from "./interfaces/http/routes/enrollment-routes";
import { errorHandler } from "./shared/http/error-handler";

export function buildApp() {
  const app = Fastify();

  app.get("/health", async () => {
    return { status: "ok" };
  });

  app.register(participantRoutes, { prefix: "/api" });
  app.register(workshopRoutes, { prefix: "/api" });
  app.register(enrollmentRoutes, { prefix: "/api" });

  app.setErrorHandler(errorHandler);

  return app;
}
