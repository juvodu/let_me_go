import { Injectable } from '@angular/core';
import { Http, Response, RequestOptions, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { AppSettings } from './app.settings';
import { Analytics } from 'aws-amplify';

/**
 * Service allows to register devices with the backend
 * 
 * @author Juvodu
 */
@Injectable()
export class DeviceService {

    headers: Headers;

    constructor(private http: Http) {

        this.headers = new Headers();
        this.headers.append('x-api-key', AppSettings.SPOT_API_KEY);
    }

    /**
     * Register a device with the backend for push notifications
     * 
     * @param username
     *          of the currently logged in user
     * @param deviceToken 
     *          retrieved from mobile OS to be registered
     */
    registerDevice(username:string, deviceToken:string): Observable<Response>{

        let options:RequestOptions = new RequestOptions({headers: this.headers});
        let postParams = {
            username: username,
            deviceToken: deviceToken
        };

        Analytics.record("RegisterDevice", postParams);
        return this.http.post(AppSettings.SPOT_API_ENDPOINT + "device/create", postParams, options);
    }
        

       

    /**
     * Register a device with the backend for push notifications
     * 
     * @param username 
     *          of the currently logged in user
     * @param deviceToken
     *          retrieved from mobile OS to be registered
     */
    unregisterDevice(username:string, deviceToken:string): Observable<Response>{
        
        let options:RequestOptions = new RequestOptions({headers: this.headers});
        let postParams = {
            username: username,
            deviceToken: deviceToken
          };
        
        Analytics.record("UnregisterDevice", postParams);
        return this.http.post(AppSettings.SPOT_API_ENDPOINT + "device/delete", postParams, options);
    }
}