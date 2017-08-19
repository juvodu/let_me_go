import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
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

        let spots = this.http.get(AppSettings.SPOT_API_ENDPOINT + "/spots")
             .map((res:Response) => res.json());
        return spots;
    };
}