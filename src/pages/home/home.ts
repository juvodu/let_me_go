import { Component } from '@angular/core';
import { NavController, LoadingController, ToastController, Toast } from 'ionic-angular';
import { CognitoService } from '../../providers/service.cognito';
import { UserService } from '../../providers/service.user';
import { LoginPage } from '../login/login';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  private logoutFn = () => {

    this.navCtrl.setRoot(LoginPage);
    this.showToast(this.deleteSuccessMessage);
  };

  private errorFn = (err) => { 
    
    alert(err);
    this.navCtrl.setRoot(LoginPage);
    this.showToast(this.deleteErrorMessage);
  };
  private loadingMessage: string = "Please wait...";
  private deleteSuccessMessage: string = "Deleted user successfully";
  private deleteErrorMessage: string = "Deletion of user failed";
  private username: string;
  private email: string;

  constructor(private navCtrl: NavController,
              private loadingCtrl: LoadingController,
              private toastCtrl: ToastController,
              private userService: UserService,
              private cognitoService: CognitoService) {

              this.displayUserProfile();
  }

  displayUserProfile(){

    this.username = this.cognitoService.getCurrentUser().username;
    this.cognitoService.getCognitoUserAttributeByName("email").then(
      (value)=>{
        this.email = value;
      }
    ).catch(
      (error) =>{
        alert(error);
      }
    );
  }

  showToast(message:string){

    let toast = this.toastCtrl.create({
      message: message,
      duration: 3000,
      position: 'bottom'
    });

    toast.present();
  }

  logout(){
    this.cognitoService.logout();
  }

  delete(){

    let loading = this.loadingCtrl.create({
      content: this.loadingMessage
    });
    loading.present();

    let cognitoUser: any = this.cognitoService.getCurrentUser();
    this.userService.deleteUser(
      {
        username: cognitoUser.username
      }
    ).subscribe(
      (result)=>{

        // delete cognito user - redirects to login page afterwards
        this.cognitoService.delete().then(this.logoutFn).catch(this.errorFn);
        loading.dismiss();

      },
      (error)=>{

        this.showToast(this.deleteErrorMessage);
        loading.dismiss();
        console.log(error);
        alert(error);
      }
    );
  }
}
