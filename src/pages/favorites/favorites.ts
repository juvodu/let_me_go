import { Component } from '@angular/core';
import { NavController, LoadingController } from 'ionic-angular';
import { SpotService } from '../../providers/service.spot';
import { DetailPage } from '../detail/detail';

@Component({
  selector: 'page-favorites',
  templateUrl: 'favorites.html',
})
export class FavoritesPage {

    spots: any = [];
    loadingMessage: string = "Updating your favorite spots";
    userFeedback: string = null;

    constructor(public navCtrl: NavController,
                public loadingCtrl: LoadingController,
                public spotService: SpotService) {
                  
                  this.getSpotsByFavoritesLoadingAlert();
    }

    /**
     * Show alert while loading favorite spots
     */
    getSpotsByFavoritesLoadingAlert(){
      
      let loading = this.loadingCtrl.create({
        content: this.loadingMessage
      });
      loading.present();
      this.getFavorites(()=>loading.dismiss());
    }

    /**
     * Show refresher while loading favorite spots
     */
    getSpotsByFavoritesRefresher(refresher){
      
      this.getFavorites(()=>refresher.complete());
    }

    itemTapped(event, spot) {
      this.navCtrl.push(DetailPage, {
        spot: spot
      });
    }

    private getFavorites(callback){

      this.userFeedback = null;
      this.spotService.getSpotsByFavorite().then((spots) => {

          if(spots.length == 0){
            this.userFeedback = "You have no favorites stored yet"
          }
          this.spots = spots;
          callback();

        }).catch((error) => {

          this.userFeedback = error;
          callback();
      });
    }
}
