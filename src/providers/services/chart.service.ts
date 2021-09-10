import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {ip} from "../api/api";

@Injectable()
export class ChartService {
  get(serialNumber: string): Observable<any>{
    return this.http.get('http://'+ ip +':3000/api/v1/grafico/'+serialNumber);
  }
  constructor(private http: HttpClient) { }
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      console.log(`${operation} failed: ${error.message}`);
      return (result as any);
    };
  }
}
