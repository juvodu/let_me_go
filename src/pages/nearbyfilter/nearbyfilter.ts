import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';
import { Analytics } from 'aws-amplify';

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

    Analytics.record('NearbyFilter', {
      distance: this.distance.toString()
    });
    //convert back to m
    this.viewCtrl.dismiss({
      distance: this.distance
    });
  }
}
