import { Component, OnInit } from '@angular/core';
import { LocationService } from '../services/location.service';
import { BaseComponent } from '../common/base-component';
import { AuthService } from '../services/auth.service';
import { ToastaService, ToastaConfig, ToastOptions, ToastData } from 'ngx-toasta';

@Component({
  selector: 'app-user-information-panel',
  templateUrl: './user-information-panel.component.html',
  styleUrls: ['./user-information-panel.component.scss']
})
export class UserInformationPanelComponent extends BaseComponent implements OnInit {


  constructor(
    private loc: LocationService,
    auth: AuthService,
    toastaService: ToastaService,
    toastaConfig: ToastaConfig) {
    super(loc, auth, toastaService, toastaConfig);
    this.toastaConfig.theme = 'material';
  }

  ngOnInit() {
    this.locationModel = this.loc.getLocationModel();
  }

  viewBio() {

    var toastOptions1: ToastOptions = {
      title: "Zapisano",
      msg: "Pomyślnie zapisano nowy opis użytkownika",
      showClose: true,
      timeout: 7000,
      theme: 'bootstrap',
    }

    var toastOptions2: ToastOptions = {
      title: "Komunikat",
      msg: "Brak zmian w opisie.",
      showClose: true,
      timeout: 7000,
      theme: 'bootstrap',
    }

    var toastOptions3: ToastOptions = {
      title: "Zapisano",
      msg: "Pomyślnie zapisano nowy avatar użytkownika",
      showClose: true,
      timeout: 7000,
      theme: 'bootstrap',
    }

    var toastOptions4: ToastOptions = {
      title: "Komunikat",
      msg: "Brak zmian w zjęciu profilowym.",
      showClose: true,
      timeout: 7000,
      theme: 'bootstrap',
    }

    if (this.userBio === this.profile.bio) {
      this.toastaService.warning(toastOptions2);
    } else {
      this.profile.bio = this.userBio;
      this.auth.updateUserBioDatabase(this.locationModel, this.profile);
      this.toastaService.success(toastOptions1);
    }

    if (this.fileAvatar) {
      this.toastaService.success(toastOptions3);
      this.auth.uploadUserAvatar(this.fileAvatar, this.profile);
    } else {
      this.toastaService.warning(toastOptions4);
    }

  }

  detectFiles(event) {
    let selectedFile = event.target.files[0];
    let dotIdx = selectedFile.name.indexOf(".") + 1;
    var extFile = selectedFile.name.substr(dotIdx, selectedFile.name.length).toLowerCase();
    if (extFile == "jpg" || extFile == "jpeg" || extFile == "png") {
    this.fileAvatar = event.target.files[0];
    } else {
      alert("System obsługuje tylko pliki typu jpg/jpeg oraz png!");
    }
  }

  addEmoji(event: any) {
    this.userBio += event.emoji.native;
  }

}
