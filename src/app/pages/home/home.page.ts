import { Component, OnInit } from '@angular/core';
import { faLocationDot, faMoneyBillTransfer, faTicket, faCircleUser } from '@fortawesome/free-solid-svg-icons';
import { faEye } from '@fortawesome/free-regular-svg-icons';
import { SharedDataService } from 'src/app/shared-data.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: false
})

export class HomePage implements OnInit {

  isCouponLoading: boolean = true;

  faLocationDot = faLocationDot;
  faMoneyBillTransfer = faMoneyBillTransfer;
  faTicket = faTicket;
  faCircleUser = faCircleUser;
  faEye = faEye;

  totalCashback$!: Observable<number>;

  constructor(
    private sharedDataService: SharedDataService
  ) { }

  ngOnInit() {
    this.totalCashback$ = this.sharedDataService.totalCashback$;
  }

}
