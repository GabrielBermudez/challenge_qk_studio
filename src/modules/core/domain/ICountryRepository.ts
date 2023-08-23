import { ICountryEntity } from "./ICountryEntity";

export interface ICountryRepository {
  listCountries(): Promise<ICountryEntity[] | null>;
}
