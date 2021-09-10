import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Events, IonicPage, NavController, NavParams, ToastController, AlertController} from 'ionic-angular';
import {ConstantesProvider} from "../../providers/services/constantes.provider";
import {User} from "../../providers";
import {TranslateService} from "@ngx-translate/core";
import {Arduino, InfoEquipo, Onoff} from "../../providers/user/user";
import {FormControl, FormGroup, NgForm, Validators} from "@angular/forms";
import{ webSocket} from "rxjs/observable/dom/webSocket";
import { WebSocketSubject} from "rxjs/observable/dom/WebSocketSubject";
import {ip} from "../../providers/api/api"
import {Subject} from "rxjs";
import {takeUntil} from "rxjs/operators";

@IonicPage()
@Component({
  selector: 'page-equipo',
  templateUrl: 'equipo.html',
})
export class EquipoPage implements OnInit, OnDestroy {

  myWebSocket: WebSocketSubject<any> = webSocket({url: 'ws://' + ip + ':3300'});//, resultSelector: e => e.data});
//  myWebSocket: WebSocketSubject<any> = webSocket({url: 'ws://api.mysh.es:3300'});//, resultSelector: e => e.data});
  dataWS: any;
  destroyed$ = new Subject();
  private ngUnsubscribe = new Subject();

  value = this.translate.instant(["ON_OFF","MAXIMUM_HOURS",
    "ALLOWED_ON","DENIED_ON","EVERY_HOUR","CANCEL",
    "OK", "MSG_DELETED_ALARM", "UPDATED_SUCCESSFULLY"]);
  actions =[this.value.ON_OFF, this.value.ALLOWED_ON,this.value.DENIED_ON, this.value.EVERY_HOUR];

  buscaParam = '';
  editEquipo: boolean;
  formulario: FormGroup;
  formArduino: FormGroup;

  infoAlarmArray = [];
  infoEquipoArray = [];
  infoArduinoArray = [];

  infoEquipo: InfoEquipo = {
    id: 0,
    serialNumber: '',
    nombreEquipo: '',
    descripcion: '',
    emailCliente: '',
    lastConn: '',
  };
  arduino: Arduino = {
  id: 0,
  serialNumber: '',
  onoff: '',
  accion: '',
  horaInicio: '',
  horaFinal: '',
  };
  onoff: Onoff = {
    serialNumber: '',
    onoff: '',
  };


  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public constProvider: ConstantesProvider,
              public user: User,
              public toastCtrl: ToastController,
              public translate: TranslateService,
              public events: Events,
              public alertCtrl: AlertController
              ) {
    this.buscaParam = this.constProvider.getUrl();
    this.user.getEquipoUsuario(this.buscaParam).pipe(takeUntil(this.ngUnsubscribe)).subscribe((data: any) => {
      this.infoEquipoArray = data;
      console.log (' Equipo Page=> ');
      console.log (data);
      this.infoEquipoArray.map(item => {
        this.infoEquipo.id = item.id;
        this.infoEquipo.serialNumber = item.serialNumber;
        this.infoEquipo.nombreEquipo = item.nombreEquipo;
        this.infoEquipo.descripcion = item.descripcion;
        if(item.descripcion === 'mySH Box') this.buscaArduino();
        else this.buscaAlarm();
        this.infoEquipo.emailCliente = item.emailCliente;
        this.infoEquipo.lastConn = item.lastConn;
      });
    });

    this.formulario = new FormGroup({
      equipoData: new FormGroup({
        id: new FormControl(''),
        serialNumber: new FormControl(''),
        nombreEquipo: new FormControl(null, [Validators.required]),
        descripcion: new FormControl(null, [Validators.required]),
        emailCliente: new FormControl('0'),
        lastConn: new FormControl('0'),
      })
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
    else
    {
      this.editEquipo = false;
      this.myWebSocket.asObservable().pipe(takeUntil(this.destroyed$)
      ).subscribe(data =>{
        console.log(data.serial);
        console.log('up response');
          if(data.serial === this.buscaParam ) this.doRefresh();
      });
    }
  }

  buscaAlarm(): void{
    /************* ALARM *****************/
    this.user.getAlarm(this.buscaParam).pipe(takeUntil(this.ngUnsubscribe)).subscribe((data: any) => {
      this.infoAlarmArray = data;
      console.log(' Alarms=> ');
      console.log(data);
    });
  }
  buscaArduino():void{
    /* GET ARDUINO */
    this.user.getArduino(this.buscaParam).pipe(takeUntil(this.ngUnsubscribe)).subscribe((cast: any) => {
      this.infoArduinoArray = cast;
      console.log (' Equipo Page=> ');
      console.log (cast);
      this.infoArduinoArray.map(item2 => {
        this.arduino.id = item2.id;
        this.arduino.serialNumber = item2.serialNumber;
        this.arduino.onoff = item2.onoff;
        this.arduino.accion = item2.accion;
        this.arduino.horaInicio = item2.horaInicio;
        this.arduino.horaFinal = item2.horaFinal;
      });
    });
    this.formArduino = new FormGroup({
      arduinoData: new FormGroup({
        id: new FormControl(null),
        serialNumber: new FormControl(null, [Validators.required]),
        onoff: new FormControl(null),
        accion: new FormControl(null, [Validators.required]),
        horaInicio: new FormControl(null),
        horaFinal: new FormControl(null),
      })
    });
    return;
  }

  @ViewChild('f') FormGroup: NgForm;
  async onSubmitCreat(){
    console.log('onSubmitCreat');
    this.infoEquipo.serialNumber = this.formulario.value.equipoData.serialNumber;
    this.infoEquipo.nombreEquipo = this.formulario.value.equipoData.nombreEquipo;
    this.infoEquipo.descripcion = this.formulario.value.equipoData.descripcion;
    this.infoEquipo.emailCliente = localStorage.getItem('usuario');;
    this.infoEquipo.lastConn = new Date().toISOString();

    this.user.putEquipo(this.infoEquipo).pipe(takeUntil(this.ngUnsubscribe)).subscribe((resp) => {

    }, (err) => {
      // Unable to log in
      let toast = this.toastCtrl.create({
        message: 'Error' + err.message,
        duration: 5000,
        position: 'top'
      });
      toast.present();
    });
    const alert = await this.alertCtrl.create({
      message: this.value.UPDATED_SUCCESSFULLY,
      buttons: [this.value.OK]
    });
    await alert.present();
 //     this.navCtrl.push('ContentPage');
    this.doRefresh();
  }
  /* ARDUINO*/
  @ViewChild('g') FormArduino: NgForm;
  async onSubmitEquipo(){
    console.log('onSubmitEquipo');
    this.arduino.serialNumber = this.buscaParam;
 //   this.arduino.onoff = this.formArduino.value.arduinoData.onoff;
    this.arduino.accion = this.formArduino.value.arduinoData.accion;
    this.arduino.horaInicio = this.formArduino.value.arduinoData.horaInicio;
    this.arduino.horaFinal = this.formArduino.value.arduinoData.horaFinal;
//    Criar aqui gravar dados
    console.log(this.arduino);
    this.user.putArduino(this.arduino).pipe(takeUntil(this.ngUnsubscribe)).subscribe((resp) => {

    }, (err) => {
      // Unable to log in
      let toast = this.toastCtrl.create({
        message: 'Error' + err.message,
        duration: 5000,
        position: 'top'
      });
      toast.present();
    });
    const alert = await this.alertCtrl.create({
      message: this.value.UPDATED_SUCCESSFULLY,
      buttons: [this.value.OK]
    });
    await alert.present();
    this.doRefresh();
  }

  btnEditar(){
    this.editEquipo = true;
    console.log('BTN_Editar');
  }
  btnVolver(){
    this.navCtrl.push('ContentPage');
  }

  doRefresh() {
    this.navCtrl.setRoot(this.navCtrl.getActive().component);
  }
  // LIGAR EQUIPO
  async onSubmitON(serial: string) {
    this.onoff.serialNumber = serial;
    this.onoff.onoff = '0';
    const msdn = '{"serial":"' + serial +'"}';
 //   this.ws.socket$.next(msdn);
    this.myWebSocket.next(msdn);
    this.user.onoff(this.onoff).pipe(takeUntil(this.ngUnsubscribe)).subscribe((data: any) => {

    }, (err) => {
      // Unable to log in
      let toast = this.toastCtrl.create({
        message: 'Error' + err.message,
        duration: 5000,
        position: 'top'
      });
      toast.present();
    });
//    this.myWebSocket.next(msdn);
    const alert = await this.alertCtrl.create({
      message: this.value.UPDATED_SUCCESSFULLY,
      buttons: [this.value.OK]
    });
    await alert.present();
    this.editEquipo = false;
    this.doRefresh();
  }
  async onSubmitOFF(serial: string) {
    this.onoff.serialNumber = serial;
    this.onoff.onoff = '1';
    const msdn = '{"serial":"' + serial +'"}';
//    this.ws.socket$.next(msdn);
    this.myWebSocket.next(msdn);
    this.user.onoff(this.onoff).pipe(takeUntil(this.ngUnsubscribe)).subscribe((data: any) => {
      let show = data;
      console.log('show=> ');
      console.log(show);

    }, (err) => {
      let toast = this.toastCtrl.create({
        message: 'Error' + err.message,
        duration: 3500,
        position: 'top'
      });
      toast.present();
    });
//    this.myWebSocket.next(msdn);
    const alert = await this.alertCtrl.create({
      message: this.value.UPDATED_SUCCESSFULLY,
      buttons: [this.value.OK]
    });
    await alert.present();
    this.editEquipo = false;
    this.doRefresh();
  }
 async btnBorrarAlarm(){
    this.user.delAlarm(this.buscaParam).pipe(takeUntil(this.ngUnsubscribe)).subscribe((resp) => {

    }, (err) => {
      let toast = this.toastCtrl.create({
        message: 'Error' + err.message,
        duration: 5000,
        position: 'top'
      });
      toast.present();
    });
    const alert = await this.alertCtrl.create({
      message: this.value.MSG_DELETED_ALARM,
      buttons: [this.value.OK]
    });
    await alert.present();
    this.doRefresh();
  }
  btnInformes(){
    this.navCtrl.push('InformesPage');
  }
  btnViviendas(){
    this.navCtrl.push('ViviendasPage');
  }
  btnSettings(){
    this.navCtrl.push('SettingsPage');
  }
  ngOnDestroy() {
    this.destroyed$.next();
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
