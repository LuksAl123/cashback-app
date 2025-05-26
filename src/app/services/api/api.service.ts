import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable, throwError } from 'rxjs';
import { shareReplay, catchError, tap } from 'rxjs/operators';
import { retry } from 'rxjs';

export interface CampaignData {
  id: number;
  codeempresa: number;
  nomecampanha: string;
  tipo: string;
  cp_perc_descontocliente: number;
  vr_comprasacimade: number;
}

@Injectable({
  providedIn: 'root'
})

export class ApiService {

  private sharedCouponData$: Observable<CampaignData> | null = null;
  private authToken = environment.apiKey;
  private apiKeyVerification = environment.apiKeyVerification;
  private verificationCodeUrl = `${environment.apiBase}/Trotas/validausuario/`;
  private couponUrl = `${environment.apiBase}/Trotas/campanhas/`;
  private registerUserUrl = `${environment.apiBase}/Trotas/usuarios/`;
  public verificationCode: string = "";

  constructor(private http: HttpClient) {}

  getCouponData(): Observable<any> {

    if (!this.sharedCouponData$) {
      console.log('Creating shared observable - Preparing to fetch coupon data...');

      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'token': `${this.authToken}`
      });

      const requestBody = {
        tiporota: "GET",
        campanhasativas: "SIM"
      };

      this.sharedCouponData$ = this.http.post<CampaignData>(this.couponUrl, requestBody, { headers }).pipe(
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

    return this.http.post<any>(this.registerUserUrl, requestBody, { headers }).pipe(
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
