import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';
import { Http, Response, RequestOptions, Headers, URLSearchParams } from '@angular/http';
import { Geolocation } from '@ionic-native/geolocation';
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

    headers: Headers;

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

        let spot: any = this.http.get(AppSettings.SPOT_API_ENDPOINT + "spots", options)
             .map((res:Response) => res.json());
        return spot;
    }

    /**
     * Get all available spots
     */
    getAllSpots(): Observable<any>{

        let options:RequestOptions = new RequestOptions({headers: this.headers});
        let spots = this.http.get(AppSettings.SPOT_API_ENDPOINT + "spots", options)
             .map((res:Response) => res.json());
        return spots;
    };

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
    * @param continent
    * @param lat 
    * @param long 
    * @param distance 
    */
    getSpotsByDistance(continent: string, lat: number, lon: number, distance: number): Observable<any>{

        let options:RequestOptions = new RequestOptions({headers: this.headers});
        let params: URLSearchParams = new URLSearchParams();
        params.set('continent', continent);
        params.set('lat', String(lat));
        params.set('lon', String(lon));
        params.set('distance', String(distance));
        options.params = params;

        let spots = this.http.get(AppSettings.SPOT_API_ENDPOINT + "spots", options)
             .map((res:Response) => res.json());
        return spots;
    }

    /**
     * Get all favorite spots for the current user
     */
    getFavoriteSpots(): Promise<Array<any>>{
        
        return new Promise((resolve, reject)=>{
            this.userService.getFavoriteSpotsAttribute().then((favoriteSpotIds: String) => {
                
                // create an observable request for each spotId to request detailed information
                let favoriteSpots: Array<any> = [];
                if(favoriteSpotIds == null){
                    resolve(favoriteSpots); // return empty list
                    return;
                }

                // retrieve list of spots
                this.getSpotsByIds(favoriteSpotIds).subscribe(
                    (result)=>{
                      resolve(result);
                    },
                    (error)=>{
                      reject(error);
                    });

            }).catch((err) => {
                reject(err);
          });
        });
    }

    /**
     * Get spots neary, uses the geo native plugin to retrieve current user position
     * 
     * @param continent
     * @param distance 
     */
    getSpotsNearby(continent: string, distance: number): Promise<[any]>{

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
                });
            }

            // retrieve users geolocation
            this.geolocation.getCurrentPosition().then((resp) => {
            
            let latitude = resp.coords.latitude;
            let longitude = resp.coords.longitude;

            // search spots by distance
            this.getSpotsByDistance(continent, latitude, longitude, distance).subscribe(
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