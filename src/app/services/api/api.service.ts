import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class ApiService implements OnInit{
  
  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.fetchCampaignData();
  }

  fetchCampaignData() {
    const apiUrl = 'https://api.gcashback.com.br/Trotas/campanhas/';
    const requestBody = {
      tiporota: "GET",       
      campanhasativas: "SIM"
    };

    console.log('Attempting to POST data to:', apiUrl);
    console.log('Request Body:', requestBody);

    this.http.post<any>(apiUrl, requestBody).subscribe({
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
