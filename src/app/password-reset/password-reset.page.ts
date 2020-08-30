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
    if(err == "Error: The email address is badly formatted."){
      err = "The email address is badly formatted.<br><br> Email address must follow the following format i.e. jsmith@example.com";
    }else if(err == "Error: There is no user record corresponding to this identifier. The user may have been deleted."){
      err = "No user with the provided email address exists.";
    }
    const alert = await this.alertController.create({
      header: "Unable to continue",
      // subHeader: 'error message:',
      message: err,
      buttons: ['OK']
    });
    await alert.present();
  }

}
