import { ICountryRepository } from "@src/modules/core/domain/ICountryRepository";

export class CountryUseCase {
  constructor(private readonly countryRepository: ICountryRepository) {}

  public getListCountries = async () => await this.countryRepository.listCountries()

}
