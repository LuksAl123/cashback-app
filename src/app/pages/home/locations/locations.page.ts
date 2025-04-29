import { Component, OnInit } from '@angular/core';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-locations',
  templateUrl: './locations.page.html',
  styleUrls: ['./locations.page.scss'],
  standalone: false
})

export class LocationsPage implements OnInit {

  isCouponLoading: boolean = true;

  faArrowLeft = faArrowLeft;

  constructor() {}

  ngOnInit() {
  }

}
