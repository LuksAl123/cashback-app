import { Component, OnInit } from '@angular/core';
import { faCircleUser, faEye, faLocationDot, faTicket, faMoneyBillTransfer } from '@fortawesome/free-solid-svg-icons';
import { ApiService } from 'src/app/services/api/api.service';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.page.html',
  styleUrls: ['./welcome.page.scss'],
  standalone: false
})

export class WelcomePage implements OnInit {

  faCircleUser = faCircleUser;
  faEye = faEye;
  faLocationDot = faLocationDot;
  faTicket = faTicket;
  faMoneyBillTransfer = faMoneyBillTransfer;

  constructor(private apiService: ApiService) { }

  ngOnInit() {
    this.apiService.getCampaignData();
  }

}
