import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth'
import { AlertController } from '@ionic/angular';
import { LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';
@Component({
  selector: 'app-password-reset',
  templateUrl: './password-reset.page.html',
  styleUrls: ['./password-reset.page.scss'],
})
export class PasswordResetPage implements OnInit {
  email = "";
  constructor(public loadingController: LoadingController,public alertController: AlertController, public auth: AngularFireAuth,private router : Router) { }

  ngOnInit() {
  }


  confirmReset(){
    this.auth.auth.sendPasswordResetEmail(this.email).then(re=>{
      console.log(re);
      this.showMsg("Please check your inbox","Email sent");
    }).catch(err=>{
      this.showMsg(err,"Error");
    });
  }


  async showMsg(err,msg){
    const alert = await this.alertController.create({
      header: msg,
      // subHeader: 'error message:',
      message: err,
      buttons: ['OK']
    });
    await alert.present();
  }

}
