import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, Loading, ToastController} from 'ionic-angular';
import { AppSettings } from '../../providers/app.settings';
import { SpotService } from '../../providers/service.spot';
import { FavoriteService } from '../../providers/service.favorite';
import { UserService } from '../../providers/service.user';
import * as L from 'leaflet';

@Component({
  selector: 'page-detail',
  templateUrl: 'detail.html',
})
export class DetailPage {

  spot: any = {};
  isFavorite: boolean = false;
  isNotification: boolean = false;
  mapId: string;
  map: any;
  loadingMessage: string = "Loading...";
  userFeedback: string;

  // forecast info
  lastUpdateDate: string;
  hourlyCondition: any;
  tides: Array<any>;
  user: any;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private spotService: SpotService,
              private favoriteService: FavoriteService,
              private userService: UserService,
              public loadingCtrl: LoadingController,
              public toastCtrl: ToastController) {

        this.mapId = "map-" + Math.floor((1 + Math.random()) * 0x10000);

        this.userService.getCurrentUser().then(user => {

          this.user = user;
          this.getSpot(navParams.get('spotId')); 
        },
        error => {
            this.userFeedback = error;
        });
  }

  getSpot(spotId:string){

    let loading:Loading = this.loadingCtrl.create({
      content: this.loadingMessage
    });
    loading.present();

    this.spotService.getSpotById(this.user, spotId).subscribe(
      (result)=>{

        if(result.thumbnail == null){
          result.thumbnail = AppSettings.DEFAULT_IMAGE_PATH;
        }
        this.spot = result;
        this.showMap();
        
        // disply spot as user favorite
        if(this.spot.favorite){
          this.isFavorite = true;          
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

    let loading:Loading = this.loadingCtrl.create({
      content: this.loadingMessage
    });
    loading.present();

    let spotId = this.spot.id;

    //delete
    if(this.isFavorite == true){
      this.isFavorite = false;
      this.favoriteService.deleteFavorite(this.user, spotId).subscribe(
        (result)=>{
            loading.dismiss();
            this.showToast("Favorite deleted");
        },
        (error)=>{
          alert(error);
          this.userFeedback = error;
          loading.dismiss();
          this.showToast(error);
        });
    }else{

      //add
      this.isFavorite = true;
      this.favoriteService.createFavorite(this.user, spotId).subscribe(
        (result)=>{
            loading.dismiss();
            this.showToast("Favorite saved");
        },
        (error)=>{
          alert(error);
          this.userFeedback = error;
          loading.dismiss();
          this.showToast(error);
        });
    }
  }

  /**
   * Helper message to display a toast on the bottom of the screen for 3 seconds
   * 
   * @param message
   *          the message to be displayed
   */
  private showToast(message:string){

    let toast = this.toastCtrl.create({
      message: message,
      duration: 3000,
      position: 'bottom'
    });

    toast.present();
  }
}
