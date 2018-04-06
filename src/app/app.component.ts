import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, AlertController, LoadingController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Push, PushObject, PushOptions } from '@ionic-native/push';

import { LoginPage } from '../pages/login/login';
import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';
import { DetailPage } from '../pages/detail/detail';
import { NewSpotPage } from '../pages/newspot/newspot';

import { AppSettings } from '../providers/app.settings';
import { DeviceService } from '../providers/service.device';
import { UserService } from '../providers/service.user';
import { Logger, Analytics } from 'aws-amplify';

const logger = new Logger('AppComponent');

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any;
  pages: Array<{title: string, component: any}>;
  deviceToken: string = null;

  constructor(private platform: Platform,
              private statusBar: StatusBar,
              private splashScreen: SplashScreen,
              private push: Push,
              public alertCtrl: AlertController,
              private deviceService: DeviceService,
              private userService: UserService,
              public loadingCtrl: LoadingController) {

    this.initializeApp();

    this.pages = [
      { title: 'Home', component: HomePage },
      { title: 'Surfspots', component: TabsPage },
      { title: 'New Surf Spot', component: NewSpotPage}
    ];

  }

  initializeApp() {
    this.platform.ready().then(() => {

      this.statusBar.styleLightContent();
      this.subscribeToGlobalEvents();
      this.showStartPage();
      
    });
  }

  /**
   * Show Login page if not logged in, else TabsPage
   * and hide Splash Screen
   */
  showStartPage(){
    
    this.userService.getCurrentUser().then((user) => {

      this.rootPage = TabsPage;
      this.splashScreen.hide();

    }, (error) => {

      logger.error(error);
      this.rootPage = LoginPage;
      this.splashScreen.hide();

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
  private subscribeToGlobalEvents(){

    // user login: subscribe to push notifications
    this.userService.loginObservable.subscribe(username => {
      
      logger.info("Login event received for " + username);
      this.initPushNotification(username);
    });

    this.userService.logoutObservable.subscribe(username => {

      logger.info("Logout event received for " + username);

      let logoutLoading = this.loadingCtrl.create({
        content: 'Logging out ' + username
      });
      logoutLoading.present();

      if(this.deviceToken == null){

        this.userService.logout();
        logoutLoading.dismiss();
        this.nav.setRoot(LoginPage);
      }else{

        // user logout: unsubscribe from push notification
        logger.info("Unsubscribe from mobile push notifications.");

        this.deviceService.unregisterDevice(username, this.deviceToken).subscribe(

          (result) => {

            logger.info(result);
            this.deviceToken == null;
            this.userService.logout();
            logoutLoading.dismiss();
            this.nav.setRoot(LoginPage);
          },
          (error) => {

            logger.error(error);
            alert(error);
            logoutLoading.dismiss();
            this.nav.setRoot(LoginPage);
          });
      }
    });
  }

  /**
   * Setup push notifications to show an alert
   * 
   * @param username
   *            the username to receive notifications for
   *
   */
  private initPushNotification(username:string){

    const options: PushOptions = {
      android: {
        senderID: AppSettings.ANDROID_PUSH_SENDER_ID,
        forceShow: true
      }
    };
  
    const pushObject: PushObject = this.push.init(options);
  
    pushObject.on('registration').subscribe((data: any) => {
      
      logger.info("Subscribing to mobile push notifications.");

      this.deviceToken = data.registrationId;
      this.deviceService.registerDevice(username, this.deviceToken).subscribe(
        (result) => {
          logger.info(result);
        },
        (error) => {
          alert(error);
          Analytics.record('Error', error);
        });
    });
    
    // user clicked on received notification
    pushObject.on('notification').subscribe((data: any) => {

        logger.info("Notification Reiceved.", data);
        Analytics.record('NotificationReceived', data);

        if(data.additionalData != null){
          
          let notificationType: string = data.additionalData.notification_type;
          switch(notificationType){
            case "swell_alert":
              this.nav.push(DetailPage, {
                spotId: data.additionalData.spotId
              });
              break;

            default:
              logger.warn("Notification type unknown. Ignoring notification.");
          }
        }
    });
    
    pushObject.on('error').subscribe(error => {
      logger.error('Error with Push plugin', error);
      Analytics.record('Error', error);
    });
  }
}
