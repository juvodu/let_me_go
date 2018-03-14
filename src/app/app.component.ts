import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, AlertController, LoadingController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Push, PushObject, PushOptions } from '@ionic-native/push';

import { LoginPage } from '../pages/login/login';
import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';

import { AppSettings } from '../providers/app.settings';
import { CognitoService } from '../providers/service.cognito';
import { DeviceService } from '../providers/service.device';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = LoginPage;
  pages: Array<{title: string, component: any}>;
  deviceToken: string = null;

  constructor(private platform: Platform,
              private statusBar: StatusBar,
              private splashScreen: SplashScreen,
              private push: Push,
              public alertCtrl: AlertController,
              private cognitoService: CognitoService,
              private deviceService: DeviceService,
              public loadingCtrl: LoadingController) {
    this.initializeApp();

    this.pages = [
      { title: 'Home', component: HomePage },
      { title: 'Surfspots', component: TabsPage }
    ];

  }

  initializeApp() {
    this.platform.ready().then(() => {

      this.statusBar.styleLightContent();
      this.splashScreen.hide();
      this.subscribeToEvents();
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }

  /**
   * Subscribe to global events like user login and logout
   */
  private subscribeToEvents(){

    // user login: subscribe to push notifications
    this.cognitoService.loginObservable.subscribe((value) => {
      
      console.info("Login event received.");
      this.initPushNotification();
    });

    this.cognitoService.logoutObservable.subscribe((value) => {

      console.info("Logout event received.");

      let logoutLoading = this.loadingCtrl.create({
        content: 'Logging out...'
      });
      logoutLoading.present();

      if(this.deviceToken == null){

        this.cognitoService.logout();
        logoutLoading.dismiss();
        this.showLoginPage();
      }else{

        // user logout: unsubscribe from push notification
        console.log("Unsubscribe from mobile push notifications.");
        this.deviceService.unregisterDevice(this.deviceToken).subscribe(

          (result) => {

            console.info(result);
            this.deviceToken == null;
            this.cognitoService.logout();
            logoutLoading.dismiss();
            this.showLoginPage();
          },
          (error) => {

            console.error(error);
            alert(error);
            logoutLoading.dismiss();
            this.showLoginPage();
          });
      }
    });
  }

  /**
   * Redirect user to login page
   */
  private showLoginPage(){

    console.log("Show login page");
    this.nav.setRoot(LoginPage);
  }

  /**
   * Setup push notifications to show an alert
   */
  private initPushNotification(){

    const options: PushOptions = {
      android: {
        senderID: AppSettings.ANDROID_PUSH_SENDER_ID
      }
    };
  
    const pushObject: PushObject = this.push.init(options);
  
    pushObject.on('registration').subscribe((data: any) => {
      
      console.info("Subscribing to mobile push notifications.");
      this.deviceToken = data.registrationId;
      this.deviceService.registerDevice(this.deviceToken).subscribe(
        (result) => {
          console.log(result);
        },
        (error) => {
          alert(error);
        });
    });
  
    pushObject.on('notification').subscribe((data: any) => {

        console.info(data);
    });
    
    pushObject.on('error').subscribe(error => console.error('Error with Push plugin', error));
  }
}
