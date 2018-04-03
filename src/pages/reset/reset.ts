import { Component } from '@angular/core';
import { NavController, ToastController, NavParams, LoadingController} from 'ionic-angular';
import { UserService } from '../../providers/service.user'; 
import { LoginPage } from '../../pages/login/login'
import { Logger, Analytics } from 'aws-amplify';

const logger = new Logger('Reset');

@Component({
  selector: 'page-reset',
  templateUrl: 'reset.html',
})
export class ResetPage {

  username:string;
  code:string;
  password:string;
  email:string;
  error:string;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public loadingCtrl: LoadingController,
              public toastCtrl: ToastController,
              private userService: UserService) {

                this.username = navParams.get('username');
                this.email = navParams.get('email');
  }

  forgotPasswordSubmit(){

    let loading = this.loadingCtrl.create({
      content: 'Resetting password...'
    });
    loading.present();

    this.userService.forgotPasswordSubmit(this.username, this.code, this.password).then(
        () => {

          let toast = this.toastCtrl.create({
            message: 'Resetted password successfully for ' + this.username,
            duration: 2000,
            position: 'bottom'
          });

          loading.dismiss();
          toast.present();
          this.navCtrl.push(LoginPage);

        },
        error => {

          logger.error(error);
          this.error = error;
          loading.dismiss();
          Analytics.record('Error', error);

        });
  }
}