import { Component } from '@angular/core';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})

export class MapComponent {
  center: google.maps.LatLngLiteral = { lat: 40.73061, lng: -73.935242 };
  zoom = 12;
  markers = [
    { lat: 40.73061, lng: -73.935242 },
    { lat: 40.74988, lng: -73.968285 }
  ];
}
