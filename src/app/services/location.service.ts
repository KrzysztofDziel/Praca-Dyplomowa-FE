import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LocationDataModel } from '../models/locationData.model';

interface LocationProperties {
  country_name: string;
  region_name: string;
  city: string;
  ip: string;
}


@Injectable({
  providedIn: 'root'
})

export class LocationService {

  private model: LocationDataModel;

  regions: { key: string, value: string }[] = [
    { key: "Lower Silesia", value: "Dolnośląskie" },
    { key: "Kuyavia-Pomerania", value: "Kujawsko-Pomorskie" },
    { key: "Lodzkie", value: "Łódzkie" },
    { key: "Lublin", value: "Lubelskie" },
    { key: "Lubusz", value: "Lubuskie" },
    { key: "Lesser Poland", value: "Małopolskie " },
    { key: "Mazovia", value: "Mazowieckie" },
    { key: "Subcarpathia", value: "Podkarpackie" },
    { key: "Pomerania", value: "Pomorskie" },
    { key: "Silesia", value: "Śląskie" },
    { key: "Warmia-Masuria", value: "Warmińsko-Mazurskie" },
    { key: "Greater Poland", value: "Wielkopolskie" },
    { key: "West Pomerania", value: "Zachodniopomorskie " }
  ];

  constructor(private http: HttpClient) {

  }

  getCurrentLocation() {
    return this.http.get<LocationProperties>('http://api.ipapi.com/api/check?access_key=e55601dece3cc5dee219370ea81d1037');
  }

  getLocationModel(): LocationDataModel {
    return this.model;
  }

  setLocationModel(model: LocationDataModel): void {
    this.model = model;

    if (this.model.countryName == "Poland") {
      this.model.countryName = "Polska";
    }

    this.regions.forEach(element => {
      if (this.model.regionName == element.key) {
        this.model.regionName = element.value;
      }
    });
  }
}
