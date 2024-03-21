import { Express, RequestHandler } from 'express';

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
        <elements-api apiDescriptionUrl="asctb-api-spec.yaml" router="hash" />
    </body>
    </html>`);
};

export const openApiRoute: RequestHandler = (_req, res, _next) => {
  res.sendFile('assets/asctb-api-spec.yaml', {
    root: __dirname,
  });
};

export function setupOpenApiSpecRoutes(app: Express): void {
  app.get('/', browserRoute);
  app.get('/index.html', browserRoute);
  app.get('/asctb-api-spec.yaml', openApiRoute);
}
