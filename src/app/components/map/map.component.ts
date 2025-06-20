import { Component, OnInit, ViewChild, Input, OnChanges, SimpleChanges } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Geolocation } from '@capacitor/geolocation';
import { GoogleMap } from '@angular/google-maps';
import { Establishment } from 'src/app/interface/establishment';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
  standalone: false
})

export class MapComponent implements OnInit, OnChanges {

  @ViewChild(GoogleMap, { static: false }) map!: GoogleMap;

  @Input() establishments: Establishment[] = [];
  @Input() selectedEstablishmentId: number | null = null;

  private apiLoaded = false;
  mapsReady = false;

  center: google.maps.LatLngLiteral = { lat: -23.5505, lng: -46.6333 };
  zoom = 12;
  markers: google.maps.LatLngLiteral[] = [];

  advancedMarkers: google.maps.marker.AdvancedMarkerElement[] = [];

  mapOptions: google.maps.MapOptions = {
    mapTypeId: 'roadmap',
    scrollwheel: true,
    disableDoubleClickZoom: false,
    disableDefaultUI: true,
    maxZoom: 15,
    minZoom: 8,
    clickableIcons: false,
    center: this.center,
    zoom: this.zoom
  };

  ngOnInit(): void {
    this.load().then(() => {
      this.mapsReady = true;
      this.updateMarkers();
    }).catch(err => {
      console.error('Failed to load Google Maps API', err);
    });
    this.centerOnUserLocation();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['establishments'] || changes['selectedEstablishmentId']) {
      this.updateMarkers();

      // If we have a selected establishment with coordinates, center on it
      if (this.selectedEstablishmentId && this.establishments?.length) {
        const selected = this.establishments.find(e => e.id === this.selectedEstablishmentId);
        if (selected && selected.latitude && selected.longitude) {
          this.center = {
            lat: selected.latitude,
            lng: selected.longitude
          };
          this.zoom = 15; // Zoom in when an establishment is selected
        }
      }
    }
  }

  ngAfterViewInit() {
    this.updateMarkers();
  }

  updateMarkers() {
    // Clear existing markers
    this.advancedMarkers.forEach(marker => marker.map = null);
    this.advancedMarkers = [];
    this.markers = [];

    // Process establishments to create markers
    if (this.establishments && this.establishments.length > 0 && this.mapsReady && this.map?.googleMap) {
      this.establishments.forEach(establishment => {

        // Only create markers for establishments with latitude and longitude
        if (establishment.latitude && establishment.longitude) {
          const position = { lat: establishment.latitude, lng: establishment.longitude };
          this.markers.push(position);

          // Create an advanced marker with zip code as label
          const isSelected = establishment.id === this.selectedEstablishmentId;

          // Create a custom marker element
          const markerElement = document.createElement('div');
          markerElement.className = 'establishment-marker' + (isSelected ? ' selected' : '');
          markerElement.innerHTML = `
            <div class="marker-pin">
              <div class="marker-content">${establishment.cep || 'N/A'}</div>
            </div>
          `;

          // Apply some basic styling
          const style = markerElement.style;
          style.cursor = 'pointer';
          style.zIndex = isSelected ? '1000' : '1'; // Selected marker appears on top

          // Create the advanced marker
          const marker = new google.maps.marker.AdvancedMarkerElement({
            map: this.map.googleMap,
            position: position,
            content: markerElement,
            title: establishment.nomeempresa
          });

          this.advancedMarkers.push(marker);
        }
      });

      // If no establishments have coordinates, rely on user location
      if (this.markers.length === 0) {
        this.centerOnUserLocation();
      }

      // If we have establishments with coordinates but no selection, fit bounds to show all markers
      else if (!this.selectedEstablishmentId && this.markers.length > 0) {
        this.fitBoundsToMarkers();
      }
    }
  }

  fitBoundsToMarkers() {
    if (this.markers.length === 0 || !this.map?.googleMap) return;

    // Create bounds object
    const bounds = new google.maps.LatLngBounds();

    // Extend bounds with each marker
    this.markers.forEach(position => {
      bounds.extend(position);
    });

    // Fit map to bounds
    this.map.googleMap.fitBounds(bounds);

    // Limit maximum zoom
    const googleMap = this.map?.googleMap;
    if (!googleMap) return;

    // Using a separate variable for the listener and removing it within the callback
    let listener: google.maps.MapsEventListener | null = null;
    listener = googleMap.addListener('idle', () => {
      const currentMap = this.map?.googleMap;
      if (currentMap && typeof currentMap.getZoom === 'function') {
        const zoom = currentMap.getZoom();
        if (typeof zoom === 'number' && zoom > 15) {
          currentMap.setZoom(15);
        }
      }
      // Remove the listener after it's been triggered once
      if (listener) {
        google.maps.event.removeListener(listener);
      }
    });
  }

  async centerOnUserLocation() {
    try {
      const coordinates = await Geolocation.getCurrentPosition();
      const lat = coordinates.coords.latitude;
      const lng = coordinates.coords.longitude;
      this.center = { lat, lng };
      this.mapOptions = {
        ...this.mapOptions,
        center: this.center
      };
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
