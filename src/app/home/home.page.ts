import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import { AngularFireAuth } from 'angularfire2/auth'
import { AlertController } from '@ionic/angular';
import { LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';
import { OneSignal } from '@ionic-native/onesignal/ngx';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Diagnostic } from '@ionic-native/diagnostic/ngx';
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  userCollection:AngularFirestoreCollection;
  constructor(db: AngularFirestore,public platform: Platform,public loadingController: LoadingController,public alertController: AlertController, public auth: AngularFireAuth,private router : Router,private oneSignal: OneSignal,private diagnostic: Diagnostic) {
    this.userCollection = db.collection("users");
  }


  ionViewDidEnter(){
    this.oneSignal.getIds().then(identity => {
      let id = identity.userId;
      this.auth.auth.onAuthStateChanged(user=>{
        console.log(user.email);
        console.log(identity.userId);
        this.userCollection.doc(user.email).update({device_id:id});
      });
    }).catch(err=>{
      //unable to get device id
    });
  }

  servicePage(){
    //check location first
    this.diagnostic.isLocationEnabled().then(isEnabled=>{
      console.log(isEnabled);
      if(!isEnabled){
        console.log("location not enabled");
        this.showError("Please enable location services to continue","Location");
      }else{
        console.log("location enabled");
        this.router.navigateByUrl('car-type');
      }
    }).catch(err=>{
      console.log("cordova not available");
      this.router.navigateByUrl('car-type');
    });
  }

  async showError(err,header){
    const alert = await this.alertController.create({
      header: header,
      subHeader: 'message:',
      message: err,
    });
    await alert.present();
  }

  profilePage(){
    this.router.navigateByUrl('profile');
  }


  requestPage(){
    this.router.navigateByUrl('requests');
  }

}
