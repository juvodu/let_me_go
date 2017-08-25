import { Component } from '@angular/core';
import { NavController, LoadingController } from 'ionic-angular';
import { SpotService } from '../../providers/service.spot';
import { DetailPage } from '../detail/detail';

@Component({
  selector: 'page-favorites',
  templateUrl: 'favorites.html',
})
export class FavoritesPage {

    error: any;
    spots: any = {};

    constructor(public navCtrl: NavController,
                public loadingCtrl: LoadingController,
                public spotService: SpotService) {

      this.spots = [];

      let loading = this.loadingCtrl.create({
        content: 'Please wait...'
      });

      loading.present();
      this.error = null;

      this.spotService.getAllSpots().subscribe(
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
