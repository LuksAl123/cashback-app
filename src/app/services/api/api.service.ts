import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})

export class ApiService implements OnInit{

  private apiUrl = 'https://api.gcashback.com.br/Trotas/campanhas/';
  private authToken = environment.apiKey;

  constructor(private http: HttpClient) {}

  ngOnInit() {
  }

  fetchCampaignData() {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'token': `${this.authToken}` 
    });

    const requestBody = {
      tiporota: "GET",
      campanhasativas: "SIM"
    };

    console.log('Attempting to POST data to:', this.apiUrl);
    console.log('Request Body:', requestBody);
    console.log('Request Headers:', headers);

    this.http.post<any>(this.apiUrl, requestBody, { headers }).subscribe({
      next: (response) => {
        console.log('Data received successfully:', response);
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error fetching data:', error);
        console.error(`Status: ${error.status}, Message: ${error.message}`);
        if (error.error) {
          console.error('Server Error Details:', error.error);
        }
      },
      complete: () => {
        console.log('HTTP request completed.');
      }
    });
  }
}

