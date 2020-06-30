import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { AngularFireAuth } from 'angularfire2/auth';
import { AlertController } from '@ionic/angular';
import { LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-payment',
  templateUrl: './payment.page.html',
  styleUrls: ['./payment.page.scss'],
})
export class PaymentPage implements OnInit {
  places = [];
  destination = "";
  location = "";
  places_data;
  user_value;
  user_fullname;
  price;
  vehicle;
  userCollection:AngularFirestoreCollection;
  constructor(db: AngularFirestore, public loadingController: LoadingController,public alertController: AlertController, public auth: AngularFireAuth,private router : Router,private storage: Storage,private http: HttpClient) { 
    this.userCollection = db.collection("users");
  }

  ngOnInit() {
  }


  autocomplete(){
    console.log(this.location);
    var url = "https://jalome-api-python.herokuapp.com/distance-matrix/";
    this.http.get(url, {params:{"type":"getPlaces", "input":this.location} }).subscribe(x=>{
      this.places_data = x;
      this.places = this.places_data.data;
    });
  }


  SetDestination(destination){
    console.log(destination);
    this.location = destination;
    this.places = [];
  }

  ionViewDidEnter(){
    // this.auth.auth.onAuthStateChanged(user=>{
    //   if(user){
    //     this.userCollection.doc(user.email).valueChanges().subscribe(x=>{
    //       this.user_value = x;
    //       this.user_fullname = this.user_value.fullname;
    //     });
    //   }
    // });

    this.storage.get("vehicle_type").then(vehicle=>{
      this.vehicle = vehicle;
    })

    this.storage.get("price").then(price=>{
      this.price = price;
    });
  }


  confirmPage(){
    if(this.location == ""){
      this.showError("Please enter a location");
    }else{

      var url = "http://jalome-api-python.herokuapp.com/distance-matrix/geo/";
      this.http.get(url, {params:{"destination":this.location} }).subscribe(x=>{
        console.log(x);
        this.storage.set("location", {coords:x,name:this.location}).then(()=>{
          this.router.navigateByUrl('confirmed');
        }).catch(err=>{
          this.showError(err);
        });
      });


    }
  }


  async showError(err){
    const alert = await this.alertController.create({
      header: 'Unable to continue',
      subHeader: 'error:',
      message: err,
      buttons: ['OK']
    });
    await alert.present();
  }

}
