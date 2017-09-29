import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, LoadingController, ModalController, VirtualScroll } from 'ionic-angular';
import { SpotService } from '../../providers/service.spot';
import { DetailPage } from '../detail/detail';
import { RegionsfilterPage } from '../regionsfilter/regionsfilter';
import { AppSettings } from '../../providers/app.settings';

@Component({
  selector: 'page-regions',
  templateUrl: 'regions.html',
})
export class RegionsPage {

    @ViewChild(VirtualScroll) virtualScroll: VirtualScroll;

    spots: any = [];
    loadingMessage: string = "Finding spots in ";
    userFeedback: string = null;

    // filters
    continent: {label: string, value: string};
    country: string;
    limit: number;

    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                public loadingCtrl: LoadingController,
                public modalCtrl: ModalController,
                public spotService: SpotService) {

      this.continent = {label: navParams.get('label'), value: navParams.get('value')};
      this.getSpotsByRegionLoadingAlert();

      // set default limit
      this.limit = 100;
    }

    /**
     * Show alert while loading spots by region
     */
    getSpotsByRegionLoadingAlert(){
      
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
      
      this.getSpotsByRegion(()=>{
        this.virtualScroll.readUpdate(true);
        refresher.complete();
      });
    }

    itemTapped(event, spot) {
        this.navCtrl.push(DetailPage, {
          spotId: spot.id
        });
    }

    private getSpotsByRegion(callback){
      
      this.userFeedback = null;
      this.spotService.getSpotsByRegion(this.continent.value, this.country, this.limit).subscribe(
          (spots) => {
            if(spots.length == 0){
              this.userFeedback = "No spots found in " + this.continent.label
            }
            spots.forEach(spot=>{
              if(spot.thumbnail == null){
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

    showFilterModal(){
      
          let filterModal = this.modalCtrl.create(
            RegionsfilterPage, 
            { 
              continent: this.continent,
              country: this.country,
              limit: this.limit
          });
          filterModal.onDidDismiss(data => {
            this.continent = data.continent;
            this.country = data.country;
            this.limit = data.limit;
          });
          filterModal.present();
        }
}
