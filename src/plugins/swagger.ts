import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import { AppModule } from '../app.module';
import { INestApplication, Type } from '@nestjs/common';

export const enableSwagger = (app: INestApplication) => {
  const publicPath = './dist/public';
  const swaggerPath = './dist/swagger';
  const packageJson = JSON.parse(readFileSync('package.json', 'utf-8').trim());
  const { version, description } = packageJson;

  // Utility functions
  const ensureDirExists = (path: string) => {
    if (!existsSync(path)) mkdirSync(path);
  };

  const createSwaggerConfig = () =>
    new DocumentBuilder()
      .setTitle('Chat App API')
      .setVersion(`v${version}`)
      .setDescription(`${description}`)
      .addBearerAuth()
      .build();

  const generateSwaggerHtml = (modules: Type<any>[]) => {
    const swaggerElements = modules
      .map((mod) => {
        try {
          const moduleInstance = app.get(mod, { strict: false });
          if (!moduleInstance) return '';

          const routeName = mod.name.replace('Module', '').toLowerCase();
          const document = SwaggerModule.createDocument(
            app,
            createSwaggerConfig(),
            {
              include: [mod],
            },
          );
          SwaggerModule.setup(`swagger/${routeName}`, app, document);

          return `<a class="grid-item" href="${routeName}"><button class="btn">${mod.name.replace('Module', '')}</button></a>`;
        } catch (error) {
          console.error(`Error processing module ${mod.name}:`, error);
          return '';
        }
      })
      .join('');

    return `<!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Swagger Menu</title>
        <link rel="icon" type="image/png" href="./favicon-32x32.png" sizes="32x32" />
        <style>
          .grid-container { display: flex; flex-wrap: wrap; text-align: center; }
          .grid-item { padding: 10px; font-size: 1.2rem; flex: 20%; }
          .btn { border-radius: 8px; width: 100%; padding: 0.5rem; cursor: pointer; background-color: #e0e0e0; color: #2e2e2e; font-weight: bold; transition: 0.4s; }
          .btn:hover { background-color: #2e2e2e; color: #e0e0e0; }
        </style>
      </head>
      <body style="margin: 1rem 10rem">
        <h1 style="text-align: center; margin: 32px 0">Swagger Menu</h1>
        <div class="grid-container">${swaggerElements}</div>
      </body>
      </html>`;
  };

  // Ensure directories exist
  [publicPath, swaggerPath].forEach(ensureDirExists);

  // Get the list of modules to generate documentation for
  const modules: Type<any>[] = (
    Reflect.getMetadata('imports', AppModule) || []
  ).filter((mod) => Reflect.getMetadata('controllers', mod));

  // Generate and write Swagger files
  writeFileSync(
    `${publicPath}/swagger.json`,
    JSON.stringify(
      SwaggerModule.createDocument(app, createSwaggerConfig()),
      null,
      4,
    ),
  );
  writeFileSync(`${swaggerPath}/index.html`, generateSwaggerHtml(modules));
};
