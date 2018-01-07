import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { NearbyPage } from '../nearby/nearby';
import { CognitoService } from '../../providers/service.cognito';
import { UserService } from '../../providers/service.user';

@Component({
  selector: 'page-confirm',
  templateUrl: 'confirm.html',
})
export class ConfirmPage {

  private code: string;
  private username: string;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
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
          this.navCtrl.push(NearbyPage);          
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
