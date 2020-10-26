import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { AngularFireAuth } from 'angularfire2/auth';
import { AlertController } from '@ionic/angular';
import { LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';
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
  selected_services = [];
  selected_service_price = [];
  sum_of_service = 0.00;
  vat_amount = 0.00;
  vat_plus_total = 0.00;
  vehicle;
  radioVal;
  constructor(db: AngularFirestore, public loadingController: LoadingController,public alertController: AlertController, public auth: AngularFireAuth,private router : Router,private storage: Storage) { 
    this.serviceCollection = db.collection("services");
    this.userCollection = db.collection("users");

  }

  ngOnInit() {
  }

  ionViewDidEnter(){
    //get user details
    this.storage.get("vehicle_type").then(vehicle=>{
      this.vehicle = vehicle;
      this.serviceCollection.doc(vehicle).collection('1').valueChanges().subscribe(x=>{
        console.log(x);
        this.services = x;
        this.radioVal = '';
      });
    })
    // this.storage.clear();
    this.storage.remove("price");
    this.sum_of_service = 0.00;
    this.vat_amount = 0.00;
    this.vat_plus_total = 0.00;
    this.selected_service_price = [];
    this.selected_services = [];
    // this.auth.auth.onAuthStateChanged(user=>{
    //   if(user){
    //     this.userCollection.doc(user.email).valueChanges().subscribe(x=>{
    //       this.user_value = x;
    //       this.user_fullname = this.user_value.fullname;
    //     });
    //   }
    // });
    //get services
    // this.serviceCollection.doc(this.vehicle).collection(1)

  }



  selectService(service,Price,Name){
    //if it's checked
    this.selected_services = [];
    this.selected_service_price = [];
    this.selected_services.push(Name);
    this.selected_service_price.push(parseInt(Price));
    this.calculateTotal();

    console.group("service detailes");
    console.log("Price ", Price);
    console.log("Name ", Name);
    console.groupEnd();
    // console.log(service.target.checked);
    // if(service.target.checked == true){
    //   this.selected_services.push(Name);
    //   this.selected_service_price.push(parseInt(Price));
    //   this.calculateTotal();

    //   //if it exists
    // }else{
    //   var name_index = this.selected_services.indexOf(Name);
    //   this.selected_services.splice(name_index,1);
    //   this.selected_service_price.splice(name_index,1);
    //   this.calculateTotal();
    // }
  }

  calculateTotal(){
    var amount = 0;
    console.log(this.selected_service_price);
    if(this.selected_service_price.length == 0){
      this.sum_of_service = 0.00;
      this.vat_amount = 0.00;
      this.vat_plus_total = 0.00;
    }
    else{
      for(var x = 0; x < this.selected_service_price.length; x++){
        amount += parseInt(this.selected_service_price[x]);
      }
      this.sum_of_service = amount;
      this.vat_amount = amount * 0.15;
      this.vat_plus_total = (amount * 0.15) + amount;
    }
  }


  confirmPage(){
    if(this.vat_plus_total != 0){
      this.storage.set("price", this.vat_plus_total).then((x)=>{
        this.router.navigateByUrl('payment');
      }).catch(err=>{
        this.showError(err);
      });
    }else{
      this.showError("Please select atleat one service");
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
