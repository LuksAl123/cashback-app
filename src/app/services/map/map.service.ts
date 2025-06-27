import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class MapService {

  private centerMapSubject = new Subject <{cep: string, lat?: number, lng?: number}>();

  public centerMap$ = this.centerMapSubject.asObservable();
  
  constructor() { }

  centerOnEstablishment(params: {cep: string, lat?: number, lng?: number}) {
    this.centerMapSubject.next(params);
  }
}
