import { Component } from '@angular/core';
import {Events, IonicPage, NavController, NavParams} from 'ionic-angular';


@IonicPage()
@Component({
  selector: 'page-salir',
  templateUrl: 'salir.html',
})
export class SalirPage {

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public events: Events,
              ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SalirPage');
  }

  btnSalir(){
//    this.ws.socket$.next(localStorage.getItem('usuario') + ': Offline');
    localStorage.setItem('usuario', '');
    this.events.publish('user:created', '');
    this.navCtrl.push('LoginPage');
  }
  btnCancelar(){
    this.navCtrl.push('ContentPage');
  }

}
