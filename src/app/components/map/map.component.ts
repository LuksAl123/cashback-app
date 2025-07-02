import { Component, ViewChild, Input, Output, EventEmitter, ChangeDetectionStrategy, signal, computed, OnChanges, SimpleChanges, AfterViewInit } from '@angular/core';
import { GoogleMap } from '@angular/google-maps';
import { Establishment } from 'src/app/interface/establishment';
import { Geolocation } from '@capacitor/geolocation';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false
})

export class MapComponent implements OnChanges, AfterViewInit {

  @ViewChild(GoogleMap, { static: false }) map?: GoogleMap;

  @Input() establishments: Establishment[] = [];
  @Input() selectedEstablishmentId: number | null = null;
  @Output() mapClick = new EventEmitter<{ lat: number; lng: number }>();

  private readonly defaultCenter: google.maps.LatLngLiteral = { lat: -23.5505, lng: -46.6333 };
  private readonly defaultZoom = 15;

  apiLoaded = signal(false);
  mapsReady = signal(false);
  center = signal<google.maps.LatLngLiteral>(this.defaultCenter);
  zoom = signal<number>(this.defaultZoom);
  markers = signal<google.maps.LatLngLiteral[]>([]);
  advancedMarkers: google.maps.marker.AdvancedMarkerElement[] = [];

  mapOptions = computed((): google.maps.MapOptions => ({
    mapTypeId: 'roadmap',
    scrollwheel: true,
    disableDoubleClickZoom: false,
    disableDefaultUI: true,
    maxZoom: 15,
    minZoom: 8,
    clickableIcons: false,
    center: this.center(),
    zoom: this.zoom()
  }));

  constructor() {
    this.load().then(() => {
      this.mapsReady.set(true);
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
          this.center.set({
            lat: selected.latitude,
            lng: selected.longitude
          });
          this.zoom.set(15); // Zoom in when an establishment is selected
        }
      }
    }
  }

  ngAfterViewInit(): void {
    this.updateMarkers();
  }

  updateMarkers(): void {
    // Clear existing markers
    this.advancedMarkers.forEach(marker => marker.map = null);
    this.advancedMarkers = [];
    this.markers.set([]);

    if (this.establishments && this.establishments.length > 0 && this.mapsReady() && this.map?.googleMap) {
      const newMarkers: google.maps.LatLngLiteral[] = [];
      this.establishments.forEach(establishment => {
        if (establishment.latitude && establishment.longitude) {
          const position = { lat: establishment.latitude, lng: establishment.longitude };
          newMarkers.push(position);
          // Create custom marker
          const isSelected = establishment.id === this.selectedEstablishmentId;
          const markerElement = document.createElement('div');
          markerElement.className = 'establishment-marker' + (isSelected ? 'selected' : '');
          markerElement.innerHTML = `
            <div class="marker-pin">
              <div class="marker-content">${establishment.cep || 'N/A'}</div>
            </div>
          `;
          const style = markerElement.style;
          style.cursor = 'pointer';
          style.zIndex = isSelected ? '1000' : '1';
          if (!this.map?.googleMap) return;
          const marker = new google.maps.marker.AdvancedMarkerElement({
            map: this.map.googleMap,
            position,
            content: markerElement,
            title: establishment.nomeempresa
          });
          this.advancedMarkers.push(marker);
        }
      });
      this.markers.set(newMarkers);
      if (newMarkers.length === 0) {
        this.centerOnUserLocation();
      } else if (!this.selectedEstablishmentId && newMarkers.length > 0) {
        this.fitBoundsToMarkers();
      }
    }
  }

  fitBoundsToMarkers(): void {
    const markers = this.markers();
    if (markers.length === 0 || !this.map?.googleMap) return;
    const bounds = new google.maps.LatLngBounds();
    markers.forEach(position => bounds.extend(position));
    if (!this.map?.googleMap) return;
    this.map.googleMap.fitBounds(bounds);
    const googleMap = this.map?.googleMap;
    if (!googleMap) return;
    let listener: google.maps.MapsEventListener | null = null;
    listener = googleMap.addListener('idle', () => {
      const currentMap = this.map?.googleMap;
      if (currentMap && typeof currentMap.getZoom === 'function') {
        const zoom = currentMap.getZoom();
        if (typeof zoom === 'number' && zoom > 15) {
          currentMap.setZoom(15);
        }
      }
      if (listener) {
        google.maps.event.removeListener(listener);
      }
    });
  }

  async centerOnUserLocation(): Promise<void> {
    try {
      const coordinates = await Geolocation.getCurrentPosition();
      const lat = coordinates.coords.latitude;
      const lng = coordinates.coords.longitude;
      this.center.set({ lat, lng });
    } catch (error) {
      console.error('Geolocation error:', error);
    }
  }

  load(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.apiLoaded()) {
        resolve();
        return;
      }
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${environment.googleMapsApiKey}&libraries=marker`;
      script.async = true;
      script.defer = true;
      script.onload = () => {
        this.apiLoaded.set(true);
        resolve();
      };
      script.onerror = (err) => reject(err);
      document.body.appendChild(script);
    });
  }
}
