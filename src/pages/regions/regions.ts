import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController } from 'ionic-angular';
import { SpotService } from '../../providers/service.spot';
import { DetailPage } from '../detail/detail';

@Component({
  selector: 'page-regions',
  templateUrl: 'regions.html',
})
export class RegionsPage {

    continent: {label: string, value: string};
    spots: any = [];
    loadingMessage: string = "Finding spots in ";
    userFeedback: string = null;

    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                public loadingCtrl: LoadingController,
                public spotService: SpotService) {

      this.continent = {label: navParams.get('label'), value: navParams.get('value')};
      this.getSpotsNearbyLoadingAlert();
    }

    /**
     * Show alert while loading spots by region
     */
    getSpotsNearbyLoadingAlert(){
      
      let loading = this.loadingCtrl.create({
        content: this.loadingMessage + this.continent.label
      });
      loading.present();
      this.getSpotsByRegion(()=>loading.dismiss());
    }

    /**
     * Show refresher while loading spots by region
     */
    getSpotsByRegionRefresher(refresher){
      
      this.getSpotsByRegion(()=>refresher.complete());
    }

    itemTapped(event, spot) {
        this.navCtrl.push(DetailPage, {
          spot: spot
        });
    }

    private getSpotsByRegion(callback){
      
      this.userFeedback = null;
      this.spotService.getSpotsByContinent(this.continent.value).subscribe(
          (spots) => {
            if(spots.length == 0){
              this.userFeedback = "No spots found in " + this.continent.label
            }
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
