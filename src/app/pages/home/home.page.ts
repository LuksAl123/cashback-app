import { Component, OnInit } from '@angular/core';
import { faLocationDot, faMoneyBillTransfer, faTicket, faCircleUser } from '@fortawesome/free-solid-svg-icons';

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

  constructor() { }

  ngOnInit() {
  }

}
