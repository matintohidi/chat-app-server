import './plugins/dotenv';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { enableSwagger } from './plugins/swagger';
import helmet from 'helmet';
import { useContainer } from 'class-validator';
import { NestExpressApplication } from '@nestjs/platform-express';
import { CORS_ORIGIN } from 'src/configs/app.config';
const { HELMET_ENABLE, SWAGGER_ENABLE, APP_PORT } = process.env;

const logger = new Logger('app');

process.on('unhandledRejection', (error) => {
  // eslint-disable-next-line no-console
  console.error(error);
});

process.on('uncaughtException', (error) => {
  // eslint-disable-next-line no-console
  console.error(error);
});

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  );

  app.enableCors({
    origin: CORS_ORIGIN,
    methods: '*',
    credentials: true,
  });

  if (HELMET_ENABLE === 'true') {
    app.use(helmet());
  }

  if (SWAGGER_ENABLE === 'true') {
    enableSwagger(app);
  }

  const PORT = APP_PORT || 1337;

  await app.listen(PORT);

  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  logger.verbose(`server started on  http://localhost:${PORT}`);
  logger.verbose(`swagger is available on http://localhost:${PORT}/swagger`);
}
bootstrap();
