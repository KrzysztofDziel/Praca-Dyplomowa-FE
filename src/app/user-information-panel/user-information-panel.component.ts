import { Component, OnInit } from '@angular/core';
import { User } from '../models/user';
import { KeycloakService } from '../KeyCloak/keycloak.service';

@Component({
  selector: 'app-user-information-panel',
  templateUrl: './user-information-panel.component.html',
  styleUrls: ['./user-information-panel.component.scss']
})
export class UserInformationPanelComponent implements OnInit {

  profile: User;

  constructor(private keycloakService: KeycloakService) { }

  ngOnInit() {
    this.profile = this.keycloakService.getUser();
  }

}
