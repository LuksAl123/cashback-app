import { Component, OnInit } from '@angular/core';
import { faEye } from '@fortawesome/free-solid-svg-icons';
import { HttpService } from 'src/app/services/http/http.service';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-extrato',
  templateUrl: './extrato.page.html',
  styleUrls: ['./extrato.page.scss'],
  standalone: false
})

export class ExtratoPage implements OnInit {

  faEye = faEye;

  constructor(
    private httpService: HttpService,
    private userService: UserService
  ) { }

  ngOnInit() {
    this.loadExtrato();
    this.loadBalance();
  }

  

  loadExtrato() {
    this.httpService.getExpiringCashback(this.userService.getUserId()!, codempresa).subscribe({
      next: (response) => {
        console.log(response);
      },
      error: (error) => {
        console.log(error);
      }
    });
  }

  loadBalance() {
    this.httpService.getPeopleBalance(this.userService.getUserId()!).subscribe({
      next: (response) => {
        console.log(response);
      },
      error: (error) => {
        console.log(error);
      }
    });
  }
}
