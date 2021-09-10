import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SalirPage } from './salir';
import {TranslateModule} from "@ngx-translate/core";

@NgModule({
  declarations: [
    SalirPage,
  ],
    imports: [
        IonicPageModule.forChild(SalirPage),
        TranslateModule,
    ],
})
export class SalirPageModule {}
