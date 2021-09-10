import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { InformesPage } from './informes';
import {TranslateModule} from "@ngx-translate/core";

@NgModule({
  declarations: [
    InformesPage,
  ],
    imports: [
        IonicPageModule.forChild(InformesPage),
        TranslateModule,
    ],
})
export class InformesPageModule {}
