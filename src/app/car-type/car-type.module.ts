import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { IonicModule } from '@ionic/angular';

import { CarTypePageRoutingModule } from './car-type-routing.module';

import { CarTypePage } from './car-type.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FontAwesomeModule,
    CarTypePageRoutingModule
  ],
  declarations: [CarTypePage]
})
export class CarTypePageModule {}
