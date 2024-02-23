import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AuthHeaderService } from "../user/authHeaders.service";
import { LocationEntity } from "../../../domain/location/location.entity";

//const API_URL = "https://api.lplan.es:443/location";
const  API_URL = "http://147.83.7.158:5432/location";

/*
const response = await axios.get(
  "https://api.lplan.es/locations/all",
  {
    headers: token,
  }
);
*/
export class LocationService {
  static async getLocations() {
    const token = await AuthHeaderService.authHeader();
    if (token) {
      try {
        const response = await axios.get(
          "http://147.83.7.158:5432/locations/all",
          {
            headers: token,
          }
        );
        return response;
      } catch (error) {
        console.error("Error during locations:", error);
        throw error;
      }
    }
  }
  //OK
  static async searchLocations(searchQuery: string) {
    const token = await AuthHeaderService.authHeader();
    if (token) {
      try {
        console.log("He entrado al servicio:" + searchQuery);
        const response = await axios.get(API_URL + "/search/" + searchQuery, {
          headers: token,
        });
        return response;
      } catch (error) {
        console.error("Error during register:", error);
        throw error;
      }
    }
  }

  //OK
  static async getLocation(locationId: string) {
    const token = await AuthHeaderService.authHeader();
    if (token) {
      try {
        const response = await axios.get(API_URL + "/" + locationId, {
            headers: token,
        });
        return response;
      } catch (error) {
        console.error("Error when obtaining person:", error);
        throw error;
      }
    }
  }

  static async createLocation(location: LocationEntity) {
    const token = await AuthHeaderService.authHeader();
    try {
      const response = await axios.post(API_URL + "/add", location, { headers: token });
      console.log("try response " + response)
      return response;
    } catch (error) {
      console.error('Error during the creation of the location: ', error);
      throw error;
    }
  }
}
