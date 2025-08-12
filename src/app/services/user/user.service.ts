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

  constructor(
  ) {}

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

  setUserData(userData: any) {
    localStorage.setItem('rememberedPhone', userData.tel);
    localStorage.setItem('rememberedPassword', userData.password);
    localStorage.setItem('rememberPasswordChecked', 'true');
  }

  getLoginData() {
    const rememberedPhone = localStorage.getItem('rememberedPhone') || '';
    const rememberedPassword = localStorage.getItem('rememberedPassword') || '';
    const rememberPasswordChecked = localStorage.getItem('rememberPasswordChecked') === 'true';
    return [rememberedPhone, rememberedPassword, rememberPasswordChecked];
  }

  setProfileData(userData: string) {
    localStorage.setItem('rememberedName', userData);
  }

  getProfileData() {
    const rememberedName = localStorage.getItem('rememberedName') || '';
    return rememberedName;
  }

  clearUserData() {
    localStorage.removeItem('rememberedPhone');
    localStorage.removeItem('rememberedPassword');
    localStorage.removeItem('rememberedName');
    localStorage.setItem('rememberPasswordChecked', 'false');
  }
}