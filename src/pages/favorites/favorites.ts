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

    }

    ionViewDidEnter(){
      
        // refresh favorites each time page is entered
        this.getFavorites();
    }

    getFavorites(){

      let loading = this.loadingCtrl.create({
        content: 'Fetching your favorite spots...'
      });

      loading.present();
      this.error = null;

      this.spotService.getSpotsByFavorite().then((spots) => {

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
}
