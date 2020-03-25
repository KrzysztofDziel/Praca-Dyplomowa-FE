import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { KeycloakHttp, KEYCLOAK_HTTP_PROVIDER } from './KeyCloak/keycloak.http';
import { KeycloakService } from './KeyCloak/keycloak.service';
import { RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MaterialModule } from './material.module';


@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpModule,
    MaterialModule,
    //  ToastModule.forRoot(),
    RouterModule.forRoot([
      // { path: '', component: HomeComponent, pathMatch: 'full' },
    ])
  ],
  providers: [
    KEYCLOAK_HTTP_PROVIDER,
    KeycloakService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
