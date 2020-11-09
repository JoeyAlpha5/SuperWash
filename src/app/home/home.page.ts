import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import { AngularFireAuth } from 'angularfire2/auth'
import { AlertController } from '@ionic/angular';
import { LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';
import { OneSignal } from '@ionic-native/onesignal/ngx';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Diagnostic } from '@ionic-native/diagnostic/ngx';
import { ActionSheetController } from '@ionic/angular';
import { CallNumber } from '@ionic-native/call-number/ngx';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})

export class HomePage {
  userCollection:AngularFirestoreCollection;
  washerCollection:AngularFirestoreCollection;
  userIsWasher;
  user_list_;
  washerAvailable = false;
  constructor(private callNumber: CallNumber,db: AngularFirestore,public platform: Platform,public loadingController: LoadingController,public alertController: AlertController, public auth: AngularFireAuth,private router : Router,private oneSignal: OneSignal,private diagnostic: Diagnostic,public actionSheetController: ActionSheetController) {
    this.userCollection = db.collection("users");
    this.washerCollection = db.collection("washers");
  }


  ionViewDidEnter(){
    this.oneSignal.getIds().then(identity => {
      let id = identity.userId;
      this.auth.auth.onAuthStateChanged(user=>{
        console.log(user.email);
        console.log(identity.userId);
        this.userCollection.doc(user.email).update({device_id:id});

        this.isWasher(user.email);
      });
    }).catch(err=>{
      //unable to get device id
    });
    // this.isWasher('1603898@students.wits.ac.za');
  }

  isWasher(email){
    // var current_user_email = this.auth.auth.currentUser.email;
    this.userCollection.doc(email).ref.get().then(x=>{
      console.log(x.data());
      this.user_list_ = x.data();
      if("washer" in this.user_list_ && this.user_list_.washer == true){
        this.userIsWasher = true;
        console.log("is washer");
        this.getWasherStatus(email);
      }else{
        this.userIsWasher = false;
        console.log("is not washer");
      }
    });
  }


  // get washer availability status
  getWasherStatus(email){
    this.washerCollection.doc(email).ref.get().then(x=>{
      if(x.data().available == true){
        this.washerAvailable = true;
        console.log("washer available");
      }else{
        this.washerAvailable = false;
        console.log("washer not available");
      }
    })
  }

  // update washer availability status
  updateWasherAvailability(event){
    this.washerAvailable = event.target.checked;
    this.washerCollection.doc(this.auth.auth.currentUser.email).update({available:event.target.checked});
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

  async Options(){
    const actionSheet = await this.actionSheetController.create({
      header: 'Options',
      cssClass: 'my-custom-class',
      buttons: [{
        text: 'Call support',
        role: 'destructive',
        icon: 'call',
        handler: () => {
          this.callNumber.callNumber('+27732487249', true);
          console.log('Delete clicked');
        }
      }, {
        text: 'Cancel',
        icon: 'close',
        role: 'cancel',
        handler: () => {
          console.log('Cancel clicked');
        }
      }]
    });
    await actionSheet.present();
  }

}
