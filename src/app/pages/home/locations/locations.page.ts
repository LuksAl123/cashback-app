import { Component, OnInit } from '@angular/core';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { Establishment } from 'src/app/interface/establishment';

@Component({
  selector: 'app-locations',
  templateUrl: './locations.page.html',
  styleUrls: ['./locations.page.scss'],
  standalone: false
})

export class LocationsPage implements OnInit {

  isCouponLoading: boolean = true;
  visible: boolean = false;
  establishments: Establishment[] = [];
  selectedEstablishmentId: number | null = null;

  faArrowLeft = faArrowLeft;

  constructor() {}

  ngOnInit() {
  }

  onLoadingChange(isLoading: boolean): void {
    this.isCouponLoading = isLoading;

    if (!isLoading) {
      setTimeout(() => {
        this.visible = true;
      }, 300);
    } else {
      this.visible = false;
    }
  }

  onEstablishmentsChange(establishments: Establishment[]): void {
    this.establishments = establishments;
  }

  onSelectedEstablishmentChange(id: number | null): void {
    this.selectedEstablishmentId = id;
  }

}