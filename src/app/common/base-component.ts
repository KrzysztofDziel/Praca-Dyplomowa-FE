import { OnDestroy } from '@angular/core';
import { LocationService } from '../services/location.service';
import { LocationDataModel } from '../models/locationData.model';
import { Subscription } from 'rxjs';
import { User } from '../models/user';
import { AuthService } from '../services/auth.service';

export class BaseComponent implements OnDestroy {

    public locationModel: LocationDataModel;
    public observables: Subscription[];
    public user: User;
    public profile: User;
    public isLoggedIn = false;
    public userJSON: any;

    constructor(
        public location: LocationService,
        public auth: AuthService) {
        this.locationModel = new LocationDataModel();
        this.observables = [];
        this.isLoggedIn = this.auth.isLoggedIn;
        if (this.isLoggedIn) {
            this.userJSON = JSON.parse(localStorage.getItem('user'));
            this.profile = new User(this.userJSON.displayName, this.userJSON.email);
        }

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