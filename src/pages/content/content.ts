import {Component, OnDestroy, OnInit } from '@angular/core';
import {Events, IonicPage, NavController, ToastController} from 'ionic-angular';
import { User } from '../../providers';
import {TranslateService} from "@ngx-translate/core";
import { ConstantesProvider} from "../../providers/services/constantes.provider";
export const imin = true;

@IonicPage()
@Component({
  selector: 'page-content',
  templateUrl: 'content.html'
})

export class ContentPage implements OnInit, OnDestroy{
  value = this.translateService.instant(["UNCONFIGURED_DEVICE"]);
  usuario = '';
  infoUsuarioArray = [];

  infoEquipoArray = [];
  serialArray = [];
  serialData = [];


  constructor(public navCtrl: NavController,
              public user: User,
              public toastCtrl: ToastController,
              public translateService: TranslateService,
              public constProvider: ConstantesProvider,
              public events: Events,

              ) {
  this.usuario = localStorage.getItem('usuario');
  this.events.publish('user:created', this.usuario);
//  this.ws.socket$.next(localStorage.getItem('usuario') + ': Online');

  }
  ngOnInit(): void {

    if(!this.user.isLoggedIn()){
      let toast = this.toastCtrl.create({
        message: 'Es necesario una session ',
        duration: 4000,
        position: 'top'
      });
      toast.present();
      this.navCtrl.push('LoginPage');
    }else {
      this.user.getSeriales(this.usuario).subscribe((data: any) => {
        this.serialArray = data;
        console.log('seriales=>');
        console.log(data);
        this.serialArray.map(item => {
          if (item.serialNumber) {
            let toast = this.toastCtrl.create({
              message: this.value.UNCONFIGURED_DEVICE,
              duration: 4000,
              position: 'top'
            });
            toast.present();
          }
        });
      });
      this.user.getOneUser(this.usuario).subscribe((data: any) => {
        this.infoUsuarioArray = data;
        this.infoUsuarioArray.map(item => {
          this.usuario = item.nombre;
          console.log('this.usuario= ' + this.usuario)
        });
      }, err => {
        console.error('ERROR', err.message);
      });

      this.user.getEquiposUsuario(this.usuario).subscribe((data: any) => {
        this.infoEquipoArray = data;
      }, err => {
        console.log(err);
        let toast = this.toastCtrl.create({
          message: 'ERROR' + err.message,
          duration: 4000,
          position: 'top'
        });
        toast.present();
      });
    }
  }
  btnEditar(){

  }
  btnDetalles(serialNumber: string){
    console.log('numero serial= ', serialNumber);
    this.constProvider.setLink(serialNumber);
    this.navCtrl.push('EquipoPage');
  }
  btnBorrar(){
  }

  btnLogout(){
    localStorage.setItem('usuario', '');
    this.navCtrl.push('LoginPage');
  }
  btnSettings(){
    this.navCtrl.push('SettingsPage');
  }
  btnInformes(){
    this.navCtrl.push('InformesPage');
  }
  btnViviendas(){
    this.navCtrl.push('ViviendasPage');
  }
  ngOnDestroy() {
  }

}
