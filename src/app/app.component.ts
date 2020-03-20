import { Component, OnInit } from '@angular/core';
import { User } from './models/user';
import { KeycloakService } from './KeyCloak/keycloak.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'Praca-Dyplomowa-FE';
  
  profile: User;

  constructor(private keycloakService: KeycloakService ) {}

  public ngOnInit(): void {
      this.profile = this.keycloakService.getUser();
  }
}
