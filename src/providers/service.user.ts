import { Injectable } from '@angular/core';
import { Config } from 'ionic-angular';

import { Cognito } from './aws.cognito';

declare var AWS: any;
declare const aws_cognito_region;
declare const aws_cognito_identity_pool_id;
declare const aws_user_pools_id;

@Injectable()
export class UserService {

  private user: any;
  public loggedIn: boolean = false;

  constructor(public cognito: Cognito, public config: Config) {
    this.user = null;
  }

  getUser() {
    return this.user;
  }

  getUsername() {
    return this.getUser().getUsername();
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

  logout() {
    this.user = null;
    this.cognito.getUserPool().getCurrentUser().signOut();
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

            this.user = user;
            resolve()
          }
        });
      } else {
        reject("User not found.")
      }
    });
  }

  /**
   * Store favorite spots as an cognito attribute
   * @param favoriteSpotIds 
   */
  updateFavoriteSpotsAttribute(favoriteSpotIds: Array<string>){

    //concate spots to one string
    let concatedSpotIds: string = "";
    favoriteSpotIds.forEach(
        (favoriteSpotId) => {
            if(concatedSpotIds.length == 0){
              concatedSpotIds += favoriteSpotId;
            }else{
              concatedSpotIds += "_" + favoriteSpotId;
            }
        }
    );

    //max length to be stored
    if(concatedSpotIds.length > 500){
      return;
    }

    var attributes = [];
    attributes.push(this.cognito.makeAttribute("custom:favoriteSpots", concatedSpotIds));
    this.user.updateAttributes(attributes, function(err, result) {
        if (err) {
            alert(err);
            return;
        }
    });
  }

  /**
   * Retrieve favorite Spots cognito attribute
   */
  getFavoriteSpotsAttribute(): Promise<string>{

    return new Promise((resolve, reject) => {
      this.user.getUserAttributes((err, attributes) => {
        if (err) {
            reject(err)
          } else {

            // look for favoriteSpots attribute
            let favoriteSpotIds: string;
            for(let i = 0; i < attributes.length; i++){
              
              let el = attributes[i];
              if(el.Name == "custom:favoriteSpots"){
                favoriteSpotIds = el.Value;
              }
            }

            resolve(favoriteSpotIds)
          }
      });
    });
  }
}