import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { AngularFireAuth } from 'angularfire2/auth';
import { AlertController } from '@ionic/angular';
import { LoadingController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { MenuController } from '@ionic/angular';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Location } from "@angular/common";
import { Platform } from '@ionic/angular';
import { Router } from '@angular/router';
@Component({
  selector: 'app-confirm-request',
  templateUrl: './confirm-request.page.html',
  styleUrls: ['./confirm-request.page.scss'],
})
export class ConfirmRequestPage implements OnInit {

  userCollection:AngularFirestoreCollection;
  washerCollection:AngularFirestoreCollection;
  mobile;
  fullname;
  constructor(private route: Router,private location: Location,private statusBar: StatusBar,private menu: MenuController,private storage: Storage,private geolocation: Geolocation,private alert: AlertController,public loadingController: LoadingController,db: AngularFirestore,private http: HttpClient,private platform: Platform,public auth: AngularFireAuth) { 
    this.userCollection = db.collection("users");
    this.washerCollection = db.collection("washers");
    this.platform.backButton.subscribeWithPriority(999, ()=>{
      console.log("Back button disabled");
    });
  }

  ngOnInit() {
  }

  ionViewDidEnter(){
    this.storage.get("passenger_fullname").then(fn=>{
      this.fullname = fn;
      console.log("fullname is ", fn);
      // this.presentalert();
      this.storage.remove("passenger_fullname");
    });
    this.storage.get("passenger_mobile").then(mb=>{
        this.mobile = mb;
        console.log("mobile is ", mb);
    }).then(()=>{
      this.presentalert();
    });
  }



  //alert
  async presentalert(){
    this.storage.remove("passenger_fullname");
    const alert = await this.alert.create({
        header: 'Confirm Request',
        message: this.fullname + ' has requested a car wash.',
        buttons: [
            {
                text: 'Reject',
                handler: () => {
                    //set the driver's passenger
                    console.log('Rejected');
                    this.auth.auth.onAuthStateChanged(user=>{
                      console.log(user.email);
                      this.washerCollection.doc(user.email).update({washer_request:"none"});
                      this.route.navigate(['/home']);
                    });
                }
              },{
                text: 'Confirm',
                handler: () => {
                  this.auth.auth.onAuthStateChanged(user=>{
                    console.log(user.email);
                    this.washerCollection.doc(user.email).update({washer_request:this.fullname});
                    this.route.navigate(['/requests']);
                  });
                }
          }

        ]
      });
  
      await alert.present();
  }
}
