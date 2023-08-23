import { Router } from 'express';
import jetValidator from 'jet-validator';

import Paths from './constants/Paths';

import coreRouter from '../modules/core/infrastructure/route/coreRouter';


// **** Variables **** //

const apiRouter = Router()

// Add CoreRouter
apiRouter.use(Paths.Core.Base, coreRouter);

// **** Export default **** //

export default apiRouter;
