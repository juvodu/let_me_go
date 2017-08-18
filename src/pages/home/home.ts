import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { User } from '../../providers/user';
import { SignupPage } from '../signup/signup';

export class LoginDetails {
  username: string;
  password: string;
}

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  public loginDetails: LoginDetails;

  constructor(public navCtrl: NavController, public user: User) {
      this.loginDetails = new LoginDetails(); 
  }

  login(){

    let details = this.loginDetails;
    details.username = "juri";
    details.password = "hallo123";

    this.user.login(details.username, details.username).then((result) => {
      console.log('result:', result);
    }).catch((err) => { 
      console.log('error', err);
    });
  }

  showSignupPage(){

    this.navCtrl.push(SignupPage);
  }
}
