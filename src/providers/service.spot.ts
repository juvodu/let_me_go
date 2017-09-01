import { Injectable } from '@angular/core';
import { Http, Response, RequestOptions, Headers, URLSearchParams } from '@angular/http';
import { Geolocation } from '@ionic-native/geolocation';
import { UserService } from './service.user';
import { Observable } from 'rxjs/Observable';
import { AppSettings } from './app.settings';
import 'rxjs/add/observable/forkJoin';
import 'rxjs/add/operator/map';

/**
 * Service for retrieving surfspots
 * @author Juvodu
 * 
 */
@Injectable()
export class SpotService {

    headers: Headers;

    constructor(public http: Http,
                public userService:UserService,
                public geolocation: Geolocation) {

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
     * Get all spots for a specific continent
     * @param continent 
     */
    getSpotsByContinent(continent: string): Observable<any>{

        let options:RequestOptions = new RequestOptions({headers: this.headers});
        let params: URLSearchParams = new URLSearchParams();
        params.set('continent', continent);
        options.params = params;

        let spots = this.http.get(AppSettings.SPOT_API_ENDPOINT + "spot", options)
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

        let spots = this.http.get(AppSettings.SPOT_API_ENDPOINT + "spot", options)
             .map((res:Response) => res.json());
        return spots;
    }

    /**
     * Get all favorite spot for the current user
     */
    getSpotsByFavorite(): Promise<[any]>{
        
        return new Promise((resolve, reject)=>{
            this.userService.getAllFavorites().then((favoriteSpotIds: string[]) => {
                
                // create an observable request for each spotId to request detailed information
                let favoriteSpots: Array<Observable<any>> = [];
                if(favoriteSpotIds == null){
                    resolve([]); // return empty list
                }
                favoriteSpotIds.forEach(
                    (favoriteSpotId) => {
                        favoriteSpots.push(this.getSpotById(favoriteSpotId));
                    }
                );

                // run observables in parrallel
                Observable.forkJoin(favoriteSpots).subscribe(
                    (results) => {

                        //returns n array we just concat and return as single result list
                        let spots: Array<any> = [];
                        if(results != null){
                            results.forEach(
                                (result)=>{
                                    
                                    // ignore null values
                                    let spot = result[0];
                                    if(spot != null){
                                        spots.push(result[0]);
                                    }
                                }
                            )
                        }

                        resolve(spots);
                    },
                    (err) => {
                        reject(err);
                });
            }).catch((err) => {
                reject(err);
          });
        });
    }

    /**
     * Get spots neary, uses the geo native plugin to retrieve current user position
     * @param continent
     * @param distance 
     */
    getSpotsNearby(continent: string, distance: number): Promise<[any]>{

        return new Promise((resolve, reject)=>{

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