import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CarTypePageRoutingModule } from './car-type-routing.module';

import { CarTypePage } from './car-type.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CarTypePageRoutingModule
  ],
  declarations: [CarTypePage]
})
export class CarTypePageModule {}
