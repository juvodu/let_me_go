import { Injectable } from '@angular/core';
import { Http, Response, RequestOptions, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { AppSettings } from './app.settings';
import { UserService } from './service.user';

/**
 * Service to create and delete favorite records
 * 
 * @author Juvodu
 */
@Injectable()
export class FavoriteService {

    headers: Headers;

    constructor(private http: Http,
                private userService: UserService) {

        this.headers = new Headers();
        this.headers.append('x-api-key', AppSettings.SPOT_API_KEY);
    }

    /**
     * Create a favorite record for the current user
     * 
     * @param spotId
     *          the spot the user wants to save as a favorite
     */
    createFavorite(spotId:string): Observable<Response>{
        
        let user = this.userService.getCurrentUser();
        let options:RequestOptions = new RequestOptions({headers: this.headers});
        let postParams = {
            userId: user.id,
            spotId: spotId
          };

        return this.http.post(AppSettings.SPOT_API_ENDPOINT + "favorite/create", postParams, options);
    }

    /**
     * Delete a favorite record of the current user
     * 
     * @param spotId
     *          the spot the user wants to remove as a favorite
     */
    deleteFavorite(spotId:string): Observable<Response>{
        
        let user = this.userService.getCurrentUser();
        let options:RequestOptions = new RequestOptions({headers: this.headers});
        let postParams = {
            userId: user.id,
            spotId: spotId
          };

        return this.http.post(AppSettings.SPOT_API_ENDPOINT + "favorite/delete", postParams, options);
    }
}