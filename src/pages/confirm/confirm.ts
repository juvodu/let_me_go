import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { LoginPage } from '../login/login';
import { UserService } from '../../providers/service.user';

@Component({
  selector: 'page-confirm',
  templateUrl: 'confirm.html',
})
export class ConfirmPage {

  public code: string;
  public username: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, public userService: UserService) {
    this.username = navParams.get('username');
  }

  confirm() {
    this.userService.confirmRegistration(this.username, this.code).then(() => {
      this.navCtrl.push(LoginPage);
    });
  }

  resendCode() {
    this.userService.resendRegistrationCode(this.username);
  }
}
