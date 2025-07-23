import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class UserService {

  private userIdSubject = new BehaviorSubject<number | null>(null);
  public userId$ = this.userIdSubject.asObservable();

  private codEmpresaSubject = new BehaviorSubject<number>(0);
  public codEmpresa$ = this.codEmpresaSubject.asObservable();

  constructor() {}

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