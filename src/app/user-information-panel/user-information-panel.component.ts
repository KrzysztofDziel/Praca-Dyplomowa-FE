import { Component, OnInit } from '@angular/core';
import { User } from '../models/user';
import { LocationService } from '../services/location.service';
import { BaseComponent } from '../common/base-component';
import { LocationDataModel } from '../models/locationData.model';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-user-information-panel',
  templateUrl: './user-information-panel.component.html',
  styleUrls: ['./user-information-panel.component.scss']
})
export class UserInformationPanelComponent extends BaseComponent implements OnInit {

  locationModel: LocationDataModel;

  constructor(private loc: LocationService, auth: AuthService) {
    super(loc, auth);
  }

  ngOnInit() {
    this.locationModel = this.loc.getLocationModel();
  }

}
