import express from 'express';
import cors from 'cors';


const router = express();
const PORT = 5000;

import v2 from './routes/v2.routes';
import v1 from './routes/v1.routes';

router.use(cors());
router.use('/', v1);
router.use('/v2', v2);

router.listen(PORT, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${PORT}`);
});