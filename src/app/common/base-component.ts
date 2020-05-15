import { OnDestroy } from '@angular/core';
import { LocationService } from '../services/location.service';
import { LocationDataModel } from '../models/locationData.model';
import { Subscription } from 'rxjs';
import { UserModel } from '../models/user';
import { AuthService } from '../services/auth.service';
import { ToastaService, ToastaConfig, ToastOptions, ToastData } from 'ngx-toasta';

export class BaseComponent implements OnDestroy {

    public locationModel: LocationDataModel;
    public observables: Subscription[];
    public profile: UserModel;
    public isLoggedIn = false;
    public userJSON: any;
    public userInfo: any;
    public userBio: string;
    public fileAvatar: File;

    constructor(
        public location: LocationService,
        public auth: AuthService,
        public toastaService: ToastaService,
        public toastaConfig: ToastaConfig) {
        this.locationModel = new LocationDataModel();
        this.observables = [];
        this.getClientLocation();
        this.isLoggedIn = this.auth.isLoggedIn;
        if (this.isLoggedIn) {
            this.userJSON = JSON.parse(localStorage.getItem('user'));
            this.profile = new UserModel();
            auth.downloadUserById(this.userJSON).then(data => {
                if (data) {
                    this.profile = data;
                    this.userBio = this.profile.bio;
                }
                this.auth.getDownloadURL(this.profile);
                this.userInfo = JSON.parse(localStorage.getItem('userInformation'));
                if (this.locationModel.city) {
                this.auth.updateLocationToDB(this.locationModel, this.profile);
                }
            });
        }

    }

    showLocationInfo() {

        var toastOptions1: ToastOptions = {
            title: "Aktualna lokalizacja",
            msg: this.locationModel.city + ', ' + this.locationModel.regionName + ', ' + this.locationModel.countryName,
            showClose: true,
            timeout: 7000,
            theme: 'bootstrap',
        }

        this.toastaService.info(toastOptions1);

    }

    updateUserBio() {
        this.auth.updateUserBioDatabase(this.locationModel, this.profile);
    }

    getClientLocation() {
        const o = this.location.getCurrentLocation().subscribe(data => {
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