import { Component } from '@angular/core';
import { NavController, LoadingController } from 'ionic-angular';
import { UserService } from '../../providers/service.user';
import { ConfirmPage } from '../confirm/confirm';
import { LoginPage } from '../login/login';

export class UserDetails {
    username: string;
    email: string;
    password: string;
}

@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
})
export class SignupPage {

  public userDetails: UserDetails;
  error: any;


  constructor(public navCtrl: NavController,
              public userService: UserService,
              public loadingCtrl: LoadingController) {
   this.userDetails = new UserDetails();
  }

  signup(){

    let loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });
    loading.present();

    let details = this.userDetails;
    this.error = null;

    this.userService.register(details.username, details.password, {'email': details.email}).then((user) => {
      loading.dismiss();
      this.navCtrl.push(ConfirmPage, { username: details.username });
    }).catch((err) => {
      loading.dismiss();
      this.error = err;
    });
  }

  showLoginPage(){
    this.navCtrl.setRoot(LoginPage);
  }
}
