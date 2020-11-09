import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { AngularFireAuth } from 'angularfire2/auth'
@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})

export class RegisterPage implements OnInit {

  email = "";
  fullname = "";
  mobile = "";
  password = "";
  confirm_password = "";
  password_type = 'Password';
  confirm_password_type = 'Password';
  userCollection:AngularFirestoreCollection;
  registerSpinner = false;
  constructor(db: AngularFirestore, public loadingController: LoadingController,public alertController: AlertController, public auth: AngularFireAuth,private router : Router) {
    this.userCollection = db.collection("users");
  }

  ngOnInit() {
  }


  viewPassword(type){
    this.password_type = type;
  }

  viewConfirmPassword(type){
    this.confirm_password_type = type;
  }

  async Register(){
    //validate input
    if(this.email == "" && this.fullname == "" && this.mobile == "" && this.password == "" && this.confirm_password == ""){
      this.showError("Please complete the sign up form");
    }else if(this.email == ""){
      this.showError("Please a valid email address");
    }else if(this.fullname == "" || this.fullname.length < 3){
      this.showError("Please enter your full name");
    }else if(this.mobile == "" || this.mobile.length < 10){
      this.showError("Please enter a valid phone number");
    }else if(this.password == ""){
      this.showError("Please enter a password");
    }else if(this.confirm_password == ""){
      this.showError("Please confirm your password");
    }
    else if(this.password != this.confirm_password){
      this.showError("Passwords do not match")
    }
    else{

      //register user
      this.registerSpinner = true;
      this.auth.auth.createUserWithEmailAndPassword(this.email, this.password).then(()=>{
        this.userCollection.doc(this.email).set({mobile:this.mobile, email:this.email, fullname:this.fullname}).catch(err=>{
          this.showError(err);
        }).then(()=>{
          //go to login page
          this.auth.auth.currentUser.sendEmailVerification().then(x=>{
            // console.log(x);
            this.showRegistrationMessage("Registration successful. Please check your inbox to confirm your account")
            .then(()=>{
              this.auth.auth.signOut().then(()=>{
                this.router.navigateByUrl('login');
              });
            });
          })
        });
      }).catch(err=>{
        this.showError(err);
      });

    }
  }


  async showRegistrationMessage(msg){
    const alert = await this.alertController.create({
      // header: 'Unbale to create account',
      // subHeader: 'error message:',
      message: msg,
      buttons: ['OK'],
      backdropDismiss:false
    });
    await alert.present();
  }

  async showError(err){
    //
    this.registerSpinner = false;
    const alert = await this.alertController.create({
      header: 'Unbale to create account',
      // subHeader: 'error message:',
      message: err,
      buttons: ['OK'],
      backdropDismiss:false
    });
    await alert.present();
  }

}
