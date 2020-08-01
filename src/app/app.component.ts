import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AngularFireAuth } from 'angularfire2/auth'
import { OneSignal } from '@ionic-native/onesignal/ngx';
import { Storage } from '@ionic/storage';
import { HttpClient } from '@angular/common/http';
import { LoadingController } from '@ionic/angular';
import { Observable } from 'rxjs';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  public rootPage: any;
  data: Observable<any>;
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private router : Router,
    private auth: AngularFireAuth,
    private oneSignal: OneSignal,
    private storage: Storage,
    private http: HttpClient,
    private loadingController: LoadingController
  ) {
    this.initializeApp();
  }
  //check if user is logged in
  checkUser(){
    //check if user is signed in
    this.auth.auth.onAuthStateChanged(user=>{
      if(user){
        console.log(user);
        // this.router.navigateByUrl('home');
      }else{
        this.router.navigateByUrl('main');
      }
    });
  }

  setupPush(){
    this.oneSignal.startInit("3149b696-f959-4881-8cb3-4e9de3059598","790445352664");

    this.oneSignal.inFocusDisplaying(this.oneSignal.OSInFocusDisplayOption.Notification);

    this.oneSignal.handleNotificationOpened().subscribe((data) => {
      // do something when a notification is opened
      var notif = data.notification.payload.notificationID;
      this.showNotification(notif);
      

    });

    this.oneSignal.handleNotificationReceived().subscribe(() => {
      this.storage.get("current_userID").then(val=>{
        // this.database.object("userReceivedNotification/"+val).set(true);
      });
    });

    this.oneSignal.endInit();
  }


  async showNotification(notif){
    const loading = await this.loadingController.create({
      message: 'Loading, please wait..',
    });
    loading.present()
    var url = "https://jalome-api-python.herokuapp.com/distance-matrix/";
    this.data = this.http.get(url, {params:{"type":"getNotif","notif_id":notif} });
    //
    this.data.subscribe(re=>{
      console.log("result ", re);
      this.storage.set("passenger_fullname", re.Response.fullname);
      this.storage.set("passenger_mobile", re.Response.mobile);
      this.storage.set("destination", re.Response.destination);
      this.storage.set("price", re.Response.price);
      loading.dismiss();
      this.router.navigate(['/confirm-request']);
    },err=>{
      loading.dismiss();
      this.router.navigate(['/home']);
    })
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.checkUser();
      this.statusBar.backgroundColorByHexString('#7ED958');
      this.splashScreen.hide();
      this.setupPush();
      
    });
  }
}
