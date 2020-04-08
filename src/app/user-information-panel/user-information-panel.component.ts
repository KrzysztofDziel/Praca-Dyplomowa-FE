import { Component, OnInit } from '@angular/core';
import { User } from '../models/user';
import { LocationService } from '../services/location.service';
import { BaseComponent } from '../common/base-component';
import { LocationDataModel } from '../models/locationData.model';

@Component({
  selector: 'app-user-information-panel',
  templateUrl: './user-information-panel.component.html',
  styleUrls: ['./user-information-panel.component.scss']
})
export class UserInformationPanelComponent extends BaseComponent implements OnInit {

  private profile: User;
  locationModel: LocationDataModel;

  constructor(private loc: LocationService) {
    super(loc);
  }

  ngOnInit() {
    this.locationModel = this.loc.getLocationModel();
  }

}
