
import { Express, Request, Response } from 'express';
import { makeASCTBData } from '../functions/api.functions';
import { PLAYGROUND_CSV } from '../../const';
import papa from 'papaparse';

export function setupPlaygroundRoutes(app: Express): void {

  /**
   * Get the toy CSV data set for the default playground view
   */
  app.get('/v2/playground', async (req: Request, res: Response) => {
    console.log(`${req.protocol}://${req.headers.host}${req.originalUrl}`);
    try {
      const parsed = papa.parse(PLAYGROUND_CSV).data;
      const data = await makeASCTBData(parsed);
      return res.send({
        data: data,
        csv: PLAYGROUND_CSV,
        parsed: parsed,
      });
    } catch (err) {
      console.log(err);
      return res.status(500).send({
        msg: JSON.stringify(err),
        code: 500,
      });
    }
  });

  /**
   * Send updated data to render on the playground after editing the table
   */
  app.post('/v2/playground', async (req: Request, res: Response) => {
    const csv = papa.unparse(req.body);
    try {
      const data = await makeASCTBData(req.body.data);
      return res.send({
        data: data,
        parsed: req.body,
        csv: csv,
      });
    } catch (err) {
      console.log(err);
      return res.status(500).send({
        msg: JSON.stringify(err),
        code: 500,
      });
    }
  });
}
