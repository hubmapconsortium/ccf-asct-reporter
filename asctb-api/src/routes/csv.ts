import { Express, Request, Response } from 'express';
import { makeASCTBData } from '../functions/api.functions';
import { UploadedFile } from '../models/api.model';
import { makeGraphData } from '../functions/graph.functions';
import papa from 'papaparse';
import axios from 'axios';

export function setupCSVRoutes(app: Express): void {

  /**
   * Fetch a CSV given a link and parse it into json or graph output
   */
  app.get('/v2/csv', async (req: Request, res: Response) => {
    console.log(`${req.protocol}://${req.headers.host}${req.originalUrl}`);
    // query parameters csvUrl and output
    const url = req.query.csvUrl as string;
    const output = req.query.output as 'json' | 'graph' | string;

    try {
      const response = await axios.get(url);

      const data = papa.parse(response.data, { skipEmptyLines: 'greedy' }).data;
      const asctbData = await makeASCTBData(data);

      if (output === 'graph') {
        const graphData = makeGraphData(asctbData);
        return res.send({
          data: graphData,
          csv: response.data,
          parsed: data,
        });
      } else {
        // The default is returning the json
        return res.send({
          data: asctbData,
          csv: response.data,
          parsed: data,
        });
      }

    } catch (err) {
      console.log(err);
      return res.status(500).send({
        msg: 'Please check the CSV format',
        code: 500,
      });
    }
  });

  /**
   * Parse a CSV into JSON format given the raw file formData
   */
  app.post('/v2/csv', async (req: Request, res: Response) => {
    console.log(`${req.protocol}://${req.headers.host}${req.originalUrl}`);

    const file = req.files.csvFile as UploadedFile;

    if (file.mimetype !== 'text/csv' || file.size > 10000000) {
      return res.status(400).send({
        msg: 'File must be a CSV less than 10 MB.',
        code: 400
      });
    }

    const dataString = file.data.toString();
    console.log('File uploaded: ', file.name);

    try {
      const data = papa.parse(dataString, { skipEmptyLines: 'greedy' }).data;
      const asctbData = await makeASCTBData(data);

      return res.send({
        data: asctbData,
        csv: dataString,
        parsed: data,
      });

    } catch (err) {
      console.log(err);
      return res.status(500).send({
        msg: 'Please check the CSV format',
        code: 500,
      });
    }
  });
}