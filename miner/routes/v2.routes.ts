import { Router } from 'express';

const v2 = Router();

v2.get('/', (request: any, response: any) => {
  return response.json("OK");
});

export default v2;