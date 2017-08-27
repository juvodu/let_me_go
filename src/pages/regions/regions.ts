import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController } from 'ionic-angular';
import { SpotService } from '../../providers/service.spot';
import { DetailPage } from '../detail/detail';

@Component({
  selector: 'page-regions',
  templateUrl: 'regions.html',
})
export class RegionsPage {

    error: any;
    continent: {label: string, value: string};
    spots: any = {};

    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                public loadingCtrl: LoadingController,
                public spotService: SpotService) {

      this.continent = {label: navParams.get('label'), value: navParams.get('value')};
      this.spots = [];

      let loading = this.loadingCtrl.create({
        content: 'Finding spots in ' + this.continent.label
      });

      loading.present();
      this.error = null;

      this.spotService.getSpotsByContinent(this.continent.value).subscribe(
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
