import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { IonicPage, NavController, ToastController } from 'ionic-angular';
import { User } from '../../providers';

import { MainPage } from '../';
import {FormControl, FormGroup, Validators} from "@angular/forms";

@IonicPage()
@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html'
})
export class SignupPage {
  // The account fields for the login form.
  // If you're using the username field with or without email, make
  // sure to add it to the type
  formulario : FormGroup;
  checkContrasena = '';
  nombresProhibidos = ['Test', 'test', 'TEST', 'Prueba', 'prueba', 'PRUEBA'];

  usuario:{ id: number,
            nombre: string,
            apellido: string,
            email: string,
            contrasena: string,
            tipo: string, } = {
    id: 0,
    nombre: 'Test',
    apellido: 'Human',
    email: 'test@example.com',
    contrasena: 'test',
    tipo: 'Usuario'
  };

  // Our translated text strings
  private signupErrorString: string;

  constructor(public navCtrl: NavController,
              public user: User,
              public toastCtrl: ToastController,
              public translateService: TranslateService,
              ) {

    this.formulario =  new FormGroup({
      userData: new FormGroup({
        // id: new FormControl(null, [Validators.required]),
        'email': new FormControl(null, [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]),
        'nombre':  new FormControl(null, [Validators.required, this.esProhibido.bind(this)]),
        'apellido':  new FormControl(null, [Validators.required, this.esProhibido.bind(this)]),
        'contrasena': new FormControl(null, [Validators.required, Validators.minLength(6)]),
        'checkContrasena': new FormControl(null, [Validators.required, Validators.minLength(6)]),
        'tipo': new FormControl(null, null),
        'cb': new FormControl(false, [Validators.required, Validators.requiredTrue]),
      })
    });

/*
    this.translateService.get('SIGNUP_ERROR').subscribe((value) => {
      this.signupErrorString = value;
    });

 */
  }

  esProhibido(nombre: FormControl): {[s: string]: boolean} {
    if (this.nombresProhibidos.indexOf(nombre.value) !== -1) {
      return  {nombreEsProhibido: true};
    }
    return null;
  }
  doSignup() {
    this.usuario.contrasena = this.formulario.value.userData.contrasena;
    this.checkContrasena = this.formulario.value.userData.checkContrasena;
    if (this.usuario.contrasena === this.checkContrasena) {
      //  this.usuario.id = null;
      this.usuario.nombre = this.formulario.value.userData.nombre;
      this.usuario.apellido = this.formulario.value.userData.apellido;
      this.usuario.contrasena = this.formulario.value.userData.contrasena;
      this.usuario.email = this.formulario.value.userData.email;
      this.formulario.value.userData.tipo = 'Usuario';
      this.usuario.tipo = this.formulario.value.userData.tipo;

      this.user.signup(this.usuario).subscribe((resp) => {
        let toast = this.toastCtrl.create({
          message: 'Bienvenido - Welcome ',
          duration: 3000,
          position: 'top'
        });
        toast.present();

        this.navCtrl.push('LoginPage');
      }, (err) => {
        // Unable to sign up
        let toast = this.toastCtrl.create({
          message: 'Error= ' + err.message,
          duration: 3000,
          position: 'top'
        });
        toast.present();
      });
    } else {
      let toast = this.toastCtrl.create({
        message: 'Error, contraseñas no son iguales ',
        duration: 3000,
        position: 'top'
      });
      toast.present();
    }

      /*
            this.subscription = this.auth.register(this.usuario).subscribe((data: any) => {
              Swal.fire('Usted a sido registrado con éxito!');
      //        this.reload(); enviar usuario para pagina de bienvenido
              this.router.navigateByUrl('/profile');
            }, (err: any) => {
              console.log('err=>');
              console.log(err.error);
              Swal.fire('Error',
                'Usuario ya registrado',
      //            '' + err.error,
                'error');
            });
          } else {
            Swal.fire('Las contrasenas NO son iguales');
          }

          // Attempt to login in through our User service
          this.user.signup(this.account).subscribe((resp) => {
            this.navCtrl.push(MainPage);
          }, (err) => {

            this.navCtrl.push(MainPage);

            // Unable to sign up
            let toast = this.toastCtrl.create({
              message: this.signupErrorString,
              duration: 3000,
              position: 'top'
            });
            toast.present();
          });

           */
  }
}
