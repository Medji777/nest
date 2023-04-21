import { NestFactory } from '@nestjs/core';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { AppModule } from './app/app.module';
import { HttpExceptionFilter } from './utils/filters/httpException.filter';
import { settings } from './config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      stopAtFirstError: true,
      exceptionFactory: (errors) => {
        const errorsForResponse = [];
        errors.forEach((e) => {
          const constraintsKey = Object.keys(e.constraints);
          constraintsKey.forEach((key) => {
            errorsForResponse.push({
              message: e.constraints[key],
              field: e.property,
            });
          });
        });
        throw new BadRequestException(errorsForResponse);
      },
    }),
  );
  app.useGlobalFilters(new HttpExceptionFilter());
  await app.listen(settings.PORT);
}
bootstrap();
