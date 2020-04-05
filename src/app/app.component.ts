import { Component, OnInit } from '@angular/core';
import { User } from './models/user';
import { KeycloakService } from './KeyCloak/keycloak.service';
import { LocationService } from './services/location.service';
import { LocationDataModel } from './models/locationData.model';
import { BaseComponent } from './common/base-component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent extends BaseComponent implements OnInit {
  title = 'Praca-Dyplomowa-FE';

  private profile: User;

  constructor(private keycloakService: KeycloakService, private loc: LocationService) {
    super(loc);
  }

  ngOnInit(): void {
    this.profile = this.keycloakService.getUser();
    this.getClientLocation();
  }

}
