import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, map, Observable, of } from 'rxjs';
import { HttpService } from '../http/http.service';

@Injectable({
  providedIn: 'root'
})

export class UserService {

  private userIdSubject = new BehaviorSubject<number | null>(null);
  public userId$ = this.userIdSubject.asObservable();

  private codEmpresaSubject = new BehaviorSubject<number>(0);
  public codEmpresa$ = this.codEmpresaSubject.asObservable();

  public totalCashback$!: Observable<number>;
  public detalheArray$!: Observable<any[]>;

  constructor(
    private httpService: HttpService,
  ) {}

  loadBalance() {
    this.detalheArray$ = this.httpService.getPeopleBalance(this.getUserId()!)
          .pipe(
            map(response => response?.detalhe ?? []),
            catchError(error => {
              console.log(error);
              return of([]);
            })
          );

    this.totalCashback$ = this.detalheArray$.pipe(
      map(array => array.reduce((total, establishment) => total + (establishment.saldocashback || 0), 0))
    );
  }

  setUserId(userId: number): void {
    this.userIdSubject.next(userId);
    localStorage.setItem('userId', userId.toString());
  }

  setCodEmpresa(codEmpresa: number) {
    this.codEmpresaSubject.next(codEmpresa);
  }

  getUserId(): number | null {
    const currentUserId = this.userIdSubject.value;
    if (currentUserId !== null) {
      return currentUserId;
    }
    const storedUserId = localStorage.getItem('userId');
    return storedUserId ? parseInt(storedUserId, 10) : null;
  }

  getCodEmpresa(): number {
    return this.codEmpresaSubject.value;
  }

  clearUserId(): void {
    this.userIdSubject.next(null);
    localStorage.removeItem('userId');
  }

  clearCodEmpresa(): void {
    this.codEmpresaSubject.next(0);
  }
}