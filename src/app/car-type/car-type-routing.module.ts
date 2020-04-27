import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CarTypePage } from './car-type.page';

const routes: Routes = [
  {
    path: '',
    component: CarTypePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CarTypePageRoutingModule {}
