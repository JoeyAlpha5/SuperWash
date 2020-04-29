import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import { AngularFireAuth } from 'angularfire2/auth'
import { AlertController } from '@ionic/angular';
import { LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';
import { OneSignal } from '@ionic-native/onesignal/ngx';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  userCollection:AngularFirestoreCollection;
  constructor(db: AngularFirestore,public platform: Platform,public loadingController: LoadingController,public alertController: AlertController, public auth: AngularFireAuth,private router : Router,private oneSignal: OneSignal) {
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
    this.router.navigateByUrl('car-type');
  }


  profilePage(){
    this.router.navigateByUrl('profile');
  }


}
