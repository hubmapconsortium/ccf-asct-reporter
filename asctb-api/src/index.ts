/* tslint:disable:variable-name */
import cors from 'cors';
import express from 'express';
import fileUpload from 'express-fileupload';
import path from 'path';

import { setupCSVRoutes } from './routes/csv';
import { setupGoogleSheetRoutes } from './routes/google-sheet';
import { setupOntologyLookupRoutes } from './routes/ontology-lookup';
import { setupOpenApiSpecRoutes } from './routes/open-api-spec';
import { setupPlaygroundRoutes } from './routes/playground';
import { setupStaticPageRoutes } from './routes/static-pages';
import { routeCache } from './utils/route-caching';

export const app = express();
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static(path.join(__dirname, '../../')));
app.use(fileUpload());
app.use(routeCache(12000));

setupCSVRoutes(app);
setupPlaygroundRoutes(app);
setupOntologyLookupRoutes(app);
setupGoogleSheetRoutes(app);
setupOpenApiSpecRoutes(app);
setupStaticPageRoutes(app);

app.listen(process.env.PORT || 5000);
