import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import * as $ from 'jquery';


@Component({
  selector: 'app-paygate',
  templateUrl: './paygate.page.html',
  styleUrls: ['./paygate.page.scss'],
})
export class PaygatePage implements OnInit {
  @Input() payment_req: string;
  @Input() checksum: string;
  constructor(private http:HttpClient, public modalController: ModalController) { }

  ngOnInit() {
  }

  ionViewDidEnter(){
    // var req_array = this.payment_req.split("=");
    // this.pay_req_id = req_array[2].split("&")[0].toString();
    // this.checksum = req_array[4];
    // console.log("Pay Id ", this.pay_req_id);
    // console.log("Checksum ", this.checksum);

    var form = <HTMLFormElement>document.getElementById("form");
    var pay_req = <HTMLInputElement>document.getElementById("pay_req_id");
    console.log("Pay Id  ",pay_req.value);
    console.log("Input ", this.payment_req);

    form.submit();
    // $('#form').submit(function(re){
    //   console.log("submitted");
    //   console.log(re);
    // });

  }

  dismiss(){
    this.modalController.dismiss({
      'dismissed': true
    });
  }
}
