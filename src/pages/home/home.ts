import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavController, LoadingController, ToastController } from 'ionic-angular';
import { CognitoService } from '../../providers/service.cognito';
import { UserService } from '../../providers/service.user';
import { LoginPage } from '../login/login';

export class ChangePassword {
  password: string;
  password_new: string;
  password_new_repeat: string;
}

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

  private changePasswordForm: FormGroup;
  private loadingMessage: string = "Please wait...";
  private deleteSuccessMessage: string = "Deleted user successfully";
  private deleteErrorMessage: string = "Deletion of user failed";
  private changePasswordSuccessMessage: string = "Changed password successfully.";
  private username: string;
  private email: string;
  private changePassword: ChangePassword;
  private changePasswordError: any;

  constructor(private navCtrl: NavController,
              private loadingCtrl: LoadingController,
              private toastCtrl: ToastController,
              private userService: UserService,
              private cognitoService: CognitoService,
              public formBuilder: FormBuilder) {
              
              this.changePassword = new ChangePassword();
              this.changePasswordForm = formBuilder.group({
                password: ['', Validators.compose([Validators.minLength(5), Validators.required])],
                password_new: ['', Validators.compose([Validators.minLength(5), Validators.required])],
                password_new_repeat: ['', Validators.compose([Validators.minLength(5), Validators.required])]
              });

              this.changePasswordError = {};
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

  /**
   * Send change password request to cognito
   */
  changePasswordRequest(){

    let password = this.changePassword.password;
    let newpassword = this.changePassword.password_new;
    let newpasswordrepeat = this.changePassword.password_new_repeat;

    // validate input
    if(password == null){
      this.changePasswordError.message = "Please enter your current password."
      return;    }

    if(newpassword == null || newpassword.length < 6){
      this.changePasswordError.message = "New password must have at 6 characters or more."
      return;
    }

    if(newpassword != newpasswordrepeat){
      this.changePasswordError.message = "Repeated password does not match."
      return;
    }

    if(this.changePasswordForm.valid){
      this.cognitoService.changePassword(password, newpassword).then(
        (result)=>{
          this.changePasswordError = {};
          this.showToast(this.changePasswordSuccessMessage);
        }
      ).catch(
        (error)=>{
          this.changePasswordError = error;
        }
      );
    }
  }
}
