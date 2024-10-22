import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MessageserviceService {

  constructor() { }
  alumnos:string[]=[];
  add(alumnos:string){
    this.alumnos.push(alumnos);
  }
}
