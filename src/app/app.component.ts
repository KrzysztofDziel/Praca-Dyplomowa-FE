import { Component, OnInit } from '@angular/core';
import { LocationService } from './services/location.service';
import { BaseComponent } from './common/base-component';
import { AuthService } from './services/auth.service';
import { ToastaService, ToastaConfig, ToastOptions, ToastData } from 'ngx-toasta';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent extends BaseComponent implements OnInit {
  title = 'Praca-Dyplomowa-FE';


  constructor(
    loc: LocationService,
    auth: AuthService,
    toastaService: ToastaService,
    toastaConfig: ToastaConfig) {
    super(loc, auth, toastaService, toastaConfig);
    this.toastaConfig.theme = 'material';
  }

  ngOnInit(): void {
  }


}
