import { Component, OnInit, ViewChild } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Geolocation } from '@capacitor/geolocation';
import { GoogleMap } from '@angular/google-maps';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
  standalone: false
})

export class MapComponent implements OnInit {

  @ViewChild(GoogleMap, { static: false }) map!: GoogleMap;

  private apiLoaded = false;
  mapsReady = false;

  center: google.maps.LatLngLiteral = { lat: 40.73061, lng: -73.935242 };
  zoom = 15;
  markers = [
    { lat: 40.73061, lng: -73.935242 },
    { lat: 40.74988, lng: -73.968285 }
  ];

  advancedMarkers: google.maps.marker.AdvancedMarkerElement[] = [];

  mapOptions: google.maps.MapOptions = {
    mapTypeId: 'roadmap',
    scrollwheel: true,
    disableDoubleClickZoom: false,
    disableDefaultUI: true,
    maxZoom: 15,
    minZoom: 8,
    clickableIcons: true,
    center: this.center,
    zoom: this.zoom
  };

  ngOnInit(): void {
    this.load().then(() => {
      this.mapsReady = true;
    }).catch(err => {
      console.error('Failed to load Google Maps API', err);
    });
    this.centerOnUserLocation();
  }

  ngAfterViewInit() {
    this.addAdvancedMarkers();
  }

  addAdvancedMarkers() {
    this.advancedMarkers.forEach(marker => marker.map = null);
    this.advancedMarkers = [];

    if (this.map && this.map.googleMap) {
      for (const markerData of this.markers) {
        const marker = new google.maps.marker.AdvancedMarkerElement({
          map: this.map.googleMap,
          position: markerData,
        });
        this.advancedMarkers.push(marker);
      }
    }
  }

  async centerOnUserLocation() {
    try {
      const coordinates = await Geolocation.getCurrentPosition();
      const lat = coordinates.coords.latitude;
      const lng = coordinates.coords.longitude;
      this.center = { lat, lng };
    } catch (error) {
      console.error('Geolocation error:', error);
    }
  }

  load(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.apiLoaded) {
        resolve();
        return;
      }
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${environment.googleMapsApiKey}&libraries=marker`;
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
