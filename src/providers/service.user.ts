import { Injectable } from '@angular/core';
import { Http, Response, RequestOptions, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { AppSettings } from './app.settings';

/**
 * Service allows to crud operations on user 
 * 
 * @author Juvodu
 */
@Injectable()
export class UserService {

    headers: Headers;

    constructor(private http: Http) {

        this.headers = new Headers();
        this.headers.append('x-api-key', AppSettings.SPOT_API_KEY);
    }

    /**
     * Create a user on the backend
     * 
     * @param cognitoUser
     *              
     */
    createUser(cognitoUser:any): Observable<Response>{
        
        let options:RequestOptions = new RequestOptions({headers: this.headers});
        let postParams = {
            username: cognitoUser.username,
            email: cognitoUser.email
          };

        return this.http.post(AppSettings.SPOT_API_ENDPOINT + "user/create", postParams, options);
    }

    /**
     * Delete a user on the backend
     * 
     * @param cognitoUser
     *              
     */
    deleteUser(cognitoUser:any): Observable<Response>{
        
        let options:RequestOptions = new RequestOptions({headers: this.headers});
        let postParams = {
            username: cognitoUser.username
          };

        return this.http.post(AppSettings.SPOT_API_ENDPOINT + "user/delete", postParams, options);
    }
}