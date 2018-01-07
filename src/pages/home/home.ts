import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { CognitoService } from '../../providers/service.cognito';
import { UserService } from '../../providers/service.user';
import { LoginPage } from '../login/login';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  private logoutFn = () => { this.navCtrl.setRoot(LoginPage) };
  private errorFn = (err) => { console.log(err) };

  constructor(private navCtrl: NavController,
              private userService: UserService,
              private cognitoService: CognitoService) {
  }

  logout(){
    this.cognitoService.logout();
  }

  delete(){

    let cognitoUser: any = this.cognitoService.getCurrentUser();
    this.userService.deleteUser(
      {
        username: cognitoUser.username
      }
    ).subscribe(
      (result)=>{

        // delete cognito user - redirects to login page afterwards
        this.cognitoService.delete().then(this.logoutFn).catch(this.errorFn);            
      },
      (error)=>{
        console.log(error);
        alert(error);
      }
    );
  }
}
