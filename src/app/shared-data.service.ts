import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class SharedDataService {

  private detalheArraySubject = new BehaviorSubject<any[]>([]);
  detalheArray$ = this.detalheArraySubject.asObservable();

  constructor() { }

  setDetalheArray(data: any[]) {
    this.detalheArraySubject.next(data);
  }

}