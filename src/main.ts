// prettier-ignore
import { config } from "dotenv";

config(); // Don't move this line

import { createApp } from "./create-app";



async function bootstrap() {
  const app = await createApp();
  await app.listen(8000);
}
bootstrap();
