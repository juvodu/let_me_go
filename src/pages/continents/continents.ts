import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { RegionsPage } from '../regions/regions'; 

@Component({
  selector: 'page-continents',
  templateUrl: 'continents.html',
})
export class ContinentsPage {
  
  continents: Array<{label: string, value: string}>;

  constructor(public navCtrl: NavController, public navParams: NavParams) {

     this.continents = [
      { label: 'Africa', value: "AF" },
      { label: 'Antarctica', value: "AN" },
      { label: 'Asia', value: "AS" },
      { label: 'Europe', value: "EU" },
      { label: 'North America', value: "NA" },
      { label: 'Oceania', value: "OC" },
      { label: 'South America', value: "SA" }
    ];
  }

  openPage(label, value) {

    this.navCtrl.push(RegionsPage, {
      label: label,
      value: value
    });
  }
}
