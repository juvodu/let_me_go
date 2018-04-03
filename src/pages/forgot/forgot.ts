import { Component } from '@angular/core';
import { NavController, LoadingController} from 'ionic-angular';
import { UserService } from '../../providers/service.user';
import { ResetPage} from '../../pages/reset/reset';
import { Logger, Analytics } from 'aws-amplify';

const logger = new Logger('Forgot');

@Component({
  selector: 'page-forgot',
  templateUrl: 'forgot.html',
})
export class ForgotPage {

  username:string;
  error:string;

  constructor(private navCtrl: NavController,
              private userService: UserService,
              public loadingCtrl: LoadingController) {

  }


  forgotPassword(){

    let loading = this.loadingCtrl.create({
      content: 'Requesting verification code...'
    });
    loading.present();

    this.userService.forgotPassword(this.username).then(
        (data) => {

            loading.dismiss();
            let email = data.CodeDeliveryDetails.Destination;
            this.navCtrl.push(ResetPage, { username: this.username, email: email});

        },
        error => {

            logger.error(error);
            this.error = error;
            loading.dismiss();
            Analytics.record('Error', error);

        });
  }
}
