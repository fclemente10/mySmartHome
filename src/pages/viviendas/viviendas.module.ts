import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ViviendasPage } from './viviendas';
import {TranslateModule} from "@ngx-translate/core";

@NgModule({
  declarations: [
    ViviendasPage,
  ],
    imports: [
        IonicPageModule.forChild(ViviendasPage),
        TranslateModule,
    ],
})
export class ViviendasPageModule {}
