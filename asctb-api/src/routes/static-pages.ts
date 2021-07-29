import { Express, Request, Response } from 'express';
import path from 'path';

export function setupStaticPageRoutes(app: Express): void {

  app.get('/graph', (req: Request, res: Response) => {
    res.sendFile('assets/graph-vis/index.html', { root: path.join(__dirname, '../../') });
  });


  app.get('/', (req: Request, res: Response) => {
    res.sendFile('views/home.html', { root: path.join(__dirname, '../../') });
  });
}
