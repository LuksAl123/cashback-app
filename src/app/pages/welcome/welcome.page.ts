import { Component, OnInit } from '@angular/core';
import { faCircleUser, faEye, faLocationDot, faTicket, faMoneyBillTransfer } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.page.html',
  styleUrls: ['./welcome.page.scss'],
  standalone: false
})

export class WelcomePage implements OnInit {

  isCouponLoading: boolean = true;

  faCircleUser = faCircleUser;
  faEye = faEye;
  faLocationDot = faLocationDot;
  faTicket = faTicket;
  faMoneyBillTransfer = faMoneyBillTransfer;

  constructor() { }

  ngOnInit() {
  }

}
