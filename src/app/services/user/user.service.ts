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

  setPassword(password: string) {
    localStorage.setItem('rememberedPassword', password);
    localStorage.setItem('rememberPasswordChecked', 'true');
  }

  getPassword() {
    const rememberedPassword = localStorage.getItem('rememberedPassword') || '';
    return rememberedPassword;
  }

  setPhone(phone: string) {
    localStorage.setItem('rememberedPhone', phone);
  }

  getPhone() {
    const rememberedPhone = localStorage.getItem('rememberedPhone') || '';
    return rememberedPhone;
  }

  getRememberPasswordChecked() {
    const rememberPasswordChecked = localStorage.getItem('rememberPasswordChecked') || 'false';
    return rememberPasswordChecked === 'true';
  }

  setName(name: string) {
    localStorage.setItem('rememberedName', name);
  }

  getName() {
    const rememberedName = localStorage.getItem('rememberedName') || '';
    return rememberedName;
  }

  setEmail(email: string) {
    localStorage.setItem('rememberedEmail', email);
  }

  getEmail() {
    const rememberedEmail = localStorage.getItem('rememberedEmail') || '';
    return rememberedEmail;
  }

  clearUserData() {
    localStorage.removeItem('rememberedPhone');
    localStorage.removeItem('rememberedPassword');
    localStorage.removeItem('rememberedName');
    localStorage.setItem('rememberPasswordChecked', 'false');
  }
}