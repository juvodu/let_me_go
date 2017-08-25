import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { NearbyPage } from '../nearby/nearby';
import { ContinentsPage } from '../continents/continents';
import { FavoritesPage } from '../favorites/favorites';

@Component({
  selector: 'page-tabs',
  templateUrl: 'tabs.html'
})
export class TabsPage {

  nearbyRoot:any = NearbyPage;
  regionsRoot:any = ContinentsPage;
  favoritesRoot:any = FavoritesPage;

  constructor(public navCtrl: NavController) {}
}
