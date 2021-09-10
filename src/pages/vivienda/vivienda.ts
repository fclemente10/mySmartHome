import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {IonicPage, NavController, NavParams, ToastController} from 'ionic-angular';
import {User} from "../../providers";
import {ConstantesProvider} from "../../providers/services/constantes.provider";
import {Habitacion, Vivienda} from "../../providers/user/user";
import {FormControl, FormGroup, NgForm, Validators} from "@angular/forms";

@IonicPage()
@Component({
  selector: 'page-vivienda',
  templateUrl: 'vivienda.html',
})
export class ViviendaPage implements OnInit, OnDestroy  {
  buscaParam = '';
  viviendaArray = [];
  habitacionArray = [];
  serialArray = [];
  serialData = [];
  formulario: FormGroup;
  formularioHab: FormGroup;
  editVivienda: boolean;
  editHabitacion: boolean;
  usuario = '';
  nombresProhibidos = ['Test', 'test', 'TEST', 'Prueba', 'prueba', 'PRUEBA'];

  vivienda: Vivienda = {
    id: null,
    nombreVivienda: '',
    emailCliente: '',
    pais: '',
    ciudad: '',
    ubicacion: '',
    codigoPostal: '',
  }
  habitacion: Habitacion= {
  id: null,
  nombreVivienda: '',
  nombreHabitacion: '',
  serialNumber: '',
}

  creat: boolean;
  creatHab: boolean;

constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public user: User,
              public constProvider: ConstantesProvider,
              public toastCtrl: ToastController,) {
  this.buscaParam = this.constProvider.getUrl();
  this.usuario = localStorage.getItem('usuario');
  this.user.getOneVivienda(this.buscaParam).subscribe((data: any) => {
    console.log('Vivienda => ');
    console.log(data);
    this.viviendaArray = data;
    this.viviendaArray.map(item=>{
      this.vivienda.id = item.id;
      this.vivienda.nombreVivienda = item.nombreVivienda;
      this.vivienda.pais = item.pais;
      this.vivienda.ciudad = item.ciudad;
      this.vivienda.ubicacion = item.ubicacion;
      this.vivienda.codigoPostal = item.codigoPostal;
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
      nombreVivienda: new FormControl(null, [Validators.required]),
//        emailCliente: new FormControl(null, [Validators.required]),
      pais: new FormControl(''),
      ciudad: new FormControl(''),
      ubicacion: new FormControl(''),
      codigoPostal: new FormControl(''),
    })
  });
  this.user.getHabitacionesVivienda(this.constProvider.getParametro()).subscribe((data: any) => {
    this.habitacionArray = data;
    console.log (' habitaciones=> ');
    console.log (data);
  }, (err) => { console.log('Error getHabitacionesVivienda: ' + err.message );
/*    let toast = this.toastCtrl.create({
      message: 'Error' + err.message,
      duration: 5000,
      position: 'top'
    });
    toast.present(); */
  });
  this.formularioHab = new FormGroup ({
    habitacionData: new FormGroup( {
      id: new FormControl(''),
      nombreVivienda: new FormControl(''),
      nombreHabitacion: new FormControl(null, [Validators.required, this.esProhibido.bind(this)]),
      serialNumber: new FormControl('')
    })
  })
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
    this.editVivienda = false;
    this.editHabitacion = false;
    this.creatHab = false;
    this.editHabitacion = false;
  }
/************ Metodos Vivienda ************/
  btnEditarVivienda(){
    this.editVivienda = true;
    this.creatHab = false;
  }

  @ViewChild('f') FormGroup: NgForm;
  onSubmitEditVivienda(){
    console.log('onSubmitCreat');

    this.vivienda.nombreVivienda = this.formulario.value.viviendaData.nombreVivienda;
    this.vivienda.emailCliente = this.usuario;
    this.vivienda.pais = this.formulario.value.viviendaData.pais;
    this.vivienda.ciudad = this.formulario.value.viviendaData.ciudad;
    this.vivienda.ubicacion = this.formulario.value.viviendaData.ubicacion;
    this.vivienda.codigoPostal = this.formulario.value.viviendaData.codigoPostal;

    this.user.putVivienda(this.vivienda).subscribe((resp) => {
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
  /************ Metodos Habitacion ************/

  btnAnadirHabitacion(){
    this.creatHab = true;
    this.user.getSeriales(this.usuario).subscribe((data: any) => {
      this.serialArray = data;
      console.log('seriales=>');
      console.log(data);
        this.serialArray.map(item => {
          this.serialData.push(item.serialNumber)
        });
    });
  }

  @ViewChild('g') FormGroupHab: NgForm;
  btnEditarHab(nombreHabitacion: string){
    console.log('BTN_ Editar Habitacion');
    this.editHabitacion = true;
    this.user.getSeriales(this.usuario).subscribe((data: any) => {
      this.serialArray = data;
      console.log('seriales=>');
      console.log(data);
      this.serialArray.map(item => {
        this.serialData.push(item.serialNumber)
      });
    });
    this.user.getOneHabitacionVivienda(nombreHabitacion).subscribe((data: any) => {
      this.habitacionArray = data;
      console.log('info habitacion =>');
      console.log(this.habitacionArray);
      this.habitacionArray.map(item => {
        this.habitacion.id = item.id;
        this.habitacion.nombreVivienda = item.nombreVivienda;
        this.habitacion.nombreHabitacion = item.nombreHabitacion;
        this.habitacion.serialNumber = item.serialNumber;
      });
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
  onSubmitCreatHab(){
    this.habitacion.id = this.formularioHab.value.habitacionData.id;
    this.habitacion.nombreVivienda = this.formularioHab.value.habitacionData.nombreVivienda;
    this.habitacion.nombreHabitacion = this.formularioHab.value.habitacionData.nombreHabitacion;
    if(this.habitacion.serialNumber === ''){
      this.habitacion.serialNumber = null;
    } else{
      this.habitacion.serialNumber = this.formularioHab.value.habitacionData.serialNumber;
    }

    if (this.creatHab) {
      this.user.postHabitacion(this.habitacion).subscribe((data: any) => {
        this.creatHab = false;
        this.doRefresh();
      }, (err) => {
        // Unable to log in
        let toast = this.toastCtrl.create({
          message: 'Error' + err.message,
          duration: 5000,
          position: 'top'
        });
        toast.present();
      });
    }else {
      this.user.putHabitacion(this.habitacion).subscribe(() => {
        this.doRefresh();
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
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ViviendaPage');
  }
  btnSettings(){
    this.navCtrl.push('SettingsPage');
  }
  btnInformes(){
    this.navCtrl.push('InformesPage');
  }
  btnLogout(){
    localStorage.setItem('usuario', '');
    this.navCtrl.push('LoginPage');
  }
  btnEquipos(){
    this.navCtrl.push('ContentPage');
  }
  doRefresh() {
    //   this.navCtrl.setRoot(this.navCtrl.getActive().component);
    this.editVivienda = false;
    this.editHabitacion = false;
    this.creatHab = false;
    this.navCtrl.push('ViviendaPage');
  }
  esProhibido(nombre: FormControl): {[s: string]: boolean} {
    if (this.nombresProhibidos.indexOf(nombre.value) !== -1) {
      return  {nombreEsProhibido: true};
    }
    return null;
  }

  ngOnDestroy(): void {
    this.editVivienda = false;
    this.editHabitacion = false;
  }
}
