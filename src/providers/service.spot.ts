import { Injectable } from '@angular/core';
import { Http, Response, RequestOptions, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import {AppSettings} from './app.settings';
import 'rxjs/add/operator/map';

/**
 * Service for retrieving surfspots
 * @author Juvodu
 * 
 */
@Injectable()
export class SpotService {

    constructor(public http: Http) {
    }

    /**
     * Get all available spots
     */
    getAllSpots(): Observable<any[]>{

        let headers = new Headers();
        headers.append('x-api-key', AppSettings.SPOT_API_KEY);
        let options = new RequestOptions({headers: headers});
        let spots = this.http.get(AppSettings.SPOT_API_ENDPOINT + "/spots", options)
             .map((res:Response) => res.json());
        return spots;
    };
}