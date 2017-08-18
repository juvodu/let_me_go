import { Component } from '@angular/core';
import { NavController, LoadingController } from 'ionic-angular';
import { User } from '../../providers/user';
import { SignupPage} from '../signup/signup';
import { ConfirmPage } from '../confirm/confirm';
import { ListPage } from '../list/list';

export class LoginDetails {
  username: string;
  password: string;
}

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  public loginDetails: LoginDetails;
  error: any;

  constructor(public navCtrl: NavController,
              public user: User,
              public loadingCtrl: LoadingController) {
    this.loginDetails = new LoginDetails(); 
  }

  ionViewDidLoad() {
    this.user.isAuthenticated().then((result) => {
      this.navCtrl.setRoot(ListPage);
    }).catch((err) => {
        console.log("User not authenticated. Showing login page.");
    });
  }

  login() {
    let loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });
    loading.present();

    let details = this.loginDetails;
    this.error = null;

    this.user.login(details.username, details.password).then((result) => {
      loading.dismiss();
      this.navCtrl.setRoot(ListPage);
    }).catch((err) => { 
      if (err.message === "User is not confirmed.") {
        loading.dismiss();
        this.navCtrl.push(ConfirmPage, { 'username': details.username });
      }
      loading.dismiss();
      this.error = err;
    });
  }

  signup() {
    this.navCtrl.push(SignupPage);
  }
}
