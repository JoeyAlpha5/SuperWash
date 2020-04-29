import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ConfirmRequestPageRoutingModule } from './confirm-request-routing.module';

import { ConfirmRequestPage } from './confirm-request.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ConfirmRequestPageRoutingModule
  ],
  declarations: [ConfirmRequestPage]
})
export class ConfirmRequestPageModule {}
