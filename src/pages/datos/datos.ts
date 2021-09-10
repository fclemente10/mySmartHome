import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {IonicPage, NavController, NavParams, ToastController} from 'ionic-angular';
import {InfoEquipo, User} from "../../providers/user/user";
import {ConstantesProvider} from "../../providers/services/constantes.provider";
import {Chart} from 'chart.js';

@IonicPage()
@Component({
  selector: 'page-datos',
  templateUrl: 'datos.html',
})
export class DatosPage implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('doughnutCanvas') private doughnutCanvas: ElementRef;
  @ViewChild('lineCanvas') private lineCanvas: ElementRef;
  doughnutChart: any;
  lineChart: any;
  /************************************ *******************/

  /************************************ *******************/

  infoEquipo: InfoEquipo = {
    id: 0,
    serialNumber: '',
    nombreEquipo: '',
    descripcion: '',
    emailCliente: '',
    lastConn: '',
  };
  public infoEquipoArray = [];
  public onoffArray = [];
  public graficoArray = [];
  public myArray=[];
  status: boolean;
  consumoMedio = '';
  labels = [];
  values = [];

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public constProvider: ConstantesProvider,
              public user: User,
              public toastCtrl: ToastController,) {
  }
  ngOnInit() {
    if (!this.user.isLoggedIn()) {
      let toast = this.toastCtrl.create({
        message: 'Es necesario una session ',
        duration: 4000,
        position: 'top'
      });
      toast.present();
      this.navCtrl.push('LoginPage');
    } else{
      this.user.getEquipoUsuario(this.constProvider.getUrl())
        .subscribe((data: any) => {
          this.infoEquipoArray = data;
          console.log(' Datos Page=> ');
          console.log(data);
          this.infoEquipoArray.map(item => {
            this.infoEquipo.id = item.id;
            this.infoEquipo.serialNumber = item.serialNumber;
            this.infoEquipo.nombreEquipo = item.nombreEquipo;
            this.infoEquipo.descripcion = item.descripcion;
            this.infoEquipo.emailCliente = item.emailCliente;
            this.infoEquipo.lastConn = item.lastConn;
          });
        });
      this.user.getStatus(this.constProvider.getUrl())
        .subscribe((data: any) => {
          this.onoffArray = data;
          this.onoffArray.map(item => {
            this.status = item.onoff !== '0';
          });
        });
    }

  }
  ngAfterViewInit() {
    this.user.getPotencia(this.constProvider.getUrl())
      .subscribe((result: any) => {
        this.onoffArray = result;
        this.onoffArray.map(item=> {
          localStorage.setItem('pot', item.potencia);
          this.consumoMedio = item.potencia;
          //       this.toPush.push(item.potencia);
          this.doughnutChartMethod();
        });
      });
    this.user.getGrafico(this.constProvider.getUrl())
      .subscribe((result: any) => {
        this.graficoArray = result;
        console.log('this.grafico=>')
        console.log(this.graficoArray)
        this.graficoArray.map(item=> {
          this.labels.push(item.dataTime);
          this.values.push(item.on);
        });
        console.log('on= ' +this.values );
        console.log(this.values );
        console.log('labels= ' +this.labels );
        console.log(this.labels );
        this.lineChartMethod();
      });

  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad DatosPage');
  }

  doughnutChartMethod() {
    console.log('Status=' + this.status);
    if(this.doughnutChart) this.doughnutChart.destroy();
      console.log('Equipo APAGADO');
      this.doughnutChart = new Chart(this.doughnutCanvas.nativeElement, {
        type: 'doughnut',
        data: {
          labels: ['OFF', 'Consumo Medio'],
          datasets: [{
            label: 'Equipo OFF',
            data: [2000,Number(localStorage.getItem('pot'))],
            backgroundColor: [
              'rgba(255,93,64,0.2)',
              'rgba(51,198,198,0.2)'
            ],
            hoverBackgroundColor: [
              'rgba(227,243,14,0.62)',
              'rgba(198,51,161,0.45)'
            ]
          }]
        }
      });
  }
  lineChartMethod() {
    this.lineChart = new Chart(this.lineCanvas.nativeElement, {
      type: 'line',
      data: {
        labels: this.labels,
        datasets: [
          {
            label: 'ON',
            fill: false,
            lineTension: 0.1,
            backgroundColor: 'rgba(75,192,192,0.4)',
            borderColor: 'rgba(75,192,192,1)',
            borderCapStyle: 'butt',
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: 'miter',
            pointBorderColor: 'rgba(75,192,192,1)',
            pointBackgroundColor: '#fff',
            pointBorderWidth: 1,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: 'rgba(75,192,192,1)',
            pointHoverBorderColor: 'rgba(220,220,220,1)',
            pointHoverBorderWidth: 2,
            pointRadius: 1,
            pointHitRadius: 10,
            data: this.values,
            spanGaps: false,
          }
        ]
      }
    });
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

  ngOnDestroy(){
    this.doughnutChart.destroy();
  }


}
