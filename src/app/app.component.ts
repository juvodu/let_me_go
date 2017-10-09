import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, AlertController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Push, PushObject } from '@ionic-native/push';

import { LoginPage } from '../pages/login/login';
import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';

import { AppSettings } from '../providers/app.settings';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = LoginPage;

  pages: Array<{title: string, component: any}>;

  constructor(public platform: Platform,
              public statusBar: StatusBar,
              public splashScreen: SplashScreen,
              public push: Push,
              public alertCtrl: AlertController) {
    this.initializeApp();

    this.pages = [
      { title: 'Home', component: HomePage },
      { title: 'Surfspots', component: TabsPage }
    ];

  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.initPushNotification();
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }

  /**
   * Setup push notifications to show an alert
   */
  private initPushNotification(){
    
      const options: any = {
        android: {
          senderID: AppSettings.ANDROID_PUSH_SENDER_ID
        }
      };
    
      const pushObject: PushObject = this.push.init(options);
    
        pushObject.on('registration').subscribe((data: any) => {
          console.log("device token:", data.registrationId);
    
          let alert = this.alertCtrl.create({
                      title: 'device token',
                      subTitle: data.registrationId,
                      buttons: ['OK']
                    });
                    alert.present();
    
        });
    
        pushObject.on('notification').subscribe((data: any) => {
          console.log('message', data.message);
          if (data.additionalData.foreground) {
            let confirmAlert = this.alertCtrl.create({
              title: 'New Notification',
              message: data.message,
              buttons: [{
                text: 'Ignore',
                role: 'cancel'
              }, {
                text: 'View',
                handler: () => {
                  //TODO: Your logic here
                }
              }]
            });
            confirmAlert.present();
          } else {
          let alert = this.alertCtrl.create({
                      title: 'clicked on',
                      subTitle: "you clicked on the notification!",
                     buttons: ['OK']
                    });
                    alert.present();
            console.log("Push notification clicked");
          }
       });
    
        pushObject.on('error').subscribe(error => console.error('Error with Push plugin', error));
      }
}
