import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
  standalone: false
})

export class MapComponent implements OnInit {

  private apiLoaded = false;
  mapsReady = false;

  ngOnInit(): void {
    this.load().then(() => {
      this.mapsReady = true;
    }).catch(err => {
      console.error('Failed to load Google Maps API', err);
    });
  }
  
  center: google.maps.LatLngLiteral = { lat: 40.73061, lng: -73.935242 };
  zoom = 12;
  markers = [
    { lat: 40.73061, lng: -73.935242 },
    { lat: 40.74988, lng: -73.968285 }
  ];

  mapOptions: google.maps.MapOptions = {
    mapTypeId: 'roadmap',
    zoomControl: true,
    scrollwheel: true,
    disableDoubleClickZoom: false,
    maxZoom: 15,
    minZoom: 8
  };

  setUserLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => {
          this.center = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
        },
        error => {
          console.warn('Geolocation not allowed or failed, using default location.', error);
        }
      );
    } else {
      console.warn('Geolocation not supported by this browser.');
    }
  }

  load(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.apiLoaded) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${environment.googleMapsApiKey}`;
      script.async = true;
      script.defer = true;
      script.onload = () => {
        this.apiLoaded = true;
        resolve();
      };
      script.onerror = (err) => reject(err);
      document.body.appendChild(script);
    });
  }
}