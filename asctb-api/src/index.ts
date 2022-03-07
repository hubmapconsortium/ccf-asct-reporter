/* tslint:disable:variable-name */
import bodyParser from 'body-parser';
import cors from 'cors';
import path from 'path';
import fileUpload from 'express-fileupload';
import express from 'express';

import { setupCSVRoutes } from './routes/csv';
import { setupPlaygroundRoutes } from './routes/playground';
import { setupOntologyLookupRoutes } from './routes/ontology-lookup';
import { setupGoogleSheetRoutes } from './routes/google-sheet';
import { setupStaticPageRoutes } from './routes/static-pages';
import { routeCache } from './utils/route-caching';

export const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../../')));
app.use(fileUpload());
app.use(routeCache(12000));

setupCSVRoutes(app);
setupPlaygroundRoutes(app);
setupOntologyLookupRoutes(app);
setupGoogleSheetRoutes(app);
setupStaticPageRoutes(app);

app.listen(process.env.PORT || 5000);
