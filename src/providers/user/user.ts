import 'rxjs/add/operator/toPromise';
import { Injectable } from '@angular/core';
import { Api } from '../api/api';
import {ConstantesProvider} from "../services/constantes.provider";
import {map} from "rxjs/operators";
import {Observable} from "rxjs";

export interface Usuario {
  exp: number;
  id: number;
  email: string;
  contrasena: string;
  nombre: string;
  apellido: string;
  tipo: 'Usuario';
}
export interface TokenPayload {
  email: string;
  contrasena: string;
}
export interface InfoEquipo {
  id: number;
  serialNumber: string ;
  nombreEquipo: string;
  descripcion: string;
  emailCliente: string;
  lastConn: string;
}
export interface Arduino {
  id: number;
  serialNumber: string;
  onoff: string;
  accion: string;
  horaInicio: string;
  horaFinal: string;
}
export interface Datos {
  id: number;
  serialNumber: string;
  dataTime: string[];
  tension: number[];
  corriente: number[];
  on: string[];
  off: string[];
}
export interface Onoff {
  serialNumber: string;
  onoff: string;
}
export interface Math{
  serialNumber: string;
  tipo: string;
}
export interface Onuoff {
  onoff: string;
}
export interface Vivienda {
  id: number;
  nombreVivienda: string;
  emailCliente: string;
  pais: string;
  ciudad: string;
  ubicacion: string;
  codigoPostal: string;
}
export interface Habitacion {
  id: number;
  nombreVivienda: string;
  nombreHabitacion: string;
  serialNumber: string;
}
export interface Alarm{
  id: number;
  dataTime: string;
  emailCliente: string;
  serialNumber: string;
}

@Injectable()
export class User {
  _user: any;
  private token: string;

  constructor(public api: Api,
              public cp: ConstantesProvider) { }

  /***  LOGIN   ***/
  public login(accountInfo: any) {
    console.log('Fazendo login' );
    let seq = this.api.post('login', accountInfo).share();
    seq.subscribe((res: any) => {
      console.log('token=> ')
      console.log(res)
      if (res) {
        this.saveToken(res);
        this._loggedIn(res);
      } else {
      }
    }, err => {
      console.error('ERROR', err.message);
    });
    console.log(' Seq => ')
    console.log(seq);
    localStorage.setItem('usuario', accountInfo.email);
    return seq;
  }
  private saveToken(token: string): void {
    localStorage.setItem('userToken', token);
    this.token = token;
  }

  public profile(email: string): Observable<any> {
    console.log('call profile');
     return this.api.get('login/' + email, {
 //     headers: { Authorization: ` ${this.getToken()}`},
    });
  }

  /*** REGISTRO USUARIO  ***/
  public signup(accountInfo: any) {
    let seq = this.api.post('usuario', accountInfo).share();
    seq.subscribe((res: any) => {
      if (res.status == 'success') {
        this._loggedIn(res);
      }
    }, err => {
      console.error('ERROR', err.message);
    });

    return seq;
  }
  /****buscar usuario ****/
  public getOneUser(email: string) {
  let seq = this.api.get('usuario/'+email).share();
    return seq;
  }
  public putUsuario(usuario: Usuario): Observable<any> {
    return this.api.put(`usuario`, usuario);
  }
  /* #######################  METODODS EQUIPOS ######################## */

  /************************Buscar equipos de un usuario************************/
  public getEquiposUsuario(emailCliente: string){
    return this.api.get('infoequipos/'+emailCliente).share();
  }
  /************************Buscar equipos de un usuario************************/
  public getEquipoUsuario(serialNumber: string){
    return this.api.get('infoequipo/'+serialNumber).share();
  }
  /************************Actualizar Equipo************************/
  public putEquipo(infoEquipo: InfoEquipo) {
    return this.api.put(`infoequipo`, infoEquipo);
  }

  /* #######################  METODODS ARDUINO ######################## */
  public getArduino(serial: string) {
    return this.api.get(`equipo/`+serial).share();
  }
  public putArduino(arduino: Arduino) {
    return this.api.put(`equipo`, arduino);
  }

  /************************Comando ON OFF************************/
  public onoff(enchufadoQuitado: Onoff) {
    return this.api.put(`onoff`, enchufadoQuitado);
  }

  /************************Busca de datos para informes************************/
  public getInformes(emailCliente: string){
    return this.api.get('informes/'+emailCliente).share();
  }
  /* #######################  METODODS Alarm ######################## */
  public getAlarm(serial: string) {
    return this.api.get(`alarm/`+serial).share();
  }
  public delAlarm(serial: string) {
    return this.api.delete(`alarm/`+serial).share();
  }

  /* #######################  METODODS Matematicos ######################## */
  public getMedias(math: Math){
     const result = this.api.post(`math`, math).share()
    return (result as any);
  }
  public getDatos(serialNumber: string){
    console.log('Busca datos con serial ='+serialNumber);
    return this.api.get('datos/'+serialNumber).share();
  }
 /* $getStatus(serialNumber: string): Observable<any>{
    return this.api.get('potencia/'+serialNumber).share();
  } */
  public getStatus(serialNumber: string){
    return this.api.get('onuoff/'+serialNumber);
  }
  public getPotencia(serialNumber: string){
    return this.api.get('potencia/'+serialNumber).share();
  }
  public getGrafico(serialNumber: string){
    return this.api.get('grafico/'+serialNumber).share();
  }
  /* #######################  METODODS Viviendas ######################## */
  public getViviendasCliente(emailCliente: string): Observable<any> {
    return this.api.get(`viviendas/` + emailCliente).share();
  }
  public postVivienda(vivienda: Vivienda): Observable<any> {
    return this.api.post(`vivienda`, vivienda);
  }
  public getOneVivienda(id: string): Observable<any> {
    return this.api.get(`vivienda/` + id);
  }
  public putVivienda(vivienda: Vivienda): Observable<any> {
    return this.api.put(`vivienda`, vivienda);
  }
  public delVivienda(nombreVivienda: string ): Observable<any>  {
    return this.api.delete(`vivienda/` + nombreVivienda);
  }

  /* #######################  METODODS Habitaciones ######################## */
  public getHabitacionesVivienda(nombreVivienda: string): Observable<any> {
    return this.api.get(`habVivienda/` + nombreVivienda);
  }
  public getOneHabitacionVivienda(nombreHabitacion: string): Observable<any> {
    return this.api.get(`habitacion/` + nombreHabitacion);
  }
  /************************Actualizar Vivienda ************************/
  public putHabitacion(habitacion: Habitacion): Observable<any> {
    return this.api.put(`habitacion/`, habitacion);
  }
  /************************ Añade una vivienda ************************/
  public postHabitacion(habitacion: Habitacion): Observable<any> {
    return this.api.post(`habitacion`, habitacion);
  }

  public getSeriales(emailCliente: string): Observable<any> {
    return this.api.get(`equiposinhab/` + emailCliente);
  }

  logout() {
    this._user = null;
    localStorage.setItem('userToken', '');
  }

  public isLoggedIn(): boolean {
    const user = this.getUserDetails();
    if (user) {
      return user.exp > Date.now() / 1000;
    } else {
      return false;
    }
  }
  public getUserDetails(): Usuario {
    const token = this.getToken();
    let payload;
    if (token) {
      payload = token.split('.')[1];
      payload = window.atob(payload);
      //   console.log('Payload= ' + payload)
      return JSON.parse(payload);
    } else {
      return null;
    }
  }
  private getToken(): string {
    if (this.token) {
      this.token = localStorage.getItem('userToken');
    }
    return this.token;
  }

  /**
   * Process a login/signup response to store user data
   */
  _loggedIn(resp) {
    this._user = resp.user;
  }

}
