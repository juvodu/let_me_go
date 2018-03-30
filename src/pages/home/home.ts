import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavController, LoadingController, ToastController } from 'ionic-angular';
import { UserService } from '../../providers/service.user';
import { LoginPage } from '../login/login';
import { DeviceService } from '../../providers/service.device';
import { Logger } from 'aws-amplify';

const logger = new Logger('Home');

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
  private changePassword: ChangePassword;
  private changePasswordError: any;
  private user: any;
  public username: any = "";
  public email: string = "";

  constructor(private navCtrl: NavController,
              private loadingCtrl: LoadingController,
              private toastCtrl: ToastController,
              private userService: UserService,
              public deviceService: DeviceService,
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

    this.userService.getCurrentUserInfo().then(userInfo => {
      this.username = userInfo.username;
      this.email = userInfo.attributes.email;
    }, error => {
      logger.error(error);
    });

    this.userService.getCurrentUser().then(user => {
      this.user = user;
    }, error => {
      logger.error(error);
    });
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

    // trigger global logout event
    this.userService.logoutObserver.next(this.user.username);
  }

  delete(){

    let loadingDelete = this.loadingCtrl.create({
      content: this.loadingMessage
    });
    loadingDelete.present();

    this.userService.deleteBackendUser(
      {
        username: this.user.username
      }
    ).subscribe(
      (result)=>{

        // delete cognito user - redirects to login page afterwards
        this.userService.delete(this.user).then(this.logoutFn).catch(this.errorFn);
        loadingDelete.dismiss();

      },
      (error)=>{

        this.showToast(this.deleteErrorMessage);
        loadingDelete.dismiss();
        logger.error(error);
        alert(error);
        
      }
    );
  }

  /**
   * Send change password request to cognito
   */
  changePasswordRequest(){

    let loadingChangePassword = this.loadingCtrl.create({
      content: this.loadingMessage
    });
    loadingChangePassword.present();

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

      this.userService.changePassword(this.user, password, newpassword).then(
        (result)=>{
          this.changePassword.password = "";
          this.changePassword.password_new = "";
          this.changePassword.password_new_repeat = "";
          this.changePasswordError = {};
          this.showToast(this.changePasswordSuccessMessage);
          loadingChangePassword.dismiss();
        },
        (error)=>{
          this.changePasswordError = error;
          loadingChangePassword.dismiss();
        }
      );
    }
  }
}
