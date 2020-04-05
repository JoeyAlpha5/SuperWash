import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AngularFireAuth } from 'angularfire2/auth'

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  public rootPage: any;
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private router : Router,
    private auth: AngularFireAuth,
  ) {
    this.initializeApp();
  }
  //check if user is logged in
  checkUser(){
    //check if user is signed in
    this.auth.auth.onAuthStateChanged(user=>{
      if(user){
        console.log(user);
        this.router.navigateByUrl('home');
      }else{
        this.router.navigateByUrl('main');
      }
    });
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.checkUser();
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      
    });
  }
}
