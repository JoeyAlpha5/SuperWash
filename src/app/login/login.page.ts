import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth'
import { AlertController } from '@ionic/angular';
import { LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  password = "";
  email = "";
  admin_array = [];
  password_type = 'Password';
  dashboardAdmins:AngularFirestoreCollection;
  constructor(db: AngularFirestore, public loadingController: LoadingController,public alertController: AlertController, public auth: AngularFireAuth,private router : Router) {
      //get all the admin emails that can't sign in
      this.dashboardAdmins = db.collection("dashboardadmins");
      this.dashboardAdmins.get().subscribe(admins=>{
        admins.forEach(admin=>{
          // console.log(admin.id);
          this.admin_array.push(admin.id);
        });
      });
   }

  ngOnInit() {
  }


  viewPassword(type){
    this.password_type = type;
  }

  signIn(){
    if(this.email == ""){
      this.showError("Please enter your email address");
    }
    
    else if(this.password == ""){
      this.showError("Please enter your password");
    }
    else if(this.admin_array.includes(this.email)){
      this.showError("Dashboard admins must use a different email to sign in on the app.");
    }
    else{
      this.auth.auth.signInWithEmailAndPassword(this.email,this.password).catch(err=>{
        if(err.message == "Access to this account has been temporarily disabled due to many failed login attempts. You can immediately restore it by resetting your password or you can try again later."){
          this.showError("Access to this account has been temporarily disabled due to many failed login attempts. please try again after 1 minute");  
        }else{
          this.showError(err);
        }
      }).then(()=>{
        if(this.auth.auth.currentUser.emailVerified){
          // this.checkUser();
          this.router.navigateByUrl('home');
        }else{
          this.showError("Please verify your email before using the app");
          //send a verification
          this.auth.auth.currentUser.sendEmailVerification();
        }
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
