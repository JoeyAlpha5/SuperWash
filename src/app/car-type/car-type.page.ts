import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
@Component({
  selector: 'app-car-type',
  templateUrl: './car-type.page.html',
  styleUrls: ['./car-type.page.scss'],
})
export class CarTypePage implements OnInit {
  
  value;
  constructor(private storage: Storage,public alertController: AlertController,private router : Router) { }

  ngOnInit() {
  }

  selctedCar(value){
    this.value = value;
    console.log(this.value);
  }

  continue(){
    if(this.value == undefined && this.value == null){
      this.showError("Please select a vehicle type");
    }else{
      this.storage.set("vehicle_type",this.value).then(()=>{
        this.router.navigateByUrl('service');
      });
    }
  }


  async showError(err){
    const alert = await this.alertController.create({
      header: 'Unable to continue',
      subHeader: 'error message:',
      message: err,
      buttons: ['OK']
    });
    await alert.present();
  }

}
