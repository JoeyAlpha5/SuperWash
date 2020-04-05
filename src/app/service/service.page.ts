import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { AngularFireAuth } from 'angularfire2/auth';
import { AlertController } from '@ionic/angular';
import { LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
@Component({
  selector: 'app-service',
  templateUrl: './service.page.html',
  styleUrls: ['./service.page.scss'],
})
export class ServicePage implements OnInit {

  user_value;
  user_fullname;
  userCollection:AngularFirestoreCollection;
  serviceCollection:AngularFirestoreCollection;
  services = [];
  constructor(db: AngularFirestore, public loadingController: LoadingController,public alertController: AlertController, public auth: AngularFireAuth,private router : Router) { 
    this.serviceCollection = db.collection("services");
    this.userCollection = db.collection("users");
  }

  ngOnInit() {
  }

  ionViewDidEnter(){
    //get user details
    this.auth.auth.onAuthStateChanged(user=>{
      if(user){
        this.userCollection.doc(user.email).valueChanges().subscribe(x=>{
          this.user_value = x;
          this.user_fullname = this.user_value.fullname;
        });
      }
    });
    //get services
    this.serviceCollection.valueChanges().subscribe(x=>{
      console.log(x);
      this.services = x;
    });
  }

}
