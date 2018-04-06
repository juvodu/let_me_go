import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { Analytics } from 'aws-amplify';

@Component({
  selector: 'page-newspot',
  templateUrl: 'newspot.html',
})
export class NewSpotPage {

  public photo: any;

  constructor(private camera: Camera) {
                
  }

  /**
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
     // imageData is either a base64 encoded string or a file URI
     // If it's base64:
     let base64Image = 'data:image/jpeg;base64,' + imageData;
     this.photo = base64Image;
    }, (error) => {
     // Handle error
     console.log(error);
    });
  }
}