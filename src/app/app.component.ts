import { Component, OnInit } from '@angular/core';
import { User } from './models/user';
import { LocationService } from './services/location.service';
import { BaseComponent } from './common/base-component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent extends BaseComponent implements OnInit {
  title = 'Praca-Dyplomowa-FE';

  private profile: User;

  constructor(private loc: LocationService) {
    super(loc);
  }

  ngOnInit(): void {
    this.getClientLocation();
  }

}
