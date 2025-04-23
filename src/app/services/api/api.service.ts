import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable, throwError } from 'rxjs';
import { shareReplay, catchError, tap } from 'rxjs/operators';

export interface CampaignData {
  // Define properties based on what the API actually returns
  // Example:
  // id: number;
  // name: string;
  // active: boolean;
  // details: any;
  // ... or maybe it's an array: CampaignItem[]
  [key: string]: any;
}

@Injectable({
  providedIn: 'root'
})

export class ApiService {

  private apiUrl = 'https://api.gcashback.com.br/Trotas/campanhas/';
  private authToken = environment.apiKey;
  private sharedCampaignData$: Observable<CampaignData> | null = null;

  constructor(private http: HttpClient) {}

  getCampaignData(): Observable<CampaignData> {

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