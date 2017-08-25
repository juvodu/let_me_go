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
  attributes: any;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public userService: UserService) {

        this.spot = navParams.get('spot');
  }

  ionViewDidLoad() {

    this.showMap();
    this.userService.getUser().getUserAttributes((err, data) => {
      this.attributes = data;
      console.log(this.attributes);
    });
  }

  showMap(){

    let position = this.spot.position;
    let map = L.map('map')
      .setView([position.latitude + 0.005, position.longitude], 13);

    L.tileLayer(AppSettings.MAPBOX_API_ENDPOINT, {
        attribution: AppSettings.MAP_ATTRIBUTION,
        maxZoom: 20,
        id: 'mapbox.streets',
        accessToken: AppSettings.MAPBOX_API_KEY
    }).addTo(map);

    let marker = L.marker([position.latitude, position.longitude]).addTo(map);
    marker.bindPopup("<b>" + this.spot.name + "</b><br> " + this.spot.description).openPopup();
  }

  toggleFavorite(){

    this.userService.addFavorite(this.spot.id);
  }
}
