import EnvVars from "@src/constants/EnvVars";
import { ServicesRoutes } from "@src/util/ServicesRoute";
import axios from "axios";

export const HttpGetListCountry = () => {
    const xml = `<?xml version="1.0" encoding="utf-8"?>
    <soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
      <soap:Body>
        <ListOfCountryNamesByName xmlns="http://www.oorsprong.org/websamples.countryinfo">
        </ListOfCountryNamesByName>
      </soap:Body>
    </soap:Envelope>`
    return axios.post(`${EnvVars.ExternalServices.soap}/${ServicesRoutes.countryInfoService}`, xml, { headers: { 'Content-Type': 'text/xml'}})
}