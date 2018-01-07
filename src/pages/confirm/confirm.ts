import { Component } from '@angular/core';
import { NavController, NavParams, ToastController } from 'ionic-angular';
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

  constructor(private navCtrl: NavController,
              private navParams: NavParams,
              private toastCtrl: ToastController,
              private cognitoService: CognitoService,
              private userService: UserService) {

    this.username = navParams.get('username');
  }

  confirm() {
    this.cognitoService.confirmRegistration(this.username, this.code).then(() => {

      // create user on spotservice backend
      this.userService.createUser(
        {
          username: this.username,
          email: "juri.ticho@gmail.com"
        }
      ).subscribe(
        (result)=>{

          let toast = this.toastCtrl.create({
            message: 'User was registered successfully',
            duration: 3000,
            position: 'bottom'
          });
        
          toast.present();

          this.navCtrl.setRoot(LoginPage);          
        },
        (error)=>{
          console.log(error);
          alert(error);
        });
    });
  }

  resendCode() {
    this.cognitoService.resendRegistrationCode(this.username);
  }
}
