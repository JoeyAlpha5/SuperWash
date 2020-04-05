import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth'
import { AlertController } from '@ionic/angular';
import { LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';
@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  password = "";
  email = "";
  constructor( public loadingController: LoadingController,public alertController: AlertController, public auth: AngularFireAuth,private router : Router) { }

  ngOnInit() {
  }

  signIn(){
    if(this.email == "" || this.password == ""){
      this.showError("Please complete the sign in form")
    }else{
      //sing in
      this.auth.auth.signInWithEmailAndPassword(this.email,this.password).catch(err=>{
        this.showError(err);
      }).then(()=>{
        this.checkUser();
      });
    }

  }

  checkUser(){
    //check if user is signed in
    this.auth.auth.onAuthStateChanged(user=>{
      if(user){
        console.log(user);
        this.router.navigateByUrl('home');
      }
    });
  }


  async showError(err){
    const alert = await this.alertController.create({
      header: 'Registration error',
      subHeader: 'error message:',
      message: err,
      buttons: ['OK']
    });
    await alert.present();
  }

}
