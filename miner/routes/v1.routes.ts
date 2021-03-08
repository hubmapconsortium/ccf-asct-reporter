import { Router } from 'express';

const v1 = Router();

v1.get('/', (request: any, response: any) => {
  return response.json("OK V1");
});

export default v1;