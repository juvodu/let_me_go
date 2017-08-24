import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AppSettings } from '../../providers/app.settings';
import 'leaflet';

@Component({
  selector: 'page-detail',
  templateUrl: 'detail.html',
})
export class DetailPage {

  spot: any;

  constructor(public navCtrl: NavController, public navParams: NavParams) {

        this.spot = navParams.get('spot');
  }

  ionViewDidLoad() {

    //show map
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
}
