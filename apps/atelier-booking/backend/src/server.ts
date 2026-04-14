import { buildApp } from "./app";

const app = buildApp();
const port = Number(process.env.PORT ?? 3333);

app
  .listen({ port, host: "0.0.0.0" })
  .then(() => {
    console.log(`Server running on port ${port}`);
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
