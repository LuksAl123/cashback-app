import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable, throwError } from 'rxjs';
import { shareReplay, catchError, tap } from 'rxjs/operators';

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

  private apiUrl = 'https://api.gcashback.com.br/Trotas/campanhas/';
  private authToken = environment.apiKey;
  private sharedCampaignData$: Observable<CampaignData> | null = null;

  constructor(private http: HttpClient) {}

  getCampaignData(): Observable<any> {

    if (!this.sharedCampaignData$) {
      console.log('Creating shared observable - Preparing to fetch campaign data...');

      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'token': `${this.authToken}`
      });

      const requestBody = {
        tiporota: "GET",
        campanhasativas: "SIM"
      };

      this.sharedCampaignData$ = this.http.post<CampaignData>(this.apiUrl, requestBody, { headers }).pipe(
        tap(response => {
          console.log('Data received from API:', response);
        }),
        catchError((error: HttpErrorResponse) => {
          console.error('Error fetching campaign data:', error);
          console.error(`Status: ${error.status}, Message: ${error.message}`);
          if (error.error) {
            console.error('Server Error Details:', error.error);
          }

          this.sharedCampaignData$ = null;

          return throwError(() => new Error('Failed to load campaign data. API error occurred.'));
        }),
        shareReplay({ bufferSize: 1, refCount: false })
      );
    } else {
      console.log('Returning cached campaign data observable.');
    }
    return this.sharedCampaignData$;
  }
}

import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable, throwError, timer } from 'rxjs';
import { shareReplay, catchError, tap, retryWhen, scan, delay } from 'rxjs/operators';

export interface CampaignData {
  id: number;
  codeempresa: number;
  nomecampanha: string;
  tipo: string;
  cp_perc_descontocliente: number;
  vr_comprasacimade: number;
}

@Injectable({ providedIn: 'root' })
export class ApiService {
  private sharedCampaignData$?: Observable<CampaignData>;

  constructor(private http: HttpClient) {}

  /** Public API: Returns a shared, cached Observable of campaign data */
  getCampaignData(): Observable<CampaignData> {
    this.sharedCampaignData$ ??= this.fetchCampaignData().pipe(
      tap(data => console.debug('Campaign data loaded:', data)),                                     // Debug logging :contentReference[oaicite:6]{index=6}
      retryWhen(errors =>
        errors.pipe(
          scan((retryCount, err) => {
            if (retryCount >= 2 || !(err instanceof HttpErrorResponse)) {
              throw err;
            }
            return retryCount + 1;
          }, 0),
          delay(1000)                                                                              // 1s backoff :contentReference[oaicite:7]{index=7}
        )
      ),
      catchError(err => this.handleError(err)),                                                    // Centralized error handling :contentReference[oaicite:8]{index=8}
      shareReplay({ bufferSize: 1, refCount: true })                                                // Safe caching :contentReference[oaicite:9]{index=9}
    );
    return this.sharedCampaignData;
  }

  /** Low-level HTTP POST wrapped for clarity */
  private fetchCampaignData(): Observable<CampaignData> {
    return this.http.post<CampaignData>(
      this.apiUrl,
      this.requestBody,
      { headers: this.requestHeaders }
    );
  }

  /** API URL from environment */
  private get apiUrl(): string {
    return `${environment.apiBase}/Trotas/campanhas/`;                                              // Centralized URL :contentReference[oaicite:10]{index=10}
  }

  /** Immutable headers getter */
  private get requestHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'token': environment.apiKey                                                                         // Auth header :contentReference[oaicite:11]{index=11}
    });
  }

  /** Request payload getter */
  private get requestBody(): { tiporota: 'GET'; campanhasativas: 'SIM' } {
    return { tiporota: 'GET', campanhasativas: 'SIM' };                                              // Body centralization :contentReference[oaicite:12]{index=12}
  }

  /** Logs, resets cache on error, and rethrows a clean error */
  private handleError(error: HttpErrorResponse): Observable<never> {
    console.error('Error fetching campaign data:', {
      status: error.status,
      message: error.message,
      details: error.error
    });                                                                                            // Rich diagnostics :contentReference[oaicite:13]{index=13}
    this.sharedCampaignData$ = undefined;                                                          // Clear cache for next attempt
    return throwError(() => new Error('Failed to load campaign data.'));                            // User-friendly error
  }
}