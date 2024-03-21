import { Express, Request, Response } from 'express';

export function setupStaticPageRoutes(app: Express): void {
  app.get('/graph', (_req: Request, res: Response) => {
    res.sendFile('assets/graph-vis/index.html', {
      root: __dirname,
    });
  });

  app.get('/home.html', (_req: Request, res: Response) => {
    res.sendFile('assets/views/home.html', {
      root: __dirname,
    });
  });
}
