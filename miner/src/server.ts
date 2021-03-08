import express from 'express';
import cors from 'cors';
import v1 from './routes/v1.routes';
import v2 from './routes/v2.routes';

const app = express();
app.use(cors());

app.use('/', v1);
app.use('/v2', v2);

app.listen(process.env.PORT || 5000, () => console.log('ASCT+B Data Miner Started'));