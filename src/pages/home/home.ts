import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavController, LoadingController, ToastController, AlertController } from 'ionic-angular';
import { UserService } from '../../providers/service.user';
import { LoginPage } from '../login/login';
import { DeviceService } from '../../providers/service.device';
import { Logger, Analytics } from 'aws-amplify';

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
  private user: any;
  public changePasswordError: any;
  public username: any = "";
  public email: string = "";

  constructor(public navCtrl: NavController,
              public loadingCtrl: LoadingController,
              public toastCtrl: ToastController,
              public alertCtrl: AlertController,
              public formBuilder: FormBuilder,
              private userService: UserService,
              public deviceService: DeviceService) {
              
              this.changePassword = new ChangePassword();
              this.changePasswordForm = formBuilder.group({
                password: ['', Validators.compose([Validators.minLength(5), Validators.required])],
                password_new: ['', Validators.compose([Validators.minLength(5), Validators.required])],
                password_new_repeat: ['', Validators.compose([Validators.minLength(5), Validators.required])]
              });

              this.changePasswordError = null;
              this.displayUserProfile();
  }

  displayUserProfile(){

    this.userService.getCurrentUserInfo().then(userInfo => {
      this.username = userInfo.username;
      this.email = userInfo.attributes.email;
    }, error => {
      logger.error(error);
      Analytics.record('Error', error);
    });

    this.userService.getCurrentUser().then(user => {
      this.user = user;
    }, error => {
      logger.error(error);
      Analytics.record('Error', error);
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

  showDeleteConfirm(){

    let deleteConfirm = this.alertCtrl.create({
      title: 'Delete Account',
      message: 'Are you sure about this? This will delete your user and all associated information. After deletion your data cannot be restored.',
      buttons: [
        {
          text: 'Cancel'
        },
        {
          text: 'Confirm',
          handler: () => {
            this.delete();
          }
        }
      ]
    });
    deleteConfirm.present();

  }

  showLogoutConfirm(){

    let logoutConfirm = this.alertCtrl.create({
      title: 'Logout',
      message: 'If you click on logout,  push messages on this smartphone will be disabled until your next login.',
      buttons: [
        {
          text: 'Cancel'
        },
        {
          text: 'LOGOUT',
          handler: () => {
            this.logout();
          }
        }
      ]
    });
    logoutConfirm.present();

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
        Analytics.record('Error', error);
        
      }
    );
  }

  /**
   * Send change password request to cognito
   */
  changePasswordRequest(){

    this.changePasswordError = null;

    if(this.changePassword.password == null){
      this.changePasswordError = { message: "Please enter your current password." };
      return;    }

    if(!this.userService.validatePasswordChange(this.changePassword.password_new, this.changePassword.password_new_repeat)){
      this.changePasswordError  = { message: "Passwords do not match."};
      return;
    }

    if(this.changePasswordForm.valid){

      let loadingChangePassword = this.loadingCtrl.create({
        content: this.loadingMessage
      });
      loadingChangePassword.present();

      this.userService.changePassword(this.user, this.changePassword.password, this.changePassword.password_new).then(
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
          Analytics.record('Error', error);

        }
      );
    }
  }
}
