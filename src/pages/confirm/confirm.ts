import { Component } from '@angular/core';
import { NavController, NavParams, ToastController, LoadingController} from 'ionic-angular';
import { LoginPage } from '../login/login';
import { UserService } from '../../providers/service.user';
import { Logger, Analytics } from 'aws-amplify';

const logger = new Logger('Confirm');

@Component({
  selector: 'page-confirm',
  templateUrl: 'confirm.html',
})
export class ConfirmPage {

  private code: string;
  private username: string;
  error: any;

  constructor(private navCtrl: NavController,
              public navParams: NavParams,
              private toastCtrl: ToastController,
              private userService: UserService,
              public loadingCtrl: LoadingController) {

    this.username = navParams.get('username');
  }

  confirm() {

    let loading = this.loadingCtrl.create({
      content: 'Confirming Signup...'
    });
    loading.present();
    
    this.userService.confirmRegistration(this.username, this.code)
      .then(data => {

        let toast = this.toastCtrl.create({
          message: 'User was registered successfully',
          duration: 2000,
          position: 'bottom'
        });
        
        loading.dismiss();
        toast.present();
        this.navCtrl.setRoot(LoginPage); 

      },
      error => {

        loading.dismiss();
        logger.error('confirm error', error);
        this.error = error;
        Analytics.record('Error', error);

      });
  }

  resendCode() {

    let loading = this.loadingCtrl.create({
      content: 'Resending code...'
    });
    loading.present();

    this.userService.resendConfirmCode(this.username)
      .then(() => {

        let toast = this.toastCtrl.create({
          message: 'Code was resent. Please check your mail inbox.',
          duration: 2000,
          position: 'bottom'
        });

        loading.dismiss();
        toast.present();

      }, error => 
      {

        loading.dismiss();
        logger.error('send code error', error);
        this.error = error;
        Analytics.record('Error', error);

      });
  }
}
