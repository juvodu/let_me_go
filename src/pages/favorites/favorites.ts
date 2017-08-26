import { Component } from '@angular/core';
import { NavController, LoadingController } from 'ionic-angular';
import { SpotService } from '../../providers/service.spot';
import { DetailPage } from '../detail/detail';
import { Observable } from 'rxjs/Observable';

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
        content: 'Please wait...'
      });

      loading.present();
      this.error = null;

      this.spotService.getSpotsByFavorite().then((spots) => {

          loading.dismiss();
          this.spots = spots;
        },
        (error) =>{
          loading.dismiss();
          console.log(error);
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
