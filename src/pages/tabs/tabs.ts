import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { NearbyPage } from '../nearby/nearby';
import { RegionsPage } from '../regions/regions';
import { FavoritesPage } from '../favorites/favorites';

@Component({
  selector: 'page-tabs',
  templateUrl: 'tabs.html'
})
export class TabsPage {

  nearbyRoot:any = NearbyPage;
  regionsRoot:any = RegionsPage;
  favoritesRoot:any = FavoritesPage;

  constructor(public navCtrl: NavController) {}
}
