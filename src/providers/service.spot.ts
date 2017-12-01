import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';
import { Http, Response, RequestOptions, Headers, URLSearchParams } from '@angular/http';
import { Geolocation, GeolocationOptions } from '@ionic-native/geolocation';
import { Diagnostic } from '@ionic-native/diagnostic';
import { UserService } from './service.user';
import { Observable } from 'rxjs/Observable';
import { AppSettings } from './app.settings';
import 'rxjs/add/operator/map';

/**
 * Service for retrieving surfspots
 * 
 * @author Juvodu
 */
@Injectable()
export class SpotService {

    // geolocation options - 10 min age - 5s timoute - no high accuracy
    private geoLocationOptions: GeolocationOptions = { maximumAge: 600000, timeout: 10000, enableHighAccuracy: false };
    private headers: Headers;

    constructor(private http: Http,
                private userService: UserService,
                private geolocation: Geolocation,
                private diagnostic: Diagnostic,
                private platform: Platform) {

        this.headers = new Headers();
        this.headers.append('x-api-key', AppSettings.SPOT_API_KEY);
    }

    getSpotById(id): Observable<any>{
        
        let options:RequestOptions = new RequestOptions({headers: this.headers});
        let params: URLSearchParams = new URLSearchParams();
        params.set('id', id);
        options.params = params;

        let spot: any = this.http.get(AppSettings.SPOT_API_ENDPOINT + "spot", options)
             .map((res:Response) => res.json());
        return spot;
    }

    getSpotsByIds(ids): Observable<any>{
        
        let options:RequestOptions = new RequestOptions({headers: this.headers});
        let params: URLSearchParams = new URLSearchParams();
        params.set('ids', ids);
        options.params = params;

        let spots: any = this.http.get(AppSettings.SPOT_API_ENDPOINT + "spots", options)
             .map((res:Response) => res.json());
        return spots;
    }

    /**
     * Get all favorite spots for the user
     * 
     * @param userId
     *             id of the user to retrieve favorite spots for     *
     * @param limit
     *             the optional limit of returned results
     */
    getSpotsByUser(userId:string, limit: number): Observable<any>{
        
        let options:RequestOptions = new RequestOptions({headers: this.headers});
        let params: URLSearchParams = new URLSearchParams();
        params.set('userId', userId);

        // set the optional limit parameter
        if(limit != null){
            params.set('limit', limit.toString());
        }

        options.params = params;

        let spots: any = this.http.get(AppSettings.SPOT_API_ENDPOINT + "spots", options)
             .map((res:Response) => res.json());
        return spots;
    }

    /**
     * Get all spots for a specific region
     * 
     * @param continent
     *             the required continent iso code to filter by
     * @param country
     *             the optional country iso code to filter by
     * @param limit
     *             the optional limit of returned results
     */
    getSpotsByRegion(continent: string, country: string, limit: number): Observable<any>{

        let options:RequestOptions = new RequestOptions({headers: this.headers});
        let params: URLSearchParams = new URLSearchParams();
        params.set('continent', continent);

        // set the optional country parameter
        if(country != null){
            params.set('country', country);
        }

        // set the optional limit parameter
        if(limit != null){
            params.set('limit', limit.toString());
        }

        options.params = params;

        let spots = this.http.get(AppSettings.SPOT_API_ENDPOINT + "spots", options)
             .map((res:Response) => res.json());
        return spots;
    }

   /**
    * Get spots within a specific distance
    * @param lat 
    * @param long 
    * @param distance 
    */
    getSpotsByDistance(lat: number, lon: number, distance: number): Observable<any>{

        let options:RequestOptions = new RequestOptions({headers: this.headers});
        let params: URLSearchParams = new URLSearchParams();
        params.set('lat', String(lat));
        params.set('lon', String(lon));
        params.set('distance', String(distance));
        options.params = params;

        let spots = this.http.get(AppSettings.SPOT_API_ENDPOINT + "spots", options)
             .map((res:Response) => res.json());
        return spots;
    }

    /**
     * Get spots neary, uses the geo native plugin to retrieve current user position
     * 
     * @param distance 
     */
    getSpotsNearby(distance: number): Promise<[any]>{

        return new Promise((resolve, reject)=>{
            
            // check that gps is available on mobile apps
            if (! this.platform.is('core') && !this.platform.is('mobileweb')) {
                this.diagnostic.isLocationEnabled().then((gpsAvailable) =>{
                    
                    if(gpsAvailable == false){
                        reject(new Error("GPS not enabled"));
                        return;
                    }
                }).catch((err) => {
                    reject(err);
                    return;
                });
            }

            // retrieve users geolocation
            this.geolocation.getCurrentPosition(this.geoLocationOptions).then((resp) => {
            
            let latitude = resp.coords.latitude;
            let longitude = resp.coords.longitude;

            // search spots by distance
            this.getSpotsByDistance(latitude, longitude, distance).subscribe(
                (spots) => {
                    resolve(spots);
                },
                (error) =>{
                    reject(new Error(error));
                }
            );

            }).catch((error) => {
                reject(error);
            });
        });
    }
}