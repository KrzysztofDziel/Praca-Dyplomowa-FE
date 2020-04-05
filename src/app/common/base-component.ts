import { OnDestroy } from '@angular/core';
import { LocationService } from '../services/location.service';
import { LocationDataModel } from '../models/locationData.model';
import { Subscription } from 'rxjs';

export class BaseComponent implements OnDestroy {

    public locationModel: LocationDataModel;
    public observables: Subscription[];

    constructor(
        public location: LocationService) {
        this.locationModel = new LocationDataModel();
        this.observables = [];
    }

    getClientLocation() {
        const o = this.location.getCurrentLocation().subscribe(data => {
            console.log(data);
            this.locationModel.countryName = data.country_name;
            this.locationModel.regionName = data.region_name;
            this.locationModel.city = data.city;
            this.locationModel.ipAddress = data.ip;

            this.location.setLocationModel(this.locationModel);

            this.locationModel = this.location.getLocationModel();
        });
        this.observables.push(o);
    }

    ngOnDestroy(): void {
        if (this.observables != null) {
            this.observables.forEach(e => {
                e.unsubscribe();
            });
        }
    }

}