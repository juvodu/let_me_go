import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';

@Component({
  selector: 'page-nearbyfilter',
  templateUrl: 'nearbyfilter.html',
})
export class NearbyfilterPage {

  distance: number;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public viewCtrl: ViewController) {
                
                // m to km - in the UI the user will select km
                this.distance = navParams.get("distance");
  }

  dismiss(){
    this.viewCtrl.dismiss({
      //convert back to m
      distance: this.distance
    });
  }
}
