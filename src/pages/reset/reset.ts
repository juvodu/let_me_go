import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavController, ToastController, NavParams, LoadingController} from 'ionic-angular';
import { UserService } from '../../providers/service.user'; 
import { LoginPage } from '../../pages/login/login'
import { Logger, Analytics } from 'aws-amplify';

const logger = new Logger('Reset');

export class ResetPassword {
  code: string;
  password_new: string;
  password_new_repeat: string;
}

@Component({
  selector: 'page-reset',
  templateUrl: 'reset.html',
})
export class ResetPage {

  private resetPasswordForm: FormGroup;
  private resetPassword:ResetPassword;
  private username:string;
  public email:string;
  public error:any;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public loadingCtrl: LoadingController,
              public toastCtrl: ToastController,
              public formBuilder: FormBuilder,
              private userService: UserService) {
                
                this.username = navParams.get('username');
                this.email = navParams.get('email');
                this.resetPassword = new ResetPassword();
                this.resetPasswordForm = formBuilder.group({
                  code: ['', Validators.compose([Validators.minLength(5), Validators.required])],
                  password_new: ['', Validators.compose([Validators.minLength(5), Validators.required])],
                  password_new_repeat: ['', Validators.compose([Validators.minLength(5), Validators.required])]
                });
  }

  forgotPasswordSubmit(){

    this.error = null;
    if(!this.userService.validatePasswordChange(this.resetPassword.password_new, this.resetPassword.password_new_repeat)){
      this.error = { message: "Passwords do not match." };
      return;
    }

    if(this.resetPasswordForm.valid){

      let loading = this.loadingCtrl.create({
        content: 'Resetting password...'
      });
      loading.present();

      this.userService.forgotPasswordSubmit(this.username, this.resetPassword.code, this.resetPassword.password_new).then(
          () => {

            let toast = this.toastCtrl.create({
              message: 'Resetted password successfully for ' + this.username,
              duration: 3000,
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
    };
  }
}