import { Component } from '@angular/core';
import { NavController, NavParams, ToastController, LoadingController} from 'ionic-angular';
import { LoginPage } from '../login/login';
import { CognitoService } from '../../providers/service.cognito';
import { UserService } from '../../providers/service.user';

@Component({
  selector: 'page-confirm',
  templateUrl: 'confirm.html',
})
export class ConfirmPage {

  private code: string;
  private username: string;
  private email: string;
  error: any;

  constructor(private navCtrl: NavController,
              public navParams: NavParams,
              private toastCtrl: ToastController,
              private cognitoService: CognitoService,
              private userService: UserService,
              public loadingCtrl: LoadingController) {

    this.username = navParams.get('username');
    this.email = navParams.get('email');
  }

  confirm() {

    let loading = this.loadingCtrl.create({
      content: 'Confirming...'
    });
    loading.present();
    
    this.cognitoService.confirmRegistration(this.username, this.code).then(() => {

      // create user on spotservice backend
      this.userService.createUser(
        {
          username: this.username,
          email: this.email
        }
      ).subscribe(
        (result)=>{

          let toast = this.toastCtrl.create({
            message: 'User was registered successfully',
            duration: 3000,
            position: 'bottom'
          });
          
          loading.dismiss();
          toast.present();
          this.navCtrl.setRoot(LoginPage);          
        },
        (error)=>{

          loading.dismiss();
          console.log(error);
          alert(error);
        });
    }).catch((err) => {
            
      loading.dismiss();
      this.error = err;
    });
  }

  resendCode() {
    this.cognitoService.resendRegistrationCode(this.username);
  }
}
