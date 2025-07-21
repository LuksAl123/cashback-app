import { Component, OnInit } from '@angular/core';
import { faEye } from '@fortawesome/free-solid-svg-icons';
import { catchError, of } from 'rxjs';
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
  errorMsg: string | null = null;

  constructor(
    private httpService: HttpService,
    private userService: UserService
  ) { }

  ngOnInit() {
    this.loadExtrato();
    this.loadBalance();
  }

  loadExtrato() {
    this.httpService.getExpiringCashback(this.userService.getUserId()!, this.userService.getCodEmpresa()!).subscribe({
      next: (response) => {
        console.log('ExpiringCashback: ', response);
      },
      error: (error) => {
        console.log(error);
      }
    });
  }

  loadBalance() {
    this.httpService.getPeopleBalance(this.userService.getUserId()!)
          .pipe(
            catchError(error => {
              this.errorMsg = error.message || 'Could not load data.';
              return of(null);
            })
          )
        .subscribe(response => {
            console.log('PeopleBalance: ', response);
        });
  }
}
