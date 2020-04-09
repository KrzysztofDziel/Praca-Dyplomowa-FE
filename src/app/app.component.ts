import { Component, OnInit } from '@angular/core';
import { User } from './models/user';
import { LocationService } from './services/location.service';
import { BaseComponent } from './common/base-component';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent extends BaseComponent implements OnInit {
  title = 'Praca-Dyplomowa-FE';


  constructor(private loc: LocationService, auth: AuthService) {
    super(loc, auth);
  }

  ngOnInit(): void {
    this.getClientLocation();
  }

}
