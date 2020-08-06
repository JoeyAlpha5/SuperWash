import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { AngularFireAuth } from 'angularfire2/auth';
import { AlertController } from '@ionic/angular';
import { LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { ToastController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { PaygatePage } from '../paygate/paygate.page';
import { ModalController } from '@ionic/angular';

declare var google;


@Component({
  selector: 'app-confirmed',
  templateUrl: './confirmed.page.html',
  styleUrls: ['./confirmed.page.scss'],
})
export class ConfirmedPage implements OnInit {
  location;
  disable_payment_options = true;
  payment_mode = "none";
  user_value;
  user_fullname;
  price;
  vehicle;
  mobile = "";
  name = "";
  washers = []
  userCollection:AngularFirestoreCollection;
  washerCollection:AngularFirestoreCollection;
  latlng;
  spinner = false;
  interval_counter = 20;
  interval;
  url = "https://jalome-api-python.herokuapp.com/distance-matrix/";
  washer_details:Observable<any>;
  constructor(public modalController: ModalController,public toastController: ToastController,db: AngularFirestore, public loadingController: LoadingController,public alertController: AlertController, public auth: AngularFireAuth,private router : Router,private geolocation: Geolocation,private storage: Storage,private http: HttpClient) { 
    this.userCollection = db.collection("users");
    this.washerCollection = db.collection("washers");
  }

  ngOnInit() {
  }


  paygate_initialize(){
      //price is supposed to be one long number for the paygate api to work
    this.auth.user.subscribe(re=>{
        var api_price = this.price.toFixed(2).split(".").join("");
        // console.log(api_price);
        var url = 'https://www.quikwash.co.za/api/api.php?AMOUNT='+api_price+"&EMAIL="+re.email;
        var headers = new HttpHeaders();
        headers.append("Accept", 'application/json');
        headers.append('Content-Type', 'application/json');
        headers.append('Access-Control-Allow-Origin', '*');
        this.http.post(url,{headers:headers}).subscribe(res=>{
          console.log("response ",res.toString());
          this.showPayGate(res.toString());
        });
    });
  }

  payment_method(mode){
      this.payment_mode = mode;
  }

  async showPayGate(result){
    var req_array = result.split("=");
    var pay_req = req_array[2].split("&")[0].toString();
    var checksum = req_array[4];
    const modal = await this.modalController.create({
    component: PaygatePage,
    componentProps: {
        'payment_req': pay_req,
        'checksum':checksum,
        }
    });
    return await modal.present();
}
  

  confirmPage(new_washers){
    this.storage.set("price", this.price);
    this.spinner = true;
    this.washerCollection.ref.get().then(x=>{
        console.log(x.docs);
        console.log(x.docs[0].data())
        // console.log(washers);
        var washers = x.docs;
        this.washers = [];
        if(new_washers == "none"){
            console.log("getting new washers");
            for(let u = 0; u < washers.length; u++){
                if(washers[u].data().washer_request == "none"){
                    // console.log("driver",washers[u]);
                    this.washers.push(washers[u].data());
                }
            }
        }else{
            this.washers = new_washers;
            console.log("getting nearest washer from ", new_washers);
        }
        //get user details
        this.auth.auth.onAuthStateChanged(user=>{
            // console.log(user.email);
            this.userCollection.doc(user.email).ref.get().then(u=>{
                var user_data = u.data();
            // });
            // var req = this.userCollection.doc(user.email).valueChanges().subscribe(user_data=>{
                this.name = user_data["fullname"];
                this.mobile = user_data["mobile"];
                this.washer_details = this.http.get(this.url, {params:{"type":"getDriver","user_fullname":this.name,"user_mobile":this.mobile,"price":this.price ,"drivers":JSON.stringify(this.washers),"location":JSON.stringify(this.latlng)} });

                this.washer_details.subscribe(nearest_washer=>{
                    console.log("nearest washer ",nearest_washer.Response.email);
                    this.userCollection.doc(nearest_washer.Response.email).ref.get().then(w=>{
                        // console.log("nearest washer id ", w["device_id"],nearest_washer.Response.email);
                        this.sendreq(nearest_washer.Response.email);
                    });
                    // var nearest_washer_sub = this.userCollection.doc(nearest_washer.Response.email).valueChanges().subscribe(w=>{
                    //     console.log("nearest washer id ", w["device_id"],nearest_washer.Response.email);
                    //     this.sendreq(nearest_washer_sub,nearest_washer.Response.email);
        
                    // })
                },err=>{
                    this.spinner = false;
                    this.showError("Networking error");
                });
            });
          });
    })
  }


  sendreq(nearest_washer_email){
    //   washers.unsubscribe();
    //   nearest_washer_sub.unsubscribe();
    //   req.unsubscribe();
    clearInterval(this.interval);
    this.interval = setInterval(async ()=>{
        console.log("waiting for driver");
        this.interval_counter--;
        console.log(this.interval_counter);
        if(this.interval_counter == 0){
            this.interval_counter = 20;
            clearInterval(this.interval);
            washer_count.unsubscribe();
            this.getNextWasher(nearest_washer_email,washer_count);
        }

    }, 2000);
      console.log("unsubscribed");
      var washer_count = this.washerCollection.doc(nearest_washer_email).valueChanges().subscribe(washer=>{
        // clearInterval(this.interval);
        if(washer["washer_request"] == this.name){
            clearInterval(this.interval);
            washer_count.unsubscribe();
            console.log("request accepted")
            this.router.navigate(['/requests']).then(()=>{
                clearInterval(this.interval);
            });
        }
      });
  }


  getNextWasher(nearest_washer_email,washer_count){
    washer_count.unsubscribe();
    console.log(this.washers);
    for(var w = 0; w < this.washers.length; w++){
        if(this.washers[w].email == nearest_washer_email){
            this.washers.splice(w,1);
            console.log(this.washers);
            break;
        }
    } 
    if(this.washers.length == 0){
        this.showError("No washers available at the moment");
        clearInterval(this.interval);
        this.spinner = false;
    }else{
        // clearInterval(this.interval);
        this.confirmPage(this.washers);
        this.presentToast("Locating nearest driver");
    }
  }



    //toast
    async presentToast(message) {
        const toast = await this.toastController.create({
          message: message,
          duration: 2000
        });
        toast.present();
    }

  ionViewDidEnter(){
    //get username
    this.location = "";
    //get price of services
    this.storage.get("price").then(price=>{
      this.price = price;
    });

    //get location
    this.storage.get("location").then(location=>{
      // this.location = location;
      this.setMap(location);
    });

    //vehicle type
    this.storage.get("vehicle_type").then(vehicle=>{
        this.vehicle = vehicle;
    })

    //check for payment return data
    this.confirmPayGatePayment();
  }


  confirmPayGatePayment(){
    var url = this.router.url;
    var url_to_array;
    var transaction_status;
    var did_make_payment = url.indexOf("TRANSACTION_STATUS");
    url_to_array = url.substring(did_make_payment).split("=");
    //when paygate payment was unsuccessful
    if(did_make_payment != -1 && url_to_array[1] != 5){
        this.disable_payment_options = false;
        console.log("no payment made, transaction status ", url_to_array[1]);
    }
    //if paygate payment was successful
    else if(did_make_payment != -1 && url_to_array[1] == 5){
        this.disable_payment_options = true;
        this.payment_mode = 'paygate';
        console.log("payment made, transaction status ", url_to_array[1]);
        this.confirmPage('none');
    }
    //paygate was not called
    else{
        console.log("pagate not called");
        this.disable_payment_options = false;
    }

  }


  setMap(location){
    var infowindow = new google.maps.InfoWindow();
    this.geolocation.getCurrentPosition().then((resp) => {
      console.log(resp.coords.latitude, resp.coords.longitude);
      var directionsService = new google.maps.DirectionsService();
      var directionsDisplay = new google.maps.DirectionsRenderer();
      this.latlng = {lat:resp.coords.latitude,lng:resp.coords.longitude};
      var pyrmont = new google.maps.LatLng(resp.coords.latitude, resp.coords.longitude);
      var map = new google.maps.Map(document.getElementById('map'), {
          center: location.coords,
          zoom: 15,
          zoomControl: false,
          mapTypeControl: false,
          scaleControl: false,
          streetViewControl: false,
          rotateControl: false,
          fullscreenControl: false,
            styles: [
            {
                "elementType": "geometry",
                "stylers": [
                {
                    "color": "#242f3e"
                }
                ]
            },
            {
                "elementType": "labels.text.fill",
                "stylers": [
                {
                    "color": "#746855"
                }
                ]
            },
            {
                "elementType": "labels.text.stroke",
                "stylers": [
                {
                    "color": "#242f3e"
                }
                ]
            },
            {
                "featureType": "administrative.locality",
                "elementType": "labels.text.fill",
                "stylers": [
                {
                    "color": "#d59563"
                }
                ]
            },
            {
                "featureType": "poi",
                "elementType": "labels.text.fill",
                "stylers": [
                {
                    "color": "#d59563"
                }
                ]
            },
            {
                "featureType": "poi.park",
                "elementType": "geometry",
                "stylers": [
                {
                    "color": "#263c3f"
                }
                ]
            },
            {
                "featureType": "poi.park",
                "elementType": "labels.text.fill",
                "stylers": [
                {
                    "color": "#6b9a76"
                }
                ]
            },
            {
                "featureType": "road",
                "elementType": "geometry",
                "stylers": [
                {
                    "color": "#38414e"
                }
                ]
            },
            {
                "featureType": "road",
                "elementType": "geometry.stroke",
                "stylers": [
                {
                    "color": "#212a37"
                }
                ]
            },
            {
                "featureType": "road",
                "elementType": "labels.text.fill",
                "stylers": [
                {
                    "color": "#9ca5b3"
                }
                ]
            },
            {
                "featureType": "road.arterial",
                "stylers": [
                {
                    "visibility": "off"
                }
                ]
            },
            {
                "featureType": "road.highway",
                "elementType": "geometry",
                "stylers": [
                {
                    "color": "#746855"
                }
                ]
            },
            {
                "featureType": "road.highway",
                "elementType": "geometry.stroke",
                "stylers": [
                {
                    "color": "#1f2835"
                }
                ]
            },
            {
                "featureType": "road.highway",
                "elementType": "labels",
                "stylers": [
                {
                    "visibility": "off"
                }
                ]
            },
            {
                "featureType": "road.highway",
                "elementType": "labels.text.fill",
                "stylers": [
                {
                    "color": "#f3d19c"
                }
                ]
            },
            {
                "featureType": "road.local",
                "stylers": [
                {
                    "visibility": "off"
                }
                ]
            },
            {
                "featureType": "transit",
                "elementType": "geometry",
                "stylers": [
                {
                    "color": "#2f3948"
                }
                ]
            },
            {
                "featureType": "transit.station",
                "elementType": "labels.text.fill",
                "stylers": [
                {
                    "color": "#d59563"
                }
                ]
            },
            {
                "featureType": "water",
                "elementType": "geometry",
                "stylers": [
                {
                    "color": "#17263c"
                }
                ]
            },
            {
                "featureType": "water",
                "elementType": "labels.text.fill",
                "stylers": [
                {
                    "color": "#515c6d"
                }
                ]
            },
            {
                "featureType": "water",
                "elementType": "labels.text.stroke",
                "stylers": [
                {
                    "color": "#17263c"
                }
                ]
            }
            ],
        });
        var marker = new google.maps.Marker({
            position: location.coords,
            map: map,
            title: 'My location'
          });
     })
  }


  homePage(){
      clearInterval(this.interval);
      this.storage.clear().then(()=>{
        this.router.navigateByUrl('home');
      });
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
