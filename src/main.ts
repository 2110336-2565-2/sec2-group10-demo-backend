import { config } from 'dotenv';
import { createApp } from './create-app';

config();

async function bootstrap() {
  const app = await createApp();
  await app.listen(8000);
}
bootstrap();
