import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';

@Component({
  selector: 'page-nearbyfilter',
  templateUrl: 'nearbyfilter.html',
})
export class NearbyfilterPage {

  distance: number;
  continent: string;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public viewCtrl: ViewController) {
                
                // m to km - in the UI the user will select km
                this.distance = navParams.get("distance") / 1000;
                this.continent = navParams.get("continent");
  }

  dismiss(){
    this.viewCtrl.dismiss({
      //convert back to m
      distance: this.distance * 1000,
      continent: this.continent
    });
  }
}
