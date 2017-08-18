import { Component } from '@angular/core';
import { NavController, LoadingController } from 'ionic-angular';
import { User } from '../../providers/user';
import { ConfirmPage } from '../confirm/confirm';

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
              public user: User,
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

    this.user.register(details.username, details.password, {'email': details.email}).then((user) => {
      loading.dismiss();
      this.navCtrl.push(ConfirmPage, { username: details.username });
    }).catch((err) => {
      loading.dismiss();
      this.error = err;
    });
  }
}
