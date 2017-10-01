import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { SignupPage } from '../pages/signup/signup';
import { ConfirmPage } from '../pages/confirm/confirm';
import { DetailPage } from '../pages/detail/detail';
import { TabsPage } from '../pages/tabs/tabs';
import { NearbyPage } from '../pages/nearby/nearby';
import { NearbyfilterPage } from '../pages/nearbyfilter/nearbyfilter';
import { ContinentsPage } from '../pages/continents/continents';
import { FavoritesPage } from '../pages/favorites/favorites'; 
import { RegionsPage } from '../pages/regions/regions';
import { RegionsfilterPage } from '../pages/regionsfilter/regionsfilter';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Geolocation } from '@ionic-native/geolocation';
import { Diagnostic } from '@ionic-native/diagnostic';

import { UserService } from '../providers/service.user';
import { SpotService } from '../providers/service.spot';
import { CountryService } from '../providers/service.country';
import { Cognito } from '../providers/aws.cognito';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    LoginPage,
    SignupPage,
    ConfirmPage,
    DetailPage,
    TabsPage,
    NearbyPage,
    NearbyfilterPage,
    FavoritesPage,
    ContinentsPage, 
    RegionsPage,
    RegionsfilterPage
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    LoginPage,
    SignupPage,
    ConfirmPage,
    DetailPage,
    TabsPage,
    NearbyPage,
    NearbyfilterPage,
    FavoritesPage,
    ContinentsPage,
    RegionsPage,
    RegionsfilterPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    UserService,
    SpotService,
    CountryService,
    Cognito,
    Geolocation,
    Diagnostic
  ]
})
export class AppModule {}

declare var AWS;
AWS.config.customUserAgent = AWS.config.customUserAgent + ' Ionic';