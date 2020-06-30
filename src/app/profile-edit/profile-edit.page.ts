import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
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
  constructor(public modalController: ModalController,db: AngularFirestore) {
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
    this.userCollection.doc(this.email).update({fullname:this.fullname,mobile:this.mobile}).then(()=>{
      this.dismiss();
    });
  }

}
