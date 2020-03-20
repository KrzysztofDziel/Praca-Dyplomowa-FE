import { Injectable } from '@angular/core';
import { KeycloakService } from './keycloak.service';
import { Observable } from 'rxjs/internal/Observable';
import { Http, ConnectionBackend, RequestOptionsArgs, RequestOptions, XHRBackend } from '@angular/http';
import { from } from 'rxjs';

@Injectable()
export class KeycloakHttp extends Http {
    constructor(_backend: ConnectionBackend, _defaultOptions: RequestOptions, private _keycloakService: KeycloakService) {
        super(_backend, _defaultOptions);
    }
}

export function keycloakHttpFactory(backend: XHRBackend, defaultOptions: RequestOptions, keycloakService: KeycloakService) {
    return new KeycloakHttp(backend, defaultOptions, keycloakService);
}

export const KEYCLOAK_HTTP_PROVIDER = {
    provide: Http,
    useFactory: keycloakHttpFactory,
    deps: [XHRBackend, RequestOptions, KeycloakService]
};
