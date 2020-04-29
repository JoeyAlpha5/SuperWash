import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { AngularFireAuth } from 'angularfire2/auth';
import { AlertController } from '@ionic/angular';
import { LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { HttpClient } from '@angular/common/http';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { Observable } from 'rxjs';
declare var google;


@Component({
  selector: 'app-confirmed',
  templateUrl: './confirmed.page.html',
  styleUrls: ['./confirmed.page.scss'],
})
export class ConfirmedPage implements OnInit {
  location;
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
  url = "https://jalome-api-python.herokuapp.com/distance-matrix/";
  washer_details:Observable<any>;
  constructor(db: AngularFirestore, public loadingController: LoadingController,public alertController: AlertController, public auth: AngularFireAuth,private router : Router,private geolocation: Geolocation,private storage: Storage,private http: HttpClient) { 
    this.userCollection = db.collection("users");
    this.washerCollection = db.collection("washers");
  }

  ngOnInit() {
  }


  confirmPage(){
    var get_washers = this.washerCollection.valueChanges().subscribe(washers=>{
        // console.log(washers);
        this.washers = [];
        for(let u = 0; u < washers.length; u++){
            if(washers[u].washer_request == "none"){
                // console.log("driver",washers[u]);
                this.washers.push(washers[u]);
            }
        }
        //get user details
        this.auth.auth.onAuthStateChanged(user=>{
            console.log(user.email);
            this.userCollection.doc(user.email).valueChanges().subscribe(user_data=>{
                this.name = user_data["fullname"];
                this.mobile = user_data["mobile"];
            });
          });

        this.washer_details = this.http.get(this.url, {params:{"type":"getDriver","user_fullname":this.name,"user_mobile":this.mobile ,"drivers":JSON.stringify(this.washers),"location":JSON.stringify(this.latlng)} });

        this.washer_details.subscribe(nearest_washer=>{
            // console.log(nearest_washer.Response.email);
            var nearest_washer_sub = this.userCollection.doc(nearest_washer.Response.email).valueChanges().subscribe(w=>{
                console.log("nearest washer id ", w["device_id"]);
                this.sendreq(get_washers, nearest_washer_sub);

            })
        });
    })
  }


  sendreq(washers, nearest_washer_sub){
      washers.unsubscribe();
      nearest_washer_sub.unsubscribe();
      console.log("unsubscribed");
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
          center: pyrmont,
          zoom: 15,
          zoomControl: false,
          mapTypeControl: false,
          scaleControl: false,
          streetViewControl: false,
          rotateControl: false,
          fullscreenControl: false,
                      styles: [{
                "elementType": "geometry",
                "stylers": [{
                    "color": "#f5f5f5"
                }]
            }, {
                "elementType": "labels.icon",
                "stylers": [{
                    "visibility": "off"
                }]
            }, {
                "elementType": "labels.text.fill",
                "stylers": [{
                    "color": "#616161"
                }]
            }, {
                "elementType": "labels.text.stroke",
                "stylers": [{
                    "color": "#f5f5f5"
                }]
            }, {
                "featureType": "administrative",
                "elementType": "geometry",
                "stylers": [{
                    "visibility": "off"
                }]
            }, {
                "featureType": "administrative.land_parcel",
                "elementType": "labels.text.fill",
                "stylers": [{
                    "color": "#bdbdbd"
                }]
            }, {
                "featureType": "poi",
                "stylers": [{
                    "visibility": "off"
                }]
            }, {
                "featureType": "poi",
                "elementType": "geometry",
                "stylers": [{
                    "color": "#eeeeee"
                }]
            }, {
                "featureType": "poi",
                "elementType": "labels.text.fill",
                "stylers": [{
                    "color": "#757575"
                }]
            }, {
                "featureType": "poi.park",
                "elementType": "geometry",
                "stylers": [{
                    "color": "#e5e5e5"
                }]
            }, {
                "featureType": "poi.park",
                "elementType": "labels.text.fill",
                "stylers": [{
                    "color": "#9e9e9e"
                }]
            }, {
                "featureType": "road",
                "elementType": "geometry",
                "stylers": [{
                    "color": "#ffffff"
                }]
            }, {
                "featureType": "road",
                "elementType": "labels.icon",
                "stylers": [{
                    "visibility": "off"
                }]
            }, {
                "featureType": "road.arterial",
                "elementType": "labels.text.fill",
                "stylers": [{
                    "color": "#757575"
                }]
            }, {
                "featureType": "road.highway",
                "elementType": "geometry",
                "stylers": [{
                    "color": "#dadada"
                }]
            }, {
                "featureType": "road.highway",
                "elementType": "labels.text.fill",
                "stylers": [{
                    "color": "#616161"
                }]
            }, {
                "featureType": "road.local",
                "elementType": "labels.text.fill",
                "stylers": [{
                    "color": "#9e9e9e"
                }]
            }, {
                "featureType": "transit",
                "stylers": [{
                    "visibility": "off"
                }]
            }, {
                "featureType": "transit.line",
                "elementType": "geometry",
                "stylers": [{
                    "color": "#e5e5e5"
                }]
            }, {
                "featureType": "transit.station",
                "elementType": "geometry",
                "stylers": [{
                    "color": "#eeeeee"
                }]
            }, {
                "featureType": "water",
                "elementType": "geometry",
                "stylers": [{
                    "color": "#c9c9c9"
                }]
            }, {
                "featureType": "water",
                "elementType": "labels.text.fill",
                "stylers": [{
                    "color": "#9e9e9e"
                }]
            }],
        });
        var uluru = {lat: resp.coords.latitude, lng: resp.coords.longitude};
        this.showRoute(map,uluru,location);
     })
  }

  showRoute(map,uluru,destination){
    var directionsService = new google.maps.DirectionsService();
    var directionsDisplay = new google.maps.DirectionsRenderer();
    //add your map to direction service
    directionsDisplay.setMap(map);
    var start = destination;
    var end = destination;
    var request = {
        origin: start,
        destination: end,
        travelMode: 'DRIVING'
    };
    directionsService.route(request, function (result, status) {
        if (status == 'OK') {
            directionsDisplay.setDirections(result);
        }
    });
  }

  homePage(){
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
