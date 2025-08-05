import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, map, of } from 'rxjs';
import { HttpService } from './services/http/http.service';
import { UserService } from './services/user/user.service';

@Injectable({
  providedIn: 'root'
})

export class SharedDataService {

  private detalheArraySubject = new BehaviorSubject<any[]>([]);
  detalheArray$ = this.detalheArraySubject.asObservable();

  private totalCashbackSubject = new BehaviorSubject<number>(0);
  totalCashback$ = this.totalCashbackSubject.asObservable();

  constructor(
    private httpService: HttpService,
    private userService: UserService
  ) { }

  setDetalheArray(data: any[]) {
    this.detalheArraySubject.next(data);
  }

  loadBalance() {
    this.detalheArray$ = this.httpService.getPeopleBalance(this.userService.getUserId()!)
          .pipe(
            map(response => response?.detalhe ?? []),
            catchError(error => {
              console.log(error);
              return of([]);
            })
          );

    this.loadtotalCashback();
  }

  loadtotalCashback() {
    this.totalCashback$ = this.detalheArray$.pipe(
      map(array => array.reduce((total, establishment) => total + (establishment.saldocashback || 0), 0))
    );
  }
}