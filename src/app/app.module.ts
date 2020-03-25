import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { KEYCLOAK_HTTP_PROVIDER } from './KeyCloak/keycloak.http';
import { KeycloakService } from './KeyCloak/keycloak.service';
import { RouterModule } from '@angular/router';
import { MaterialModule } from './material.module';
import { UserInformationPanelComponent } from './user-information-panel/user-information-panel.component';
import { HomePageComponent } from './home-page/home-page.component';


@NgModule({
  declarations: [
    AppComponent,
    UserInformationPanelComponent,
    HomePageComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpModule,
    MaterialModule,
    //  ToastModule.forRoot(),
    RouterModule.forRoot([
      { path: '', component: HomePageComponent, pathMatch: 'full' },
      { path: 'account-info', component: UserInformationPanelComponent },

    ])
  ],
  providers: [
    KEYCLOAK_HTTP_PROVIDER,
    KeycloakService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
