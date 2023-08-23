import { CountryUseCase } from "../../application/CountryUseCase";
import { IReq, IRes } from "@src/routes/types/express/misc";
import HttpStatusCodes from "@src/constants/HttpStatusCodes";
import { HttpGetListCountry } from "../services/HttpGetListCountry";
import convert from 'xml-js'
import { HttpGetCountryInfo } from "../services/HttpGetCountryInfo";
import { HttpGetListContinents } from "../services/HttpGetListContinents";
import { HttpGetCurrencyName } from "../services/HttpGetCurrencyName";
import fs from 'fs';

export class CountryController {
  constructor(private countryUseCase: CountryUseCase) {
    this.getCountries = this.getCountries.bind(this)
  }

  public async getCountries(req: IReq, res: IRes) {
    const fileURL = 'src/modules/core/infrastructure/model/dataCountry.json'
    try {
      let rawdata = fs.readFileSync(fileURL);
      let dataCountries = (rawdata.length === 0) ? [] : JSON.parse(rawdata.toString()); 
      
      if (Object.keys(dataCountries).length === 0) {
        dataCountries = await mapCountryInfoWithContinent();
        fs.writeFileSync(fileURL, JSON.stringify(dataCountries));
      }

      if (Object.keys(dataCountries).length > 0) {
        res.status(HttpStatusCodes.OK).json({
          error: false,
          data: dataCountries
        })
      }
    } catch (_) {
      res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send("An error has occurred. Please try again.");
    }
  }
}

const mapCountryInfoWithContinent = async () => {
  const listOfCountryXml = await HttpGetListCountry();
  const listContinentXml = await HttpGetListContinents();

  const listOfCountry = xmlToJsonArray(listOfCountryXml.data)['soap:Envelope']['soap:Body']['m:ListOfCountryNamesByNameResponse']['m:ListOfCountryNamesByNameResult']['m:tCountryCodeAndName'];

  const listContinents = xmlToJsonArray(listContinentXml.data)['soap:Envelope']['soap:Body']['m:ListOfContinentsByNameResponse']['m:ListOfContinentsByNameResult']['m:tContinent'];

  const dataCountries = await Promise.all(listOfCountry.map(async (element: any) => {
    const countryInfoXml = await HttpGetCountryInfo(element['m:sISOCode']._text);
    const countryInfo = xmlToJsonArray(countryInfoXml.data)['soap:Envelope']['soap:Body']['m:FullCountryInfoResponse']['m:FullCountryInfoResult'];

    const currencyNameXml = await HttpGetCurrencyName(countryInfo['m:sCurrencyISOCode']._text);
    const currencyName = xmlToJsonArray(currencyNameXml.data)['soap:Envelope']['soap:Body']['m:CurrencyNameResponse']['m:CurrencyNameResult'];

    const continentFiltered = listContinents.filter((continent: any) => continent['m:sCode']._text === countryInfo['m:sContinentCode']._text)

    return {
      "code": element['m:sISOCode']._text,
      "name": element['m:sName']._text,
      "capitalCity": countryInfo['m:sCapitalCity']._text,
      "phoneCode": countryInfo['m:sPhoneCode']._text,
      "continent": {
        "code": countryInfo['m:sContinentCode']._text,
        "name": continentFiltered[0]['m:sName']._text
      },
      "currency": {
        "code": countryInfo['m:sCurrencyISOCode']._text,
        "name": currencyName._text
      },
      "flag": countryInfo['m:sCountryFlag']._text,
      "languages": mapLanguages(countryInfo['m:Languages']['m:tLanguage'])
    }
  }));

  return dataCountries;
}

const mapLanguages = (languages: any) => {
  if (languages) {
    if (languages.length > 0) {
      return languages.map((language: any) => {
        return { "code": language['m:sISOCode']._text, "name": language['m:sName']._text }
      })
    } else {
      return { "code": languages['m:sISOCode']._text, "name": languages['m:sName']._text }
    }
  } else {
    return {}
  }
}

const xmlToJsonArray = (xml: string) => {
  return JSON.parse(convert.xml2json(xml, {
    compact: true,
    spaces: 2
  }))
}
