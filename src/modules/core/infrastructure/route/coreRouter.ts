import { Router } from 'express';
import jetValidator from 'jet-validator';

import Paths from '../../../../routes/constants/Paths';
import {CountryController} from '@src/modules/core/infrastructure/controller/CountryController';
import { CountryUseCase } from '@src/modules/core/application/CountryUseCase';
import { CountryRepository } from '@src/modules/core/infrastructure/repository/CountryRepository';

// **** Variables **** //
const validate = jetValidator();


// ** Add CoreRouter ** //
const coreRouter = Router();

const countryRepository = new CountryRepository()
const userUseCase = new CountryUseCase(countryRepository)
const countryController = new CountryController(userUseCase);

// Sign in
coreRouter.get(
    Paths.Core.GetCountries,
    countryController.getCountries,
);


// **** Export default **** //

export default coreRouter;