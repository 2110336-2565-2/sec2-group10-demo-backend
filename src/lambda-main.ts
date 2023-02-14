import { config } from 'dotenv';

import { LazyFramework } from '@h4ad/serverless-adapter/lib/frameworks/lazy';
import { ExpressFramework } from '@h4ad/serverless-adapter/lib/frameworks/express';
import { ServerlessAdapter } from '@h4ad/serverless-adapter';
import { PromiseResolver } from '@h4ad/serverless-adapter/lib/resolvers/promise';
import { DefaultHandler } from '@h4ad/serverless-adapter/lib/handlers/default';
import { ApiGatewayV2Adapter } from '@h4ad/serverless-adapter/lib/adapters/aws';
import { createApp } from './create-app';

config();

// Serverles
const getAppInstance = async () => {
  const nestApp = await createApp();

  await nestApp.init();

  const app = nestApp.getHttpAdapter().getInstance();

  return app;
};

const expressFramework = new ExpressFramework();
const framework = new LazyFramework(expressFramework, getAppInstance);

export const handler = ServerlessAdapter.new(null)
  .setFramework(framework)
  .setResolver(new PromiseResolver())
  .setHandler(new DefaultHandler())
  .addAdapter(new ApiGatewayV2Adapter())
  .build();
