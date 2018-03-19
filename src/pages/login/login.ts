import { Component } from '@angular/core';
import { NavController, LoadingController } from 'ionic-angular';
import { CognitoService } from '../../providers/service.cognito';
import { SignupPage} from '../signup/signup';
import { ConfirmPage } from '../confirm/confirm';
import { TabsPage } from '../tabs/tabs';

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
              public cognitoService: CognitoService,
              public loadingCtrl: LoadingController) {
    this.loginDetails = new LoginDetails(); 
  }

  login() {
    let loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });
    loading.present();

    let details = this.loginDetails;
    this.error = null;

    this.cognitoService.login(details.username, details.password).then((result) => {

      loading.dismiss();
      this.navCtrl.setRoot(TabsPage);

    }).catch((err) => {
      
      if (err.message === "User is not confirmed.") {
        loading.dismiss();
        this.navCtrl.push(ConfirmPage, { 'username': details.username });
      }
      loading.dismiss();
      this.error = err;
    });
  }

  showSignupPage() {
    this.navCtrl.push(SignupPage);
  }
}
