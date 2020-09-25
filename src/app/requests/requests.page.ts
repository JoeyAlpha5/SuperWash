import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';
import { AlertController } from '@ionic/angular';
import { Location } from "@angular/common";
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { Router } from '@angular/router';
// import { CallNumber } from '@ionic-native/call-number/ngx';
import { ActionSheetController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { ToastController } from '@ionic/angular';
import { AngularFireAuth } from 'angularfire2/auth'
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { CallNumber } from '@ionic-native/call-number/ngx';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { take } from 'rxjs/operators';
declare var google;
@Component({
  selector: 'app-requests',
  templateUrl: './requests.page.html',
  styleUrls: ['./requests.page.scss'],
})
export class RequestsPage implements OnInit {
  display_home;
  user;
  fullName = "";
  id_no; 
  mobile;
  distance;
  user_list;
  photo;
  plate;
  email;
  price;
  default;
  userCollection:AngularFirestoreCollection;
  washerCollection:AngularFirestoreCollection;
  washer_email;
  user_data;
  url = "https://jalome-api-python.herokuapp.com/distance-matrix/";
  constructor(private callNumber: CallNumber,private route: Router,private storage: Storage,public alertController: AlertController,private location: Location,private geolocation: Geolocation,public actionSheetController: ActionSheetController,private http: HttpClient,public toastController: ToastController,db: AngularFirestore,public auth: AngularFireAuth) {
    this.userCollection = db.collection("users");
    this.washerCollection = db.collection("washers");
   }

  ngOnInit() {
  }

  ionViewDidEnter(){
    this.auth.auth.onAuthStateChanged(user=>{
      console.log(user.email);
      this.userCollection.doc(user.email).ref.get().then(x=>{
        console.log(x.data());
        console.log(x);
        this.user_list = x.data();
        if("washer" in this.user_list && this.user_list.washer == true){
          console.log(this.user_list.washer);
          this.washer();
        }else{
          console.log(this.user_list.washer);
          this.notWasher(this.user_list.fullname);
        }
      });
    });
    this.storage.get("price").then(price=>{
      this.price = price;
    });
  }


  washer(){
    this.display_home = false;
    this.auth.auth.onAuthStateChanged(user=>{
      this.washerCollection.doc(user.email).ref.get().then(x=>{
        var data = x.data();
        this.washer_email = data["email"];
        if(data["washer_request"] != "none"){
          var current_req = this.userCollection.valueChanges().subscribe(users=>{
            for(var u = 0; u < users.length; u++){
              if(users[u].fullname == data["washer_request"]){
                console.log(data["washer_request"]);
                console.log(users[u]);
                this.email = users[u].email;
                this.mobile = users[u].mobile;
                this.fullName = users[u].fullname;
                this.map();
              }
            }
          });
        }else{
          this.showError("You have no on-going car wash requests", "No requests");
        }
      });
    });
  }

  notWasher(name){
    this.display_home = true;
    //get driver details
    this.washerCollection.ref.get().then(x=>{
      console.log(x.docs);
      console.log(x.docs[0].data())
      for(var w = 0; w < x.docs.length; w++){
        if(x.docs[w].data().washer_request == name){
          console.log(x.docs[w]);
          this.email = x.docs[w].data().email;
          this.mobile = x.docs[w].data().mobile;
          this.fullName = x.docs[w].data().fullname;
          this.id_no = x.docs[w].data().driver_id;
          this.photo = x.docs[w].data().image;
          this.default = x.docs[w].data().default;
          // washers.unsubscribe();
          break;
        }else{
          this.fullName = "";
        }
      }
      if(this.fullName == ""){
        this.showError("You have no on-going car wash requests", "No requests");
      }

    });
    // var washers = this.washerCollection.valueChanges().pipe(take(1)).subscribe(data=>{
    //   for(var w = 0; w < data.length; w++){
    //     if(data[w].washer_request == name){
    //       console.log(data[w]);
    //       this.email = data[w].email;
    //       this.mobile = data[w].mobile;
    //       this.fullName = data[w].fullname;
    //       this.id_no = data[w].driver_id;
    //       this.photo = data[w].image;
    //       // washers.unsubscribe();
    //       break;
    //     }else{
    //       this.fullName = "";
    //     }
    //   }
    //   if(this.fullName == ""){
    //     this.showError("You have no on-going tow truck requests", "No requests");
    //   }
    //   washers.unsubscribe();
    // });

  }


  dismiss(){
    this.route.navigate(['/home']);
  }

  completed(){
    this.storage.remove("passenger_fullname");
    console.log(this.user_list);
    this.washerCollection.doc(this.washer_email).update({washer_request:"none"});
    this.route.navigate(['/home']);
  }


  cancel(){
    console.log(this.default);
    //check if the washer is the default washer first
    if(this.default == true){
        this.washerCollection.doc('default').update({washer_request:'none'});
        this.http.get(this.url, {params:{"type":"cancelReq", "device_id":this.user_list.device_id} }).subscribe(x=>{  
          this.route.navigate(['/home']);
        });
    }else{
        if(this.mobile != undefined && this.mobile != null){
          console.log(this.mobile);
          console.log(this.mobile);
          this.washerCollection.doc(this.email).update({washer_request:"none"});
          this.http.get(this.url, {params:{"type":"cancelReq", "device_id":this.user_list.device_id} }).subscribe(x=>{  
            this.route.navigate(['/home']);
          });
      }
    }

  }

  call(mobile){
    console.log(mobile);
    this.callNumber.callNumber(mobile, true)
    .then(res => console.log('Launched dialer!', res))
    .catch(err => this.showError("Unable to place call, please try again", "Call error"));
  }


  //report driver 
  async report(){
    const actionSheet = await this.actionSheetController.create({
      header: 'Report',
      buttons: [{
        text: 'Report washer for poor service',
        role: 'destructive',
        icon: 'thumbs-down',
        handler: () => {
          //report driver
          var url = "https://jalome-api-python.herokuapp.com/distance-matrix/";
          this.http.get(url, {params:{"type":"reportDriver", "driver":this.fullName} }).subscribe(x=>{
            this.presentToast("Washer has been reported");
          });
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


  //toast
  async presentToast(message) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000
    });
    toast.present();
  }

  async showError(err,header){
    const alert = await this.alertController.create({
      header: header,
      subHeader: 'message:',
      message: err,
      buttons: [
        {
          text: 'Okay',
          handler: () => {
            this.route.navigate(['/home']);
          }
        }
      ]
    });
    await alert.present();
  }




    //map render
    map(){
      this.geolocation.getCurrentPosition().then((resp) => {
        var directionsService = new google.maps.DirectionsService();
        var directionsDisplay = new google.maps.DirectionsRenderer();
          console.log(resp.coords.latitude, resp.coords.longitude);
          var pyrmont = new google.maps.LatLng(resp.coords.latitude, resp.coords.longitude);
          var map = new google.maps.Map(document.getElementById('requestMap'), {
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
            var marker = new google.maps.Marker({position: uluru, map: map});
            //set destination
            this.storage.get("destination").then(dest=>{
                var destination = dest;
                var marker = new google.maps.Marker({position: destination, map: map});
                this.showRoute(map,uluru,destination);
            });
        });
    }
  
  
    showRoute(map,uluru,destination){
      var directionsService = new google.maps.DirectionsService();
      var directionsDisplay = new google.maps.DirectionsRenderer();
      //add your map to direction service
      directionsDisplay.setMap(map);
      var start = uluru;
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
}
