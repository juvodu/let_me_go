import { Injectable } from '@angular/core';
import { Http, Response, RequestOptions, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { AppSettings } from './app.settings';
import { CognitoService } from './service.cognito';

/**
 * Service allows to register devices with the backend
 * 
 * @author Juvodu
 */
@Injectable()
export class DeviceService {

    headers: Headers;

    constructor(private http: Http,
                private cognitoService: CognitoService) {

        this.headers = new Headers();
        this.headers.append('x-api-key', AppSettings.SPOT_API_KEY);
    }

    /**
     * Register a device with the backend for push notifications
     * 
     * @param deviceToken retrieved from mobile OS to be registered
     */
    registerDevice(deviceToken:string): Observable<Response>{
        
        let user = this.cognitoService.getCurrentUser();
        let options:RequestOptions = new RequestOptions({headers: this.headers});
        let postParams = {
            username: user.username,
            deviceToken: deviceToken
          };

        return this.http.post(AppSettings.SPOT_API_ENDPOINT + "device/create", postParams, options);
    }

    /**
     * Register a device with the backend for push notifications
     * 
     * @param deviceToken retrieved from mobile OS to be registered
     */
    unregisterDevice(deviceToken:string): Observable<Response>{
        
        let user = this.cognitoService.getCurrentUser();
        let options:RequestOptions = new RequestOptions({headers: this.headers});
        let postParams = {
            username: user.username,
            deviceToken: deviceToken
          };

        return this.http.post(AppSettings.SPOT_API_ENDPOINT + "device/delete", postParams, options);
    }
}