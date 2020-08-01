import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PaygatePageRoutingModule } from './paygate-routing.module';

import { PaygatePage } from './paygate.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PaygatePageRoutingModule
  ],
  declarations: [PaygatePage]
})
export class PaygatePageModule {}
