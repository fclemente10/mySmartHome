import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {IonicPage, NavController, NavParams, ToastController, AlertController} from 'ionic-angular';
import {User} from "../../providers";
import {FormControl, FormGroup, NgForm, Validators} from "@angular/forms";
import {Vivienda} from "../../providers/user/user";
import {ConstantesProvider} from "../../providers/services/constantes.provider";
import {TranslateService} from "@ngx-translate/core";


@IonicPage()
@Component({
  selector: 'page-viviendas',
  templateUrl: 'viviendas.html',
})
export class ViviendasPage implements OnInit, OnDestroy {
  usuario='';
  viviendaArray = [];
  viviendaData = [];
  formulario: FormGroup;
  creat: boolean;
  erase: boolean;
  value = this.translate.instant(["DELETE_BUTTON",
    "SURE_DELETE","SUCCESS_DELETE","DWELLING_NAME","CANCEL",
    "OK"]);
  nombresProhibidos = ['Test', 'test', 'TEST', 'Prueba', 'prueba', 'PRUEBA', this.value.DWELLING_NAME];

  vivienda: Vivienda = {
  id: 0,
  nombreVivienda: '',
  emailCliente: '',
  pais: '',
  ciudad: '',
  ubicacion: '',
  codigoPostal: '',
}

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public user: User,
              public constProvider: ConstantesProvider,
              public toastCtrl: ToastController,
              private alertCtrl: AlertController,
              public translate: TranslateService,
              ) {
    console.log(this.value);
    this.usuario = localStorage.getItem('usuario');
    this.user.getViviendasCliente(this.usuario).subscribe((data: any) => {
      console.log('Viviendas => ');
      console.log(data);
      this.viviendaArray = data;
      this.viviendaArray.map(item=>{
        this.viviendaData.push(item.nombreVivienda);
        console.log(this.viviendaData);
      })
    }, (err) => {
      // Unable to log in
      let toast = this.toastCtrl.create({
        message: 'Error' + err.message,
        duration: 5000,
        position: 'top'
      });
      toast.present();
    });

    this.formulario = new FormGroup({
      viviendaData: new FormGroup({
        id: new FormControl(''),
        nombreVivienda: new FormControl(null, [Validators.required, this.esProhibido.bind(this)]),
//        emailCliente: new FormControl(null, [Validators.required]),
        pais: new FormControl(''),
        ciudad: new FormControl(''),
        ubicacion: new FormControl(''),
        codigoPostal: new FormControl(''),
      })
    });

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ViviendaPage');
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
    }
    this.creat = false;
    this.erase = false;
  }
  @ViewChild('f') FormGroup: NgForm;
  onSubmitCreat(){
    console.log('onSubmitCreat');
    this.vivienda.nombreVivienda = this.formulario.value.viviendaData.nombreVivienda;
    this.vivienda.emailCliente = this.usuario;
    this.vivienda.pais = this.formulario.value.viviendaData.pais;
    this.vivienda.ciudad = this.formulario.value.viviendaData.ciudad;
    this.vivienda.ubicacion = this.formulario.value.viviendaData.ubicacion;
    this.vivienda.codigoPostal = this.formulario.value.viviendaData.codigoPostal;

    this.user.postVivienda(this.vivienda).subscribe((resp) => {
      this.navCtrl.push('ViviendaPage');
    }, (err) => {
      // Unable to log in
      let toast = this.toastCtrl.create({
        message: 'Error' + err.message,
        duration: 5000,
        position: 'top'
      });
      toast.present();
    });
  }

 async onSubmitDelete(){
    this.vivienda.nombreVivienda = this.formulario.value.viviendaData.nombreVivienda;
    const alert = await this.alertCtrl.create({
      cssClass: 'my-custom-class',
      title: '¿' + this.value.DELETE_BUTTON + '?',
      message: this.value.SURE_DELETE,
      buttons: [
        {
          text: this.value.CANCEL,
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel:');
            this.doRefresh();
          }
        }, {
          text: this.value.OK,
          handler: () => {
            console.log('Confirm Okay');
            this.user.delVivienda(this.vivienda.nombreVivienda).subscribe((resp) => {
              let toast = this.toastCtrl.create({
                message: this.value.SUCCESS_DELETE,
                duration: 3500,
                position: 'top'
              });
              toast.present();
            }, (err) => {
              let toast = this.toastCtrl.create({
                message: 'Error' + err.message,
                duration: 3500,
                position: 'top'
              });
              toast.present();
            });
            this.doRefresh();
          }
        }
      ]
    });
    this.doRefresh();
    await alert.present();
    this.doRefresh();

  }

  btnDetalles(id: number, nombreHabitacion: string){
    this.constProvider.setLink(id.toString());
    this.constProvider.setParametro(nombreHabitacion);
    this.navCtrl.push('ViviendaPage');
  }
  btnBorrar(){
    this.creat = false;
    this.erase = true;
  }
  btnAnadir(){
    this.creat = true;
    this.erase = false
  }
  btnCancelar(){
    this.creat = false;
    this.erase = false;
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
  doRefresh() {
    this.navCtrl.setRoot(this.navCtrl.getActive().component);
  }
  esProhibido(nombre: FormControl): {[s: string]: boolean} {
    if (this.nombresProhibidos.indexOf(nombre.value) !== -1) {
      return  {nombreEsProhibido: true};
    }
    return null;
  }
  ngOnDestroy(): void {
    this.creat = false;
    this.erase = false
  }
}
