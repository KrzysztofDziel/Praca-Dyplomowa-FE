import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { KeycloakHttp, KEYCLOAK_HTTP_PROVIDER } from './KeyCloak/keycloak.http';
import { KeycloakService } from './KeyCloak/keycloak.service';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpModule
  ],
  providers: [
    KEYCLOAK_HTTP_PROVIDER, 
    KeycloakService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
