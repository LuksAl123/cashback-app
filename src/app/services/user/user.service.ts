import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class UserService {

  private userIdSubject = new BehaviorSubject<number | null>(null);
  public userId$ = this.userIdSubject.asObservable(); //not being used

  private codEmpresaSubject = new BehaviorSubject<number | null>(null);
  public codEmpresa$ = this.codEmpresaSubject.asObservable(); //not being used

  constructor() {}

  setUserId(userId: number): void {
    this.userIdSubject.next(userId);
    localStorage.setItem('userId', userId.toString());
  }

  setCodEmpresa(codEmpresa: number): void {
    this.codEmpresaSubject.next(codEmpresa);
    localStorage.setItem('codEmpresa', codEmpresa.toString());
  }

  getUserId(): number | null {
    const currentUserId = this.userIdSubject.value;
    if (currentUserId !== null) {
      return currentUserId;
    }
    const storedUserId = localStorage.getItem('userId');
    return storedUserId ? parseInt(storedUserId, 10) : null;
  }

  getCodEmpresa(): number | null {
    const currentCodEmpresa = this.codEmpresaSubject.value;
    if (currentCodEmpresa !== null) {
      return currentCodEmpresa;
    }
    const storedCodEmpresa = localStorage.getItem('codEmpresa');
    return storedCodEmpresa ? parseInt(storedCodEmpresa, 10) : null;
  }

  clearUserId(): void {
    this.userIdSubject.next(null);
    localStorage.removeItem('userId');
  }

  clearCodEmpresa(): void {
    this.codEmpresaSubject.next(null);
    localStorage.removeItem('codEmpresa');
  }
}
