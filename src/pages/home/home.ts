import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { CognitoService } from '../../providers/service.cognito';
import { LoginPage } from '../login/login';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  private logoutFn = () => { this.navCtrl.setRoot(LoginPage) };
  private errorFn = (err) => { console.log(err) };

  constructor(public navCtrl: NavController, public cognitoService: CognitoService) {
  }

  logout(){
    this.cognitoService.logout();
  }

  delete(){
    this.cognitoService.delete().then(this.logoutFn).catch(this.errorFn);    
  }
}
