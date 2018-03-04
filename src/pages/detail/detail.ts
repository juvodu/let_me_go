import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController } from 'ionic-angular';
import { AppSettings } from '../../providers/app.settings';
import { SpotService } from '../../providers/service.spot';
import { FavoriteService } from '../../providers/service.favorite';
import * as L from 'leaflet';

@Component({
  selector: 'page-detail',
  templateUrl: 'detail.html',
})
export class DetailPage {

  spot: any = {};
  isFav: boolean;
  color: string;
  mapId: string;
  map: any;
  loadingMessage: string = "Loading...";
  userFeedback: string;

  // forecast info
  lastUpdateDate: string;
  hourlyCondition: any;
  tides: Array<any>;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public spotService: SpotService,
              public favoriteService: FavoriteService,
              public loadingCtrl: LoadingController) {

        this.isFav = false;
        this.mapId = "map-" + Math.floor((1 + Math.random()) * 0x10000);
        this.color = "light_grey";
        this.getSpot(navParams.get('spotId')); 
  }

  getSpot(spotId:string){

    let loading = this.loadingCtrl.create({
      content: this.loadingMessage
    });
    loading.present();

    this.spotService.getSpotById(spotId).subscribe(
      (result)=>{

        if(result.thumbnail == null){
          result.thumbnail = AppSettings.DEFAULT_IMAGE_PATH;
        }
        this.spot = result;
        this.showMap();
        
        // disply spot as user favorite
        if(this.spot.favorite){
          this.isFav = true;          
          this.color = "danger";           
        }

        if(this.spot.forecast != null && this.spot.cronDate != null){
          this.getConditionInfo();
        }        
        loading.dismiss();
      },
      (error)=>{
        console.log(error);
        this.userFeedback = error;
        loading.dismiss();
      });
  }

  private getConditionInfo(){

    this.lastUpdateDate = new Date(this.spot.cronDate).toISOString();
    let forecastToday = this.spot.forecast.data.weather[0];
    this.tides = forecastToday.tides[0].tide_data;

    // array of conditions - each covers a 6 hour time window
    const currentHour = new Date().getHours();
    let index: number = Math.floor(currentHour / 6);
    this.hourlyCondition = forecastToday.hourly[index];
  }

  private showMap(){

    let position = this.spot.position;

    this.map = L.map(this.mapId)
      .setView([position.latitude + 0.005, position.longitude], 13);

    L.tileLayer(AppSettings.MAPBOX_API_ENDPOINT, {
        attribution: AppSettings.MAP_ATTRIBUTION,
        maxZoom: 20,
        id: 'mapbox.streets',
        accessToken: AppSettings.MAPBOX_API_KEY
    }).addTo(this.map);

    let marker = L.marker([position.latitude, position.longitude]).addTo(this.map);
    marker.bindPopup("<b>" + this.spot.name + "</b><br> " + this.spot.walk).openPopup();
  }

  toggleFavorite(){

    let spotId = this.spot.id;

    //delete
    if(this.isFav == true){
      this.isFav = false;
      this.color = "light_grey"; 
      this.favoriteService.deleteFavorite(spotId).subscribe(
        (result)=>{
            console.log("Deleted favorite!");
        },
        (error)=>{
          alert(error);
          this.userFeedback = error;
        });
    }else{

      //add
      this.isFav = true;
      this.color = "danger";
      this.favoriteService.createFavorite(spotId).subscribe(
        (result)=>{
            console.log("Created favorite!");
        },
        (error)=>{
          alert(error);
          this.userFeedback = error;
        });
    }
  }
}
