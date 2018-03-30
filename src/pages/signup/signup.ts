import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavController, LoadingController } from 'ionic-angular';
import { ConfirmPage } from '../confirm/confirm';
import { LoginPage } from '../login/login';
import { UserService} from '../../providers/service.user'
import { Logger } from 'aws-amplify';

const logger = new Logger('SignUp');

export class UserDetails {
    username: string;
    email: string;
    password: string;
    password_repeat: string;
}

@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
})
export class SignupPage {

  public userDetails: UserDetails;
  error: any;
  signupForm: FormGroup;

  constructor(public navCtrl: NavController,
              public loadingCtrl: LoadingController,
              public formBuilder: FormBuilder,
              private userService: UserService) {

   this.userDetails = new UserDetails();

   this.signupForm = formBuilder.group({
    username: ['', Validators.compose([Validators.minLength(5), Validators.required])],
    email: ['', Validators.required],
    password: ['', Validators.compose([Validators.minLength(5), Validators.required])],
    password_repeat: ['', Validators.compose([Validators.minLength(5), Validators.required])]
  });
  }

  signup(){

    let details = this.userDetails;
    this.error = null;

    if(!this.signupForm.valid || details.password != details.password_repeat){

      this.error = {message: "Please fill out all fields and make sure passwords match."};
      return;
    }

    let loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });
    loading.present();

    logger.debug('register');
    this.userService.register(details.username, details.password, details.email)
      .then(user => {
        
        loading.dismiss();
        this.navCtrl.push(ConfirmPage, { username: details.username, email:  details.email});

      }, error => {
        this.error = error;
        loading.dismiss();
      });
  }

  showLoginPage(){
    this.navCtrl.setRoot(LoginPage);
  }
}
