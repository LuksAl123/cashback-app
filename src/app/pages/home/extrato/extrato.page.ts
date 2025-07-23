import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { catchError, map, of, Observable } from 'rxjs';
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
  faEyeSlash = faEyeSlash;
  errorMsg: string | null = null;
  detalheArray$!: Observable<any[]>;
  totalCashback$!: Observable<number>;
  showBalance: boolean = true;

  constructor(
    private httpService: HttpService,
    private userService: UserService,
    private router: Router
  ) { }

  ngOnInit() {
    this.loadBalance();
  }

  loadBalance() {
    this.detalheArray$ = this.httpService.getPeopleBalance(this.userService.getUserId()!)
          .pipe(
            map(response => response?.detalhe ?? []),
            catchError(error => {
              this.errorMsg = error.message || 'Could not load data.';
              return of([]);
            })
          );

    this.totalCashback$ = this.detalheArray$.pipe(
      map(array => array.reduce((total, establishment) => total + (establishment.saldocashback || 0), 0))
    );
  }

  selectEstablishment(codEmpresa: number) {
    this.userService.setCodEmpresa(codEmpresa);
    this.router.navigate(['/extrato/per-establishment']);
  }

  toggleBalance() {
    this.showBalance = !this.showBalance;
  }
}