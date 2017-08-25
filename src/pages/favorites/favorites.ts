import { Component } from '@angular/core';
import { NavController, LoadingController } from 'ionic-angular';
import { SpotService } from '../../providers/service.spot';
import { UserService } from '../../providers/service.user'
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
                public spotService: SpotService,
                public userService: UserService) {

      this.spots = [];

      let loading = this.loadingCtrl.create({
        content: 'Please wait...'
      });

      loading.present();
      this.error = null;

      this.userService.getAllFavorites().then((result) => {
        console.log(result);

        this.spotService.getSpotById(result).subscribe(
          (spot) => {
            console.log(spot);
            loading.dismiss();
            this.spots.push(spot[0]);
          },
          (error) =>{
            loading.dismiss();
            console.log(error);
          }
        );
      }).catch((err) => {
          loading.dismiss();
          console.log(err);
      });

      /*this.spotService.getAllSpots().subscribe(
          (spots) => {
            loading.dismiss();
            this.spots = spots;
          },
          (error) =>{
            loading.dismiss();
            this.error = error;
          }
        );*/
    }

    itemTapped(event, spot) {
      this.navCtrl.push(DetailPage, {
        spot: spot
      });
    }
}
