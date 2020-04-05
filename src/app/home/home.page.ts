import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import { AngularFireAuth } from 'angularfire2/auth'
import { AlertController } from '@ionic/angular';
import { LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  constructor(public platform: Platform,public loadingController: LoadingController,public alertController: AlertController, public auth: AngularFireAuth,private router : Router) {
    this.platform.backButton.subscribeWithPriority(0, ()=>{
      navigator['app'].exitApp();
    });
  }


  servicePage(){
    this.router.navigateByUrl('service');
  }


  profilePage(){
    this.router.navigateByUrl('profile');
  }


}
