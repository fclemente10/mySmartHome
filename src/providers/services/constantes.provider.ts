import { Injectable } from '@angular/core';


@Injectable()
export class ConstantesProvider {
  private url: string;
  private link: string;

  private pass: string;
  private parametro: string;

  constructor() {
    this.url = '';
    this.link = '';
    this.pass='';
    this.parametro='';

  }

  setLink(url: string) {
    this.link = url;
  }

  setParametro(pass: string){
    this.parametro = pass;
  }

  getUrl() {
    return this.link.concat(this.url);
  }

  getParametro() {
    return this.parametro.concat(this.pass)
  }
}
