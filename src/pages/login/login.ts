import { Component } from '@angular/core';
import { NavController, LoadingController } from 'ionic-angular';
import { SignupPage} from '../signup/signup';
import { TabsPage } from '../tabs/tabs';
import { Logger, Analytics } from 'aws-amplify';
import { UserService} from '../../providers/service.user'

const logger = new Logger('Login'); 

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
              public loadingCtrl: LoadingController,
              private userService: UserService) {

    this.loginDetails = new LoginDetails(); 
  }

  login() {
    let loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });
    loading.present();

    let details = this.loginDetails;
    this.error = null;

    logger.info('login..');

    this.userService.login(details.username, details.password)
      .then( user => {

        logger.info('signed in user', user);
        // trigger global login event
        this.userService.loginObserver.next(user.username);
        loading.dismiss();
        this.navCtrl.setRoot(TabsPage);

      },
      error => {

        this.error = error;
        loading.dismiss();
        Analytics.record('Error', error);

      });
  }

  showSignupPage() {
    this.navCtrl.push(SignupPage);
  }
}
