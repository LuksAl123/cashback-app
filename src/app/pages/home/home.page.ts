import { Component, OnInit } from '@angular/core';
import { faLocationDot, faMoneyBillTransfer, faTicket, faCircleUser } from '@fortawesome/free-solid-svg-icons';
import { faEye } from '@fortawesome/free-regular-svg-icons';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: false
})

export class HomePage implements OnInit {

  faLocationDot = faLocationDot;
  faMoneyBillTransfer = faMoneyBillTransfer;
  faTicket = faTicket;
  faCircleUser = faCircleUser;
  faEye = faEye;

  constructor() { }

  ngOnInit() {
  }

}
