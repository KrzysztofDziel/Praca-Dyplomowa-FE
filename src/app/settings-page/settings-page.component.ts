import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '../common/base-component';
import { LocationService } from '../services/location.service';
import { AuthService } from '../services/auth.service';
import { ToastaService, ToastaConfig, ToastOptions } from 'ngx-toasta';

@Component({
  selector: 'app-settings-page',
  templateUrl: './settings-page.component.html',
  styleUrls: ['./settings-page.component.scss']
})
export class SettingsPageComponent extends BaseComponent implements OnInit {
  checked: boolean = false;
  confirmDeletion: string = '';
  deletePhoto: string = '';

  constructor(
    private loc: LocationService,
    auth: AuthService,
    toastaService: ToastaService,
    toastaConfig: ToastaConfig) {
    super(loc, auth, toastaService, toastaConfig);
    this.toastaConfig.theme = 'material';
  }

  ngOnInit() {
  }

  checkIfPhoto() {
    return this.deletePhoto === 'Usuń' ? true : false;
  }

  checkIfConfirmed() {
    return this.confirmDeletion === this.profile.username && this.checked === true ? true : false;
  }

  deleteUser() {

    var toastOptions: ToastOptions = {
      title: "Konto zostało usunięte",
      msg: "Przekierowywuję do panelu logowania",
      showClose: true,
      timeout: 7000,
      theme: 'bootstrap',
    }

    this.toastaService.info(toastOptions);
    setTimeout(() => this.auth.deleteUserFromDB(this.profile), 7000);

  }

  deleteUserPhoto() {
    var toastOptions: ToastOptions = {
      title: "Usunięto zdjęcie profilowe",
      msg: "Odświeżam stronę",
      showClose: true,
      timeout: 8000,
      theme: 'bootstrap',
    }

    this.auth.deleteUserPhotoFromDB(this.profile);
    this.toastaService.success(toastOptions);
    setTimeout(() => window.location.reload(), 8000);
  }

}
