import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import {Events, IonicPage, NavController, NavParams, ToastController} from 'ionic-angular';

import {Settings, User} from '../../providers';
import {Usuario} from "../../providers/user/user";
import {Subject, Subscription} from "rxjs";
import {takeUntil} from "rxjs/operators";


@IonicPage()
@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html'
})
export class SettingsPage implements OnInit, OnDestroy {

  private ngUnsubscribe = new Subject();
  options: any;
  settingsReady = false;

  form: FormGroup;
  formulario: FormGroup;
  nombresProhibidos = ['Test', 'test', 'TEST', 'Prueba', 'prueba', 'PRUEBA'];
  usuario: Usuario = {
  exp: null,
  id: null,
  email: '',
  contrasena: '',
  nombre: '',
  apellido: '',
  tipo: 'Usuario',
}
  profileSettings = {
    page: 'profile',
    pageTitleKey: 'SETTINGS_PAGE_PROFILE'
  };

  page: string = 'main';
  pageTitleKey: string = 'SETTINGS_TITLE';
  pageTitle: string;
  email: string;
  ctrlLogin: boolean;
  subSettings: any = SettingsPage;
  arrayUser = [];
  checkContrasena: string;

  constructor(public navCtrl: NavController,
              public settings: Settings,
              public formBuilder: FormBuilder,
              public navParams: NavParams,
              public toastCtrl: ToastController,
              public translate: TranslateService,
              public user: User,
              public events: Events) {
    this.email = localStorage.getItem('usuario');
    console.log('email Usuario =>' + this.email);
    if (this.email){
      this.formulario =  new FormGroup({
        userData: new FormGroup({
          // id: new FormControl(null, [Validators.required]),
          email: new FormControl(''),
          nombre:  new FormControl(null, [Validators.required, this.esProhibido.bind(this)]),
          apellido:  new FormControl(null, [Validators.required, this.esProhibido.bind(this)]),
          contrasena: new FormControl(null, [Validators.required, Validators.minLength(6)]),
          checkContrasena: new FormControl(null, [Validators.required, Validators.minLength(6)]),
          tipo: new FormControl(''),
        })
      });

      this.user.profile(this.email).pipe(takeUntil(this.ngUnsubscribe)).subscribe((data: any) => {
      this.arrayUser = data;
        console.log('info user =>');
        console.log(this.arrayUser);
          this.arrayUser.map(item => {
          this.usuario.tipo = item.tipo;
          this.usuario.nombre = item.nombre;
          this.usuario.apellido = item.apellido;
          this.usuario.contrasena = item.contrasena;
          this.checkContrasena = item.contrasena;
          this.usuario.email = item.email;
          this.usuario.id = item.id;
        });
      });
    }
  }

  ngOnInit() {
    console.log('Verificando memoria lingua= '+ localStorage.getItem('lang'));
  }

  _buildForm() {
    let group: any = {
      tutorial: [this.options.tutorial],
      language: [this.options.language],
    };
/*
    switch (this.page) {
      case 'main':
        break;
      case 'profile':
        group = {
          nombre: [this.options.nombre],

        };
        break;
    } */
    this.form = this.formBuilder.group(group);
    console.log('formbuild=');
    console.log(this.form)

    // Watch the form for changes, and
    this.form.valueChanges.subscribe((v) => {
      this.settings.merge(this.form.value);
    });
  }

  ionViewDidLoad() {
    // Build an empty form for the template to render
    this.form = this.formBuilder.group({});
  }

  ionViewWillEnter() {
    // Build an empty form for the template to render
    this.form = this.formBuilder.group({});

    this.page = this.navParams.get('page') || this.page;
    this.pageTitleKey = this.navParams.get('pageTitleKey') || this.pageTitleKey;

    this.translate.get(this.pageTitleKey).subscribe((res) => {
      this.pageTitle = res;
    })

    this.settings.load().then(() => {
      this.settingsReady = true;
      this.options = this.settings.allSettings;
      this._buildForm();
    });
  }

  onSubmitCreat(){
    this.usuario.contrasena = this.formulario.value.userData.contrasena;
    this.checkContrasena = this.formulario.value.userData.checkContrasena;
    if (this.usuario.contrasena === this.checkContrasena ){
      //  this.usuario.id = null;
      this.usuario.nombre = this.formulario.value.userData.nombre;
      this.usuario.apellido = this.formulario.value.userData.apellido;
      this.usuario.contrasena = this.formulario.value.userData.contrasena;
      this.usuario.email = this.formulario.value.userData.email;
 //     this.usuario.tipo = this.formulario.value.userData.tipo;

        this.user.putUsuario(this.usuario).pipe(takeUntil(this.ngUnsubscribe)).subscribe(() => {
          this.btnReload();
        }, (err) => {
          // Unable to log in
          let toast = this.toastCtrl.create({
            message: 'Error' + err.message,
            duration: 5000,
            position: 'top'
          });
          toast.present();
        });
    } else{
      const values = this.translate.instant(['PASSWORD_NOT_MATCH'])
      let toast = this.toastCtrl.create({
        message: values.PASSWORD_NOT_MATCH ,
        duration: 5000,
        position: 'top'
      });
      toast.present();
    }
  }
  btnCancel(){
    this.navCtrl.push('SettingsPage');
  }

  btnReload(){
    localStorage.setItem('usuario', '');
    localStorage.setItem('lang', this.options.language);
    console.log('guarda na memoria lingua= ' + this.options.language);
    window.location.reload();
//    this.navCtrl.push('TutorialPage');
  }
    btnExit(){
      localStorage.setItem('usuario', '');
      window.location.reload();
      this.navCtrl.push('TutorialPage');
    }

  esProhibido(nombre: FormControl): {[s: string]: boolean} {
    if (this.nombresProhibidos.indexOf(nombre.value) !== -1) {
      return  {nombreEsProhibido: true};
    }
    return null;
  }

  ngOnChanges() {
    console.log('Ng All Changes');
  }
  public ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
