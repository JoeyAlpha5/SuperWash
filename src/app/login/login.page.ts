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
    if(this.email == ""){
      this.showError("Please enter your email address");
    }
    
    else if(this.password == ""){
      this.showError("Please enter your password");
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

  passwordReset(){
    this.router.navigateByUrl('password-reset');
  }


  async showError(err){
    if(err == "Error: The email address is badly formatted."){
      err = "The email address is badly formatted.<br><br> Email address must follow the following format i.e. jsmith@example.com";
    }else if(err == "Error: There is no user record corresponding to this identifier. The user may have been deleted."){
      err = "The user details provided are incorrect.";
    }

    const alert = await this.alertController.create({
      header: 'Unable to login',
      // subHeader: 'error message:',
      message: err,
      buttons: ['OK']
    });
    await alert.present();
  }

}
