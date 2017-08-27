import { Component } from '@angular/core';
import { NavController, LoadingController, ModalController } from 'ionic-angular';
import { SpotService } from '../../providers/service.spot';
import { DetailPage } from '../detail/detail';
import { NearbyfilterPage } from '../nearbyfilter/nearbyfilter';
import { AppSettings } from '../../providers/app.settings';

@Component({
  selector: 'page-nearby',
  templateUrl: 'nearby.html',
})
export class NearbyPage {

  error: any;
  spots: any = {};

  //filter
  distance: number = AppSettings.NEARBY_DEFAULT_DISTANCE;
  continent: string = "EU";

  constructor(public navCtrl: NavController,
              public loadingCtrl: LoadingController,
              public spotService: SpotService,
              public modalCtrl: ModalController) {
                
                this.getSpotsNearby();
  }

  private getSpotsNearby(){

    let loading = this.loadingCtrl.create({
      content: 'Searching for spots nearby...'
    });

    loading.present();
    this.error = null;
    this.spots = [];

    this.spotService.getSpotsNearby(this.continent, this.distance).then((spots) => {

      loading.dismiss();
      this.spots = spots;

    }).catch((error) => {

      loading.dismiss();
      console.log(error);
    });
  }

  itemTapped(event, spot) {
    this.navCtrl.push(DetailPage, {
      spot: spot
    });
  }

  showFilterModal(){
    let filterModal = this.modalCtrl.create(
      NearbyfilterPage, 
      { 
        distance: this.distance,
        continent: this.continent
    });
    filterModal.onDidDismiss(data => {
      this.distance = data.distance;
      this.continent = data.continent;
      this.getSpotsNearby();
    });
    filterModal.present();
  }
}
