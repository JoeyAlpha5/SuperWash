import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { AngularFireAuth } from 'angularfire2/auth';
import { AlertController } from '@ionic/angular';
import { LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { HttpClient } from '@angular/common/http';
import { Geolocation } from '@ionic-native/geolocation/ngx';
declare var google;


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
  constructor(private geolocation: Geolocation,db: AngularFirestore, public loadingController: LoadingController,public alertController: AlertController, public auth: AngularFireAuth,private router : Router,private storage: Storage,private http: HttpClient) { 
    this.userCollection = db.collection("users");
  }

  ngOnInit() {
  }


  autocomplete(){
    console.log(this.location);
    var url = "https://jalome-api-python.herokuapp.com/distance-matrix/";
    this.http.get(url, {params:{"type":"getPlaces", "input":this.location} }).subscribe(x=>{
      this.places_data = x;
      // console.log("length of array ", this.places_data.data.length);
      if(this.places_data.data.length > 1){
        this.places = this.places_data.data;
      }
    });
  }


  SetDestination(destination){
    console.log(destination);
    this.location = destination;
    this.places = [];
  }


  getDefaultLocation(){
    this.geolocation.getCurrentPosition().then((resp)=>{
      console.log(resp.coords.latitude, resp.coords.longitude);
      this.http.get('https://maps.googleapis.com/maps/api/geocode/json?address='+resp.coords.latitude+','+resp.coords.longitude+'&key=AIzaSyD7FkGPNnb-TnwiweIfGPgVGy3N3A0O6Mk').subscribe(re=>{
        console.log(re['results'][0]['formatted_address']);
        this.location = re['results'][0]['formatted_address'];
        //set default location
        var map = new google.maps.Map(document.getElementById('mapSelection'), {
          center: {lat: resp.coords.latitude, lng: resp.coords.longitude},
          zoom: 15,
          zoomControl: false,
          mapTypeControl: false,
          scaleControl: false,
          streetViewControl: false,
          rotateControl: false,
          fullscreenControl: false,
            styles: [],
        });
        var marker = new google.maps.Marker({
          position: {lat: resp.coords.latitude, lng: resp.coords.longitude},
          map: map,
          title: 'My location'
        });
      })
    });
  }

  ionViewDidEnter(){
    this.getDefaultLocation()
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

      var url = "https://jalome-api-python.herokuapp.com/distance-matrix/geo/";
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
      // subHeader: 'error:',
      message: err,
      buttons: ['OK']
    });
    await alert.present();
  }

}
