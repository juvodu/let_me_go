import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AppSettings } from '../../providers/app.settings';
import { UserService } from '../../providers/service.user';
import 'leaflet';

@Component({
  selector: 'page-detail',
  templateUrl: 'detail.html',
})
export class DetailPage {

  spot: any;
  isFav: boolean;
  color: string;
  map: any;
  favoriteSpotIds: Array<string>;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public userService: UserService) {

        this.spot = navParams.get('spot');
        this.isFav = false;
        this.favoriteSpotIds = [];
  }

  ionViewDidLoad() {

    this.showMap();
    this.isFavorite();
  }

  ionViewDidEnter(){

  }

  ionViewWillLeave() {
    /*console.log("leave!");
    this.map.off();
    this.map.remove();*/
  }


  private isFavorite(){

    this.userService.getAllFavorites().then((favoriteSpotIds: Array<string>) => {

        if(favoriteSpotIds != null){
          this.favoriteSpotIds = favoriteSpotIds;

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

    this.map = L.map('map')
      .setView([position.latitude + 0.005, position.longitude], 13);

    L.tileLayer(AppSettings.MAPBOX_API_ENDPOINT, {
        attribution: AppSettings.MAP_ATTRIBUTION,
        maxZoom: 20,
        id: 'mapbox.streets',
        accessToken: AppSettings.MAPBOX_API_KEY
    }).addTo(this.map);

    let marker = L.marker([position.latitude, position.longitude]).addTo(this.map);
    marker.bindPopup("<b>" + this.spot.name + "</b><br> " + this.spot.description).openPopup();
  }

  toggleFavorite(){

    let spotId = this.spot.id;

    //delete
    if(this.isFav == true){
      this.isFav = false;
      this.color = "primary";
      let index: number = this.favoriteSpotIds.indexOf(spotId);
      if (index !== -1) {
          this.favoriteSpotIds.splice(index, 1);
      }
      this.userService.updateFavoriteSpots(this.favoriteSpotIds);
    }else{

      //add
      this.isFav = true;
      this.color = "danger";
      this.favoriteSpotIds.push(spotId);
      this.userService.updateFavoriteSpots(this.favoriteSpotIds);
    }
  }
}
