import { Injectable } from '@angular/core';
import { Config } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';

import { Cognito } from './aws.cognito';

declare var AWS: any;
declare const aws_cognito_region;
declare const aws_cognito_identity_pool_id;
declare const aws_user_pools_id;

/**
 *  Service encapsulating cognito functionalities
 * 
 */
@Injectable()
export class CognitoService {

  // Observables used to trigger logout event
  private logoutObserver: any;
  public logoutObservable: any;

  constructor(public cognito: Cognito, public config: Config) {
    
    this.logoutObserver = null;
    this.logoutObservable = Observable.create(observer => {
        this.logoutObserver = observer;
    });
  }

  public getCurrentUser(): any{

    var user = this.cognito.getCurrentUser();

    if (user != null) {
      user.getSession((error, session) => {

        if (error) {
          // local storage is wiped from time to time, trigger logout event which
          // requires user to login again
          console.log(error);
          this.logoutObserver.next(true);
          return;
        }
      });
    }else{
      this.logoutObserver.next(true);
      return;
    }
      
    return user;
  }

  login(username, password) {

    return new Promise((resolve, reject) => {
      
      let user = this.cognito.makeUser(username);
      console.log(user);
      let authDetails = this.cognito.makeAuthDetails(username, password);

      user.authenticateUser(authDetails, {
        'onSuccess': (result:any) => {

          var logins = {};
          var loginKey = 'cognito-idp.' +
                          aws_cognito_region +
                          '.amazonaws.com/' +
                          aws_user_pools_id;
          logins[loginKey] = result.getIdToken().getJwtToken();

          AWS.config.credentials = new AWS.CognitoIdentityCredentials({
           'IdentityPoolId': aws_cognito_identity_pool_id,
           'Logins': logins
          });
          
          this.isAuthenticated().then(() => {
            resolve();
          }).catch((err) => {
            reject(err);
          });

        },
        'onFailure': (err:any) => {
          reject(err);
        }
      });
    });
  }

  /**
   * Log current user out
   */
  public logout() {
    this.getCurrentUser().signOut();

    // trigger redirect to login page
    this.logoutObserver.next(true);
  }

  /**
   * Delete the current user
   */
  public delete(): Promise<any> {

    return new Promise((resolve, reject) => {

      this.getCurrentUser().deleteUser(function(err, result) {
        if (err) {
            reject(err);
        }
        resolve();
      });
    });
  }

  register(username, password, attr) {
    let attributes = [];

    for (var x in attr) {
      attributes.push(this.cognito.makeAttribute(x, attr[x]));
    }

    return new Promise((resolve, reject) => {
      this.cognito.getUserPool().signUp(username, password, attributes, null, function(err, result) {
        if (err) {
          reject(err);
        } else {
          resolve(result.user);
        }
      });
    });
  }

  confirmRegistration(username, code) {

    return new Promise((resolve, reject) => {
      let user = this.cognito.makeUser(username);
      user.confirmRegistration(code, true, (err, result) => {
            if (err) {
              reject(err);
            } else {  
              resolve(result);
            }
        });
    });
  }

  resendRegistrationCode(username) {

    return new Promise((resolve, reject) => {
      let user = this.cognito.makeUser(username);
      user.resendConfirmationCode((err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  isAuthenticated() {
    return new Promise((resolve, reject) => {
      let user = this.cognito.getCurrentUser();
      if (user != null) {
        user.getSession((err, session) => {
          if (err) {
            reject(err)
          } else {
            var logins = {};
            var loginKey = 'cognito-idp.' +
              aws_cognito_region +
              '.amazonaws.com/' +
              aws_user_pools_id;
            logins[loginKey] = session.getIdToken().getJwtToken();

            AWS.config.credentials = new AWS.CognitoIdentityCredentials({
              'IdentityPoolId': aws_cognito_identity_pool_id,
              'Logins': logins
            });

            resolve()
          }
        });
      } else {
        reject("User not found.")
      }
    });
  }
}