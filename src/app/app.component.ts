import { Component, ViewChild } from '@angular/core';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { TranslateService } from '@ngx-translate/core';
import {Config, Events, Nav, Platform} from 'ionic-angular';
import { Storage} from "@ionic/storage";
import { FirstRunPage } from '../pages';
import {Settings, User} from '../providers';
import {InformesPage} from "../pages/informes/informes";

import{imin} from "../pages/content/content";
import {WebSocketSubject} from "rxjs/observable/dom/WebSocketSubject";
import {webSocket} from "rxjs/observable/dom/webSocket";
import {ip} from "../providers/api/api";
import {Subject} from "rxjs";
import {takeUntil} from "rxjs/operators";
import {LocalNotifications} from "@ionic-native/local-notifications/ngx";

@Component({
  template: `<ion-menu [content]="content" type="overlay">
    <ion-header>
      <ion-toolbar>
        <ion-card-title color="light">{{ 'PAGES' | translate }}</ion-card-title>
        <ion-buttons right>
            <img side="right" end src="/assets/img/logo_01.png" width="40px" height="55px"/>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <!--ion-content>
      <ion-list>
        <button menuClose ion-item *ngFor="let p of pages" (click)="openPage(p)">
          {{p.title}}
        </button>
      </ion-list>
    </ion-content-->
    <ion-content>
      <ion-list *ngIf="!usuario">
        <button menuClose ion-item (click)="openPage({component: 'LoginPage'})">{{ 'LOGIN_BUTTON' | translate }}</button>
        <button menuClose ion-item (click)="openPage({component: 'TutorialPage'})">{{ 'TUTORIAL' | translate }} </button>
        <button menuClose ion-item (click)="openPage({component: 'SettingsPage'})">{{ 'SETTINGS_TITLE' | translate }} </button>
      </ion-list>
      <ion-list *ngIf="usuario">
        <button menuClose ion-item (click)="openPage({component: 'ContentPage'})">{{ 'MAIN_PAGE' | translate }} </button>
        <button menuClose ion-item (click)="openPage({component: 'SettingsPage'})">{{ 'SETTINGS_TITLE' | translate }} </button>
        <button menuClose ion-item (click)="openPage({component: 'EquipoPage'})">{{ 'DEVICES_TITLE' | translate }} </button>
        <button menuClose ion-item (click)="openPage({component: 'InformesPage'})">{{ 'REPORTS' | translate }} </button>
        <button menuClose ion-item (click)="openPage({component: 'ViviendasPage'})">{{ 'DWELLING' | translate }} </button>
        <button menuClose ion-item (click)="openPage({component: 'SalirPage'})">{{ 'EXIT' | translate }} </button>
      </ion-list>
    </ion-content>

  </ion-menu>
  <ion-nav #content [root]="rootPage"></ion-nav>`
})

export class MyApp {
  rootPage = FirstRunPage;
  myWebSocket: WebSocketSubject<any> = webSocket({url: 'ws://' + ip + ':3300'});//, resultSelector: e => e.data});
//  myWebSocket: WebSocketSubject<any> = webSocket({url: 'ws://api.mysh.es:3300'});//, resultSelector: e => e.data});
  dataWS: any;
  destroyed$ = new Subject();
  equipoArray = [];


  @ViewChild(Nav) nav: Nav;

  pages: any[] = [
    { title: 'Tutorial', component: 'TutorialPage' },
    { title: 'Welcome', component: 'WelcomePage' },
    { title: 'Principal', component: 'ContentPage' },
    { title: 'Configuracion', component: 'SettingsPage' },
    { title: 'Equipo', component: 'EquipoPage' },
    { title: 'Informes', component: 'InformesPage' },
    { title: 'Viviendas', component: 'ViviendasPage' },
    { title: 'Salir', component: 'SalirPage' }
  ]
  usuario = '';

  constructor(private translate: TranslateService,
              platform: Platform,
              private settings: Settings,
              private config: Config,
              private statusBar: StatusBar,
              public user: User,
              private splashScreen: SplashScreen,
              public events: Events,
              public localNotifications: LocalNotifications,
              ) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
    this.events.subscribe('user:created', (user) => {
      this.usuario = user;
    });
    this.initTranslate();
    this.myWebSocket.asObservable().pipe(takeUntil(this.destroyed$)
    ).subscribe(data =>{
      console.log(data.serial);
      console.log('up response');
      this.localNotifications.schedule({
        title: 'Usted tiene una nueva notificacion',
        text: 'Verifique las alarmas',
      });
 /*     this.user.getEquiposUsuario(this.usuario).subscribe((info:any) =>{
        this.equipoArray = info;
        this.equipoArray.map( item =>{
          if(data.serial === item.serialNumber){
            this.localNotifications.schedule({
              title: 'Usted tiene una nueva notificacion',
              text: 'Verifique las alarmas',
            });
          }
        });
      }); */
    });
  }

  initTranslate() {

    console.log('Verificando memoria lingua em APP = '+ localStorage.getItem('lang'));
    if (localStorage.getItem('lang') === null) this.translate.setDefaultLang('es');
    else this.translate.setDefaultLang(localStorage.getItem('lang'));

  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }
}
