import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-profile-edit',
  templateUrl: './profile-edit.page.html',
  styleUrls: ['./profile-edit.page.scss'],
})
export class ProfileEditPage implements OnInit {
  @Input() fullname: string;
  @Input() mobile: string;
  @Input() email: string;
  userCollection:AngularFirestoreCollection;
  constructor(public modalController: ModalController,db: AngularFirestore,public alertController: AlertController) {
    this.userCollection = db.collection("users");
   }

  ngOnInit() {
  }


  dismiss(){
    this.modalController.dismiss({
      'dismissed': true
    });
  }

  save(){
    if(this.fullname == "" || this.fullname.length < 3){
      this.showErr("Please enter your full name");
    }else if(this.mobile == "" || this.mobile.length < 10){
      this.showErr("Please enter a valid phone number");
    }else {
      this.userCollection.doc(this.email).update({fullname:this.fullname,mobile:this.mobile}).then(()=>{
        this.dismiss();
      });
    }
  }


  async showErr(err){
    const alert = await this.alertController.create({
      header: 'Unable to continue',
      // subHeader: 'error message:',
      message: err,
      buttons: ['OK']
    });
    await alert.present();
  }

}
