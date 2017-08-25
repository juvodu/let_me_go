import { Component } from '@angular/core';
import { NavController, LoadingController } from 'ionic-angular';
import { SpotService } from '../../providers/service.spot';
import { DetailPage } from '../detail/detail';

@Component({
  selector: 'page-nearby',
  templateUrl: 'nearby.html',
})
export class NearbyPage {

  error: any;
  spots: any = {};
  defaultDistanceFilter: string = "10";

  //TODO: replace by actual position of the user
  defaultContinentFilter: string = "EU";
  defaultLatFilter: string = "43.452663";
  defaultLongFilter: string = "-3.963651";

  constructor(public navCtrl: NavController,
              public loadingCtrl: LoadingController,
              public spotService: SpotService) {

    this.spots = [];

    let loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });

    loading.present();
    this.error = null;

    this.spotService.getSpotsByDistance(this.defaultContinentFilter, 
      this.defaultLatFilter, 
      this.defaultLongFilter, 
      this.defaultDistanceFilter).subscribe(
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
}
