import { Injectable } from '@angular/core';
import { Http, Response, RequestOptions, Headers, URLSearchParams } from '@angular/http';
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

    constructor(public http: Http, public userService:UserService) {

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
    getSpotsByDistance(continent: string, lat: string, lon: string, distance: string): Observable<any>{

        let options:RequestOptions = new RequestOptions({headers: this.headers});
        let params: URLSearchParams = new URLSearchParams();
        params.set('continent', continent);
        params.set('lat', lat);
        params.set('lon', lon);
        params.set('distance', distance);
        options.params = params;

        let spots = this.http.get(AppSettings.SPOT_API_ENDPOINT + "spot", options)
             .map((res:Response) => res.json());
        return spots;
    }

    /**
     * Get all favorite spot for the current user
     */
    getSpotsByFavorite(){
        
        return new Promise((resolve, reject)=>{
            this.userService.getAllFavorites().then((favoriteSpotIds: string[]) => {
                
                // create an observable request for each spotId to request detailed information
                let favoriteSpots: Array<Observable<any>> = [];
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
                        if(results != undefined){
                            results.forEach(
                                (result)=>{
                                    spots.push(result[0]);
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
}