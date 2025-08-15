import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable, throwError } from 'rxjs';
import { shareReplay, catchError, tap } from 'rxjs/operators';
import { retry } from 'rxjs';
import { UserService } from '../user/user.service';

@Injectable({
  providedIn: 'root'
})

export class HttpService {

  private sharedCouponData$: Observable<any> | null = null;
  private authToken = environment.apiKey;
  private apiKeyVerification = environment.apiKeyVerification;
  private verificationCodeUrl = `${environment.apiBase}/Trotas/validausuario/`;
  private couponUrl = `${environment.apiBase}/Trotas/campanhas/`;
  private getUsuariosUrl = `${environment.apiBase}/Trotas/usuarios/`;
  private recoverPasswordUrl = `${environment.apiBase}/Trotas/validausuario/`;
  private activateCouponUrl = `${environment.apiBase}/Trotas/ativacupom/`;
  private getRelatoriosUrl = `${environment.apiBase}/Trotas/relatorios/`;
  public verificationCode: string = "";

  constructor(
    private http: HttpClient,
    private userService: UserService
  ) {}

  getCouponData(): Observable<any> {

    if (!this.sharedCouponData$) {
      console.log('Creating shared observable - Preparing to fetch coupon data...');

      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'token': `${this.authToken}`
      });

      const requestBody = {
        tiporota: "GET",
        campanhasativas: "SIM",
        idpessoa: this.userService.getUserId()
      };

      this.sharedCouponData$ = this.http.post<any>(this.couponUrl, requestBody, { headers }).pipe(
        tap(response => {
          console.log('Data received from API:', response);
        }),
        retry({
          count: 2,
          delay: 1000,
          resetOnSuccess: true
        }),
        catchError(err => this.handleError(err)),
        shareReplay({ bufferSize: 1, refCount: false })
      );
    } else {
      console.log('Returning cached coupon data observable.');
    }
    return this.sharedCouponData$;
  }

  sendVerificationCode(phone: string): Observable<any> {

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'token': `${this.authToken}`
    });

    const requestBody = {
      tiporota: "get",
      token: `${this.apiKeyVerification}`,
      telefone: phone
    };

    return this.http.post<any>(this.verificationCodeUrl, requestBody, { headers }).pipe(
      tap(response => {
        console.log('Verification code sent successfully:', response);
        this.verificationCode = response.detalhe.codigovalidacao;
      }),
      retry({
        count: 2,
        delay: 1000,
        resetOnSuccess: true
      }),
      catchError(err => this.handleError(err))
    );
  }

  registerUser(formValues: any): Observable<any> {

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'token': `${this.authToken}`
    });

    const requestBody = {
      tiporota: "accept",
      nome: `${formValues.name}`,
      senha: `${formValues.password}`,
      telefone: `${formValues.phone}`,
      codigovalidacao: `${formValues.verificationCode}`,
      email: `${formValues.email}`,
      validado: "SIM",
      loginpessoa: "SIM"
    };

    return this.http.post<any>(this.getUsuariosUrl, requestBody, { headers }).pipe(
      tap(response => {
        console.log('Register user successfully:', response);
      }),
      retry({
        count: 2,
        delay: 1000,
        resetOnSuccess: true
      }),
      catchError(err => this.handleError(err))
    );
  }

  loginUser(formValues: any): Observable<any> {

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'token': `${this.authToken}`
    });

    const requestBody = {
      tiporota: "GET",
      loginpessoa: "SIM",
      telefone: `${formValues.tel}`,
      senha: `${formValues.password}`
    };

    return this.http.post<any>(this.getUsuariosUrl, requestBody, { headers }).pipe(
      tap(response => {
        console.log('Login user successfully:', response);
        this.userService.setUserId(response.detalhe.id);
      }),
      retry({
        count: 2,
        delay: 1000,
        resetOnSuccess: true
      }),
      catchError(err => this.handleError(err))
    );
  }

  recoverPassword(formValues: any): Observable<any> {

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'token': `${this.authToken}`
    });

    const requestBody = {
      tiporota: 'get',
      email: `${formValues.email}`,
      token: `${this.apiKeyVerification}`,
      recuperasenha: 'SIM'
    };

    return this.http.post<any>(this.recoverPasswordUrl, requestBody, { headers }).pipe(
      tap(response => {
        console.log('Recover password successfully:', response);
      }),
      retry({
        count: 2,
        delay: 1000,
        resetOnSuccess: true
      }),
      catchError(err => this.handleError(err))
    );
  }

  activateCoupon(ncupom: string, idpessoa: number): Observable<any> {

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'token': `${this.authToken}`
    });

    const requestBody = {
      ncupom: ncupom,
      idpessoa: idpessoa
    };

    return this.http.post<any>(this.activateCouponUrl, requestBody, { headers }).pipe(
      tap(response => {
        console.log('Activate coupon successfully:', response);
      }),
      retry({
        count: 2,
        delay: 1000,
        resetOnSuccess: true
      }),
      catchError(err => this.handleError(err))
    );
  }

  getPeopleBalance(idpessoa: number): Observable<any> {

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'token': `${this.authToken}`
    });

    const requestBody = {
      tiporelatorio: "SALDOSPESSOAS",
      idpessoa: idpessoa,
      codusuario: null
    };

    return this.http.post<any>(this.getRelatoriosUrl, requestBody, { headers }).pipe(
      tap(response => {
        console.log('People balance:', response);
      }),
      retry({
        count: 2,
        delay: 1000,
        resetOnSuccess: true
      }),
      catchError(err => this.handleError(err)),
      shareReplay({ bufferSize: 1, refCount: false })
    );
  }

  getExpiringCashback(idpessoa: number, codempresa: number): Observable<any> {

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'token': `${this.authToken}`
    });

    const requestBody = {
      tiporelatorio: "CASHBACK A EXPIRAR",
      idpessoa: idpessoa,
      codempresa: codempresa,
      codusuario: null
    };

    return this.http.post<any>(this.getRelatoriosUrl, requestBody, { headers }).pipe(
      tap(response => {
        console.log('Expiring cashback:', response);
      }),
      retry({
        count: 2,
        delay: 1000,
        resetOnSuccess: true
      }),
      catchError(err => this.handleError(err))
    );

  }

  updateName(idpessoa: any, phone: any, name: any): Observable<any> {

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'token': `${this.authToken}`
    });

    const requestBody = {
      tiporota: "update",
      loginpessoa: "SIM",
      id: `${idpessoa}`,
      telefone: `${phone}`,
      nome: `${name}`
    };

    return this.http.post<any>(this.getUsuariosUrl, requestBody, { headers }).pipe(
      tap(response => {
        console.log('Name updated successfully:', response);
      }),
      retry({
        count: 2,
        delay: 1000,
        resetOnSuccess: true
      }),
      catchError(err => this.handleError(err))
    );

  }

  changePhone(phone: string): Observable<any> {
    
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'token': `${this.authToken}`
    });

    const requestBody = {
      tiporota: "get",
      token: `${this.apiKeyVerification}`,
      telefone: phone
    };

    return this.http.post<any>(this.verificationCodeUrl, requestBody, { headers }).pipe(
      tap(response => {
        console.log('Verification code sent successfully:', response);
        this.verificationCode = response.detalhe.codigovalidacao;
      }),
      retry({
        count: 2,
        delay: 1000,
        resetOnSuccess: true
      }),
      catchError(err => this.handleError(err))
    );
  }

  changeEmail(email: string): Observable<any> {
    
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'token': `${this.authToken}`
    });

    const requestBody = {
      tiporota: "get",
      token: `${this.apiKeyVerification}`,
      email: email
    };

    return this.http.post<any>(this.verificationCodeUrl, requestBody, { headers }).pipe(
      tap(response => {
        console.log('Verification code sent successfully:', response);
        this.verificationCode = response.detalhe.codigovalidacao;
      }),
      retry({
        count: 2,
        delay: 1000,
        resetOnSuccess: true
      }),
      catchError(err => this.handleError(err))
    );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    console.error('Error fetching data:', {
      status: error.status,
      message: error.message,
      details: error.error
    });
    this.sharedCouponData$ = null;
    return throwError(() => new Error('Failed to load data.'));
  }
}