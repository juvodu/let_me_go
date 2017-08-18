import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { User } from '../../providers/user';
import { LoginPage } from '../login/login';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public navCtrl: NavController, public user: User) {
  }

  logout(){
    this.user.logout();
    this.navCtrl.setRoot(LoginPage);
  }
}
