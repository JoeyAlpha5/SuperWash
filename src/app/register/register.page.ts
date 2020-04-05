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
  userCollection:AngularFirestoreCollection;
  constructor(db: AngularFirestore, public loadingController: LoadingController,public alertController: AlertController, public auth: AngularFireAuth,private router : Router) {
    this.userCollection = db.collection("users");
  }

  ngOnInit() {
  }


  async Register(){
    //validate input
    if(this.email == "" || this.fullname == "" || this.mobile == "" || this.password == "" || this.confirm_password == ""){
      this.showError("Please complete the sign up form")
    }
    else if(this.password != this.confirm_password){
      this.showError("Passwords do not match")
    }
    else{
      //register user
      this.auth.auth.createUserWithEmailAndPassword(this.email, this.password).then(()=>{
        this.userCollection.doc(this.email).set({mobile:this.mobile, email:this.email, fullname:this.fullname}).catch(err=>{
          this.showError(err);
        }).then(()=>{
          //go to login page
          this.router.navigateByUrl('login');
        });
      }).catch(err=>{
        this.showError(err);
      });

    }
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
