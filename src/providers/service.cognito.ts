import { Injectable } from '@angular/core';
import { Config } from 'ionic-angular';
import { Observable, Observer } from 'rxjs';
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

  // Observables used to trigger and subscribe to logout and login events
  public logoutObserver: Observer<any>;
  public logoutObservable: Observable<any>;
  public loginObserver: Observer<any>;
  public loginObservable: Observable<any>;

  constructor(public cognito: Cognito, public config: Config) {
    
    this.logoutObserver = null;
    this.logoutObservable = Observable.create(observer => {
        this.logoutObserver = observer;
    });

    this.logoutObserver = null;
    this.loginObservable = Observable.create(observer => {
      this.loginObserver = observer;
    })
  }

  public getCurrentUser(): any{

    var user = this.cognito.getCurrentUser();

    if (user != null) {
      user.getSession((error, session) => {

        if (error) {
          // local storage is wiped from time to time, trigger logout event which
          // requires user to login again
          alert(error);
          alert("User session get failed in getCurrentUser()");
          console.log(error);

          return;
        }
      });
    }else{
      alert("User is null in getCurrentUser()");
      console.log("User is null in getCurrentUser()");
      return;
    }
      
    return user;
  }

  login(username, password) {

    return new Promise((resolve, reject) => {
      
      let user = this.cognito.makeUser(username);
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
            this.loginObserver.next(true);
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

    console.log("Logging out cognito user.");
    this.getCurrentUser().signOut();
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
              return reject(err);
            } else {  
              return resolve(result);
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

  /**
   * Check if the current user is authenticated with Cognito
   */
  isAuthenticated() {

    return new Promise((resolve, reject) => {
      let user = this.cognito.getCurrentUser();
      if (user != null) {
        user.getSession((err, session) => {
          if (err) {
            return reject(err);
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

            return resolve();
          }
        });
      } else {
        return reject(new Error("User not logged in."));
      }
    });
  }

  /**
   * Get a cognito user attribute by name
   * 
   * @param name
   *          name of the cognito attribute
   * @return Promise containing the attribute value when successful
   */
  getCognitoUserAttributeByName(name:string):Promise<any>{

    return new Promise((resolve, reject) => {
      let user = this.getCurrentUser();
      user.getUserAttributes((err, result) =>{
        if (err) {
            alert(err);
            return;
        }

        for (let i = 0; i < result.length; i++) {

          let el = result[i];
          if(el.getName() === name){
            resolve(el.getValue());
          }
        }

        reject("Attribute not found.");
      });
    });
  }

  changePassword(oldpassword:string, newpassword:string){

    return new Promise((resolve, reject) => {
      let user = this.getCurrentUser();
      user.changePassword(oldpassword, newpassword, (err, result) => {
        if (err) {
            reject(err);
            return;
        }
        resolve(err);
      });
    });
  }
}