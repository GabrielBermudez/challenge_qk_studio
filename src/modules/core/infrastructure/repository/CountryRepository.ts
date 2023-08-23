import { ICountryEntity } from "@src/modules/core/domain/ICountryEntity";
import { ICountryRepository } from "@src/modules/core/domain/ICountryRepository";

export class CountryRepository implements ICountryRepository {
    listCountries(): Promise<ICountryEntity[] | null> {
        throw new Error("solicitar data a la session");
    } 
}