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
  distance: string = AppSettings.NEARBY_DEFAULT_DISTANCE;
  continent: string = "EU";

  //TODO: replace by actual position of the user
  defaultLatFilter: string = "43.452663";
  defaultLongFilter: string = "-3.963651";

  constructor(public navCtrl: NavController,
              public loadingCtrl: LoadingController,
              public spotService: SpotService,
              public modalCtrl: ModalController) {
                
                this.getSpotsNearby();
  }

  private getSpotsNearby(){

    let loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });

    loading.present();
    this.error = null;
    this.spots = [];

    this.spotService.getSpotsByDistance(this.continent, 
      this.defaultLatFilter, 
      this.defaultLongFilter, 
      this.distance).subscribe(
        (spots) => {
          loading.dismiss();
          this.spots = spots;
        },
        (error) =>{
          loading.dismiss();
          this.error = error;
        }
      );
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
