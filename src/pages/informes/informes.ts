import {AfterViewInit, Component, OnDestroy, OnInit} from '@angular/core';
import {IonicPage, NavController, NavParams, ToastController} from 'ionic-angular';
import {Datos, User, Math, InfoEquipo} from "../../providers/user/user";
import {ConstantesProvider} from "../../providers/services/constantes.provider";
import {TranslateService} from "@ngx-translate/core";


@IonicPage()
@Component({
  selector: 'page-informes',
  templateUrl: 'informes.html',
})

export class InformesPage implements OnInit, OnDestroy {
  usuario = localStorage.getItem('usuario');

  infoEquipo: InfoEquipo = {
    id: 0,
    serialNumber: '',
    nombreEquipo: '',
    descripcion: '',
    emailCliente: '',
    lastConn: '',
  };

  datos = {
  id: 0,
  serialNumber: '',
  dataTime: '',
  tension: 0.0,
  corriente: 0.0,
  on: '',
  off: '',
  }

  math: Math={
    serialNumber: '',
    tipo: '',
  }

  infoDatosArray = [];
  infoEquipoArray = [];
  decomposicion: any[] = [];
  decomposicion2: any[] = [];

  myImg = '';
  dataEquipo = [];
  mirrorSerial = '';


  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public constProvider: ConstantesProvider,
              public user: User,
              public toastCtrl: ToastController,
              public translateService: TranslateService,) {
    this.user.getInformes(this.usuario).subscribe((data: any) => {
      this.infoDatosArray = data;
      console.log (' Informes Page=> ');
      console.log (data);
      this.infoDatosArray.map(item => {
        this.datos.id = item.id;
        this.datos.serialNumber = item.serialNumber;
        this.datos.dataTime = item.dataTime;
        this.datos.tension = item.tension;
        this.datos.corriente = item.corriente;
        this.datos.on = item.on;
        this.datos.off = item.off;
        let indice = 0;
        if ( item.serialNumber !== this.mirrorSerial){
          this.mirrorSerial = item.serialNumber;
          let potencia = ( this.datos.tension * this.datos.corriente) / 1000;
          console.log('potencia=' + potencia)
          if(potencia < 500){ indice= 1; this.myImg='/assets/img/range_low.png'};
          if(potencia >= 500 && potencia <= 1000 ){ indice= 2; this.myImg='/assets/img/range_med.png'};
          if( potencia >= 1000){ indice= 3; this.myImg='/assets/img/range_high.png'};
          console.log('mymage= '+ this.myImg);

          this.dataEquipo.push({ 'i': this.myImg, 'serialNumber': item.serialNumber, 'tension' : item.tension, 'corriente': item.corriente/1000, 'potencia': potencia });
          }
        });
      });

    console.log('this.dataEquipo=> ')
    console.log(this.dataEquipo);

    this.user.getEquiposUsuario(this.usuario).subscribe( (data: any) =>{
      this.infoEquipoArray = data;
      console.log (' InfoEquipo => ');
      console.log (data);
      this.infoEquipoArray.map(item => {
        this.infoEquipo.id = item.id;
        this.infoEquipo.serialNumber = item.serialNumber;
        this.infoEquipo.nombreEquipo = item.nombreEquipo;
        this.infoEquipo.descripcion = item.descripcion;
        this.infoEquipo.emailCliente = item.emailCliente;
        this.infoEquipo.lastConn = item.lastConn;
      });
    });
  }
  ngOnInit(): void {
    if (!this.user.isLoggedIn()) {
      let toast = this.toastCtrl.create({
        message: 'Es necesario una session ',
        duration: 4000,
        position: 'top'
      });
      toast.present();
      this.navCtrl.push('LoginPage');
    }
  }

  btnDetalles(serialNumber: string){
    console.log('numero serial= ', serialNumber);
    this.constProvider.setLink(serialNumber);
    this.navCtrl.push('DatosPage');

  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad InformesPage');
  }
  btnLogout(){
    localStorage.setItem('usuario', '');
    this.navCtrl.push('LoginPage');
  }
  btnNav(){
    this.navCtrl.push('ContentPage');
  }
  btnVivienda(){
    this.navCtrl.push('ViviendasPage');
  }
  btnSettings(){
    console.log('show=> ');
    this.navCtrl.push('SettingsPage');
  }
  ngOnDestroy(): void {
  }
}
