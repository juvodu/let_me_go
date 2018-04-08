import { Component } from '@angular/core';
import { LoadingController } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { Analytics, Storage, Logger } from 'aws-amplify';

const logger = new Logger('NewSpotPage');

export class Spot {
  name: string;
  shortDescription: string;
  description: string;
  thumbnail: string;
  continent: string;
}

@Component({
  selector: 'page-newspot',
  templateUrl: 'newspot.html',
})
export class NewSpotPage {

  public error: any;
  public photo: any;
  public spot: Spot;

  constructor(private camera: Camera, 
              private loadingCtrl: LoadingController) {

                this.spot = new Spot();
  }

  /**
   * Get a picture for the new spot
   * 
   * @param sourceType 
   *          0 => local device photo library
   *          1 => camera 
   */
  getPicture(sourceType:number){

    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      sourceType:sourceType
    }
    
    this.camera.getPicture(options).then((imageData) => {
  
     let base64Image = 'data:image/jpeg;base64,' + imageData;
     this.photo = base64Image;

    }, (error) => {
      
     this.error = error;
     logger.error(error);
     Analytics.record("Error", error.message);

    });
  }

  dataURItoBlob(dataURI) {

    let binary = atob(dataURI.split(',')[1]);
    let array = [];
    for (let i = 0; i < binary.length; i++) {
      array.push(binary.charCodeAt(i));
    }
    return new Blob([new Uint8Array(array)], {type: 'image/jpeg'});
};

  upload(){

    let loading = this.loadingCtrl.create({
      content: 'Uploading image...'
    });
    loading.present();
        
      Storage.put('spot.jpg', this.dataURItoBlob(this.photo)).then (result => {

          loading.dismiss();
          logger.info(result);

        }).catch(error => {

          this.error = error;
          loading.dismiss();
          logger.error(error);
          Analytics.record("Error", error.message);

      });  
  }
}