import { Injectable } from '@angular/core';
import { Http, Response, RequestOptions, Headers } from '@angular/http';
import { Observable, Observer } from 'rxjs';
import { AppSettings } from './app.settings';
import { Auth, Logger, Analytics } from 'aws-amplify';

const logger = new Logger('UserService');

/**
 * Service allows to crud operations on user 
 * 
 * @author Juvodu
 */
@Injectable()
export class UserService {

    headers: Headers;

     // Observables used to trigger and subscribe to logout and login events
    public logoutObserver: Observer<any>;
    public logoutObservable: Observable<any>;
    public loginObserver: Observer<any>;
    public loginObservable: Observable<any>;

    constructor(private http: Http) {
        
        this.logoutObserver = null;
        this.logoutObservable = Observable.create(observer => {
            this.logoutObserver = observer;
        });
    
        this.logoutObserver = null;
        this.loginObservable = Observable.create(observer => {
          this.loginObserver = observer;
        })

        // common http header for all requests
        this.headers = new Headers();
        this.headers.append('x-api-key', AppSettings.SPOT_API_KEY);
    }

    /**
     * Create a user on the backend, if the user already exists it gets updated
     * 
     * @param cognitoUser
     *          the currently logged in user
     * An http response wrapped in an observable            
     */
    public createBackendUser(cognitoUser:any): Observable<Response>{
        
        let options:RequestOptions = new RequestOptions({headers: this.headers});
        let postParams = {
            username: cognitoUser.username,
            email: cognitoUser.email
          };

        Analytics.record('CreateBackendUser', postParams);
        return this.http.post(AppSettings.SPOT_API_ENDPOINT + "user/create", postParams, options);
    }

    /**
     * Delete a user on the backend
     * 
     * @param cognitoUser
     *          the currently logged in user 
     * @return - An http response wrapped in an observable 
     */
    public deleteBackendUser(cognitoUser:any): Observable<Response>{
        
        let options:RequestOptions = new RequestOptions({headers: this.headers});
        let postParams = {
            username: cognitoUser.username
        };
        
        Analytics.record('DeleteBackendUser', postParams);
        return this.http.post(AppSettings.SPOT_API_ENDPOINT + "user/delete", postParams, options);
    }

    /**
     * Resolves to the current user if logged in
     * @return - A promise resolves callback data if success
     */
    public getCurrentUser(): Promise<any>{

        return Auth.currentAuthenticatedUser();
    }

    /**
     * Get user information
     * @return - A promise resolves callback data if success
     */
    public async getCurrentUserInfo(): Promise<any>{

        return await Auth.currentUserInfo();
    }

    /**
     * Sign user in with Cognito and trigger global signin event
     * 
     * @param username
     *           of the user to signin
     * @param password 
     *          of the suer
     * @return - A promise resolves callback data if success
     */
    public login(username:string, password:string): Promise<any>{
        
        Analytics.record('Login');
        return Auth.signIn(username, password);
    }

    /**
     * Sign out current user
     * @return - A promise resolves callback data if success
     */
    public logout(): Promise<any>{

        Analytics.record('Logout');
        return Auth.signOut();
    }

    /**
     * Change password of the passed user
     * 
     * @param cognitoUser 
     *          for which the password will be changed
     * @param oldPassword 
     *          to confirm the operation
     * @param newpassword 
     *          to be saved
     * @return - A promise resolves callback data if success
     */
    public changePassword(cognitoUser:any, oldPassword:string, newpassword:string): Promise<any>{

        Analytics.record('ChangePassword');
        return Auth.changePassword(cognitoUser, oldPassword, newpassword);
    }

    /**
     * Delete the passed user from Cognito
     * 
     * @param cognitoUser
     *          the user to delete
     * @return - A promise resolves callback data if success
     */
    public delete(cognitoUser:any): Promise<any>{

        Analytics.record('DeleteUser');
        return new Promise((resolve, reject) => { 
            logger.info("Amplify does not yet support deletion of users");
            resolve();
        });
    }

    /**
     * Register a new user with Cognito
     * 
     * @param username
     *          the unique username 
     * @param password
     *          to be used
     * @param email
     *          used to verify the registration
     * @return - A promise resolves callback data if success
     */
    public register(username:string, password:string, email:string): Promise<any>{

        Analytics.record('Register');
        return Auth.signUp(username, password, email);
    }

    /**
     * Confirm a user reqistration with the passed code
     * 
     * @param username
     *           of the user to confirm
     * @param code
     *            the user received via email to confirm the account
     * 
     * @return - A promise resolves callback data if success
     */
    public confirmRegistration(username:string, code:string): Promise<any>{

        Analytics.record('ConfirmRegistration');
        return Auth.confirmSignUp(username, code);
    }

    /**
     * Resend the code for confirming a Cognito user account
     * 
     * @param username
     *           of the user to confirm
     * @return - A promise resolves callback data if success
     */
    public resendConfirmCode(username:string): Promise<any>{

        Analytics.record('ResendConfirmCode');
        return Auth.resendSignUp(username);
    }

    /**
     * Inititate a forgot password request
     * 
     * @param username 
     *          of the user to reset the password for
     * @return - A promise resolves callback data if success
     */
    public forgotPassword(username:string): Promise<any>{

        Analytics.record('ForgotPassword');
        return Auth.forgotPassword(username);
    }

    /**
     * Congirm a password change for forgot password request
     * 
     * @param username
     *          of the user to change the password for
     * @param code
     *          to verify the request
     * @param password 
     *          the new password
     * 
     * @return promise which resolves upon success
     */
    public forgotPasswordSubmit(username:string, code:string, password:string){

        Analytics.record('ForgotPasswordSubmit');
        return Auth.forgotPasswordSubmit(username, code, password);
    }

}