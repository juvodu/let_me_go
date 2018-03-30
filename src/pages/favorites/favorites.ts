import { Component, ViewChild } from '@angular/core';
import { NavController, LoadingController, VirtualScroll } from 'ionic-angular';
import { SpotService } from '../../providers/service.spot';
import { UserService } from '../../providers/service.user';
import { AppSettings } from '../../providers/app.settings';
import { DetailPage } from '../detail/detail';

@Component({
  selector: 'page-favorites',
  templateUrl: 'favorites.html',
})
export class FavoritesPage {

    @ViewChild(VirtualScroll) virtualScroll: VirtualScroll;

    spots: any = [];
    loadingMessage: string = "Updating your favorite spots";
    userFeedback: string = null;
    user: any; 

    constructor(public navCtrl: NavController,
                public loadingCtrl: LoadingController,
                private spotService: SpotService,
                private userService: UserService) {
                  
                  this.userService.getCurrentUser().then(
                    user => {
                      this.user = user;
                      this.getSpotsByFavoritesLoadingAlert();
                    },
                    error => {
                      this.userFeedback = error;
                    });
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
      
      this.getFavorites(()=>{
        this.virtualScroll.readUpdate(true);
        refresher.complete();
      });
    }

    itemTapped(event, spot) {
      this.navCtrl.push(DetailPage, {
        spotId: spot.id
      });
    }

    private getFavorites(callback){

      this.userFeedback = null;
      this.spotService.getFavoriteSpots(this.user, 10).subscribe(
        (spots) => {
          if(spots.length == 0){
            this.userFeedback = "You have no favorites stored yet"
          }
          spots.forEach(spot=>{
            if(spot != null && spot.thumbnail == null){
              spot.thumbnail = AppSettings.DEFAULT_IMAGE_PATH;
            }
          });

          this.spots = spots;
          callback();
        },
        (error) =>{
          this.userFeedback = error;
          callback();
        }
      );
    }
}
