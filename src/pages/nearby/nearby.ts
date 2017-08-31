import { Component } from '@angular/core';
import { NavController, LoadingController, ModalController } from 'ionic-angular';
import { SpotService } from '../../providers/service.spot';
import { DetailPage } from '../detail/detail';
import { NearbyfilterPage } from '../nearbyfilter/nearbyfilter';
import { AppSettings } from '../../providers/app.settings';

@Component({
  selector: 'page-nearby',
  templateUrl: 'nearby.html',
})
export class NearbyPage {

  spots: any = [];
  loadingMessage: string = "Searching for spots nearby...";
  userFeedback: string = null;

  //filter
  distance: number = AppSettings.NEARBY_DEFAULT_DISTANCE;
  continent: string = "EU";

  constructor(public navCtrl: NavController,
              public loadingCtrl: LoadingController,
              public spotService: SpotService,
              public modalCtrl: ModalController) {
                
              this.getSpotsNearbyLoadingAlert();
  }

  /**
   * Show alert while loading spots nearby
   */
  getSpotsNearbyLoadingAlert(){
    
    let loading = this.loadingCtrl.create({
      content: this.loadingMessage
    });
    loading.present();
    this.getSpotsNearby(()=>loading.dismiss());
  }

  /**
   * Show refresher while loading spots nearby
   */
  getSpotsNearbyRefresher(refresher){
    
    this.getSpotsNearby(()=>refresher.complete());
  }


  private getSpotsNearby(callback){

   
    this.userFeedback = null;
    this.spotService.getSpotsNearby(this.continent, this.distance).then((spots) => {

      if(spots.length == 0){
        this.userFeedback = "No spots found nearby..."
      }
      this.spots = spots;
      callback();
      
    }).catch((error) => {
      
      this.userFeedback = error.message;
      callback();
    });
  }

  itemTapped(event, spot) {
    this.navCtrl.push(DetailPage, {
      spot: spot
    });
  }

  showFilterModal(){

    let filterModal = this.modalCtrl.create(
      NearbyfilterPage, 
      { 
        distance: this.distance,
        continent: this.continent
    });
    filterModal.onDidDismiss(data => {
      this.distance = data.distance;
      this.continent = data.continent;
    });
    filterModal.present();
  }
}
