import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController } from 'ionic-angular';
import { AppSettings } from '../../providers/app.settings';
import { UserService } from '../../providers/service.user';
import { SpotService } from '../../providers/service.spot';
import 'leaflet';

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
  favoriteSpotIds: Array<string>;
  loadingMessage: string = "Loading...";

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public userService: UserService,
              public spotService: SpotService,
              public loadingCtrl: LoadingController) {

        this.isFav = false;
        this.favoriteSpotIds = [];
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
        result;
        if(result.thumbnail == null){
          result.thumbnail = AppSettings.DEFAULT_IMAGE_PATH;
        }
        this.spot = result;
        this.showMap();
        this.isFavorite();
        loading.dismiss();
      },
      (error)=>{
        console.log(error);
        loading.dismiss();
      });
  }

  private isFavorite(){

    this.userService.getFavoriteSpotsAttribute().then((favoriteSpotIds: string) => {

        if(favoriteSpotIds != null && favoriteSpotIds.length > 0){
          this.favoriteSpotIds = favoriteSpotIds.split("_");

          let spotId = this.spot.id;
            if(favoriteSpotIds.indexOf(spotId) > -1){
              this.isFav = true;
              this.color = "danger"; 
            }
        }
    }).catch((err) => {
        console.log(err);
    });
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
      let index: number = this.favoriteSpotIds.indexOf(spotId);
      if (index !== -1) {
          this.favoriteSpotIds.splice(index, 1);
      }
      this.userService.updateFavoriteSpotsAttribute(this.favoriteSpotIds);
    }else{

      //add
      this.isFav = true;
      this.color = "danger";
      this.favoriteSpotIds.push(spotId);
      this.userService.updateFavoriteSpotsAttribute(this.favoriteSpotIds);
    }
  }
}
