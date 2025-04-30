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
  bottomSheetVisible: boolean = false;

  faArrowLeft = faArrowLeft;

  constructor() {}

  ngOnInit() {
  }

  onLoadingChange(isLoading: boolean): void {
    this.isCouponLoading = isLoading;

    if (!isLoading) {
      setTimeout(() => {
        this.bottomSheetVisible = true;
      }, 300);
    } else {
      this.bottomSheetVisible = false;
    }
  }

}
