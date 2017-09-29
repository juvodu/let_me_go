import { Injectable } from '@angular/core';
import { Http, Response, RequestOptions, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { AppSettings } from './app.settings';
import 'rxjs/add/operator/map';

/**
 * Service for retrieving supported countries
 * 
 * @author Juvodu
 */
@Injectable()
export class CountryService {

    headers: Headers;

    constructor(public http: Http) {

        this.headers = new Headers();
        this.headers.append('x-api-key', AppSettings.SPOT_API_KEY);
    }

    getCountries(): Observable<any>{
        
        let options:RequestOptions = new RequestOptions({headers: this.headers});
        let countries: any = this.http.get(AppSettings.SPOT_API_ENDPOINT + "countries", options)
             .map((res:Response) => res.json());
        return countries;
    }
}