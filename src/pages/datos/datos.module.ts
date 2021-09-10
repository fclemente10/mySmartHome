import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DatosPage } from './datos';
import {TranslateModule} from "@ngx-translate/core";


@NgModule({
  declarations: [
    DatosPage,
  ],
    imports: [
        IonicPageModule.forChild(DatosPage),
        TranslateModule,
    ],
})
export class DatosPageModule {}
