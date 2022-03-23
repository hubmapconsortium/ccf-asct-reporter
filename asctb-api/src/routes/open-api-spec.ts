import { Express, RequestHandler } from 'express';
import { resolve } from 'path';

export const browserRoute: RequestHandler = (_req, res, _next) => {

  res.send(`<!doctype html>
    <html lang="en">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
        <title>ASCT+B-API Open API Spec</title>
        <script src="https://cdn.jsdelivr.net/npm/@stoplight/elements/web-components.min.js"></script>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@stoplight/elements/styles.min.css">
    </head>
    <body>
        <elements-api apiDescriptionUrl="open-api-spec.yaml" router="hash" />
    </body>
    </html>`);
};

export const openApiRoute: RequestHandler = (_req, res, _next) => {
  const apiFile = resolve('./src/open-api-spec.yaml');
  res.sendFile(apiFile);
};


export function setupOpenApiSpecRoutes(app: Express): void {
    app.get('/', browserRoute);
    app.get('/open-api-spec.yaml', openApiRoute);
}
