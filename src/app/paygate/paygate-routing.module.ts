import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PaygatePage } from './paygate.page';

const routes: Routes = [
  {
    path: '',
    component: PaygatePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PaygatePageRoutingModule {}
