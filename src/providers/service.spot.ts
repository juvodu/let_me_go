import { Injectable } from '@angular/core';
import { Http, Response, RequestOptions, Headers, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { AppSettings } from './app.settings';
import 'rxjs/add/operator/map';

/**
 * Service for retrieving surfspots
 * @author Juvodu
 * 
 */
@Injectable()
export class SpotService {

    headers: Headers;

    constructor(public http: Http) {

        this.headers = new Headers();
        this.headers.append('x-api-key', AppSettings.SPOT_API_KEY);
    }

    /**
     * Get all available spots
     */
    getAllSpots(): Observable<any[]>{

        let options:RequestOptions = new RequestOptions({headers: this.headers});
        let spots = this.http.get(AppSettings.SPOT_API_ENDPOINT + "/spots", options)
             .map((res:Response) => res.json());
        return spots;
    };

    /**
     * Get all spots for a specific continent
     * @param continent 
     */
    getSpotsByContinent(continent: string){

        let options:RequestOptions = new RequestOptions({headers: this.headers});
        let params: URLSearchParams = new URLSearchParams();
        params.set('continent', continent);
        options.params = params;

        let spots = this.http.get(AppSettings.SPOT_API_ENDPOINT + "/spot", options)
             .map((res:Response) => res.json());
        return spots;
    }

   /**
    * Get spots within a specific distance
    * @param continent
    * @param lat 
    * @param long 
    * @param distance 
    */
    getSpotsByDistance(continent: string, lat: string, lon: string, distance: string): Observable<any[]>{

        let options:RequestOptions = new RequestOptions({headers: this.headers});
        let params: URLSearchParams = new URLSearchParams();
        params.set('continent', continent);
        params.set('lat', lat);
        params.set('lon', lon);
        params.set('distance', distance);
        options.params = params;

        let spots = this.http.get(AppSettings.SPOT_API_ENDPOINT + "/spot", options)
             .map((res:Response) => res.json());
        return spots;
    }
}