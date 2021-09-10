import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ViviendaPage } from './vivienda';
import {TranslateModule} from "@ngx-translate/core";

@NgModule({
  declarations: [
    ViviendaPage,
  ],
    imports: [
        IonicPageModule.forChild(ViviendaPage),
        TranslateModule,
    ],
})
export class ViviendaPageModule {}
