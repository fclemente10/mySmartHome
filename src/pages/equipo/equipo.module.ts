import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EquipoPage } from './equipo';
import {TranslateModule} from "@ngx-translate/core";

@NgModule({
  declarations: [
    EquipoPage,
  ],
    imports: [
        IonicPageModule.forChild(EquipoPage),
        TranslateModule,
    ],
})
export class EquipoPageModule {}
