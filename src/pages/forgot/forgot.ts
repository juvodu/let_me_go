import { Component } from '@angular/core';
import { NavController, LoadingController} from 'ionic-angular';
import { LoginPage } from '../login/login';
import { UserService } from '../../providers/service.user';
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

    //TODO: validation
    this.userService.forgotPassword(this.username).then(
        (data) => {
            logger.info(data);
        },
        error => {
            logger.error(error);
            Analytics.record('Error', error);
        });
  }
}
