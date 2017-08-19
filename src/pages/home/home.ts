import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { UserService } from '../../providers/service.user';
import { LoginPage } from '../login/login';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public navCtrl: NavController, public userService: UserService) {
  }

  logout(){
    this.userService.logout();
    this.navCtrl.setRoot(LoginPage);
  }
}
