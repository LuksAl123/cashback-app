import { Component, OnInit, OnDestroy } from '@angular/core';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { catchError, map, Observable, of, Subscription } from 'rxjs';
import { HttpService } from 'src/app/services/http/http.service';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-per-establishment',
  templateUrl: './per-establishment.page.html',
  styleUrls: ['./per-establishment.page.scss'],
  standalone: false
})

export class PerEstablishmentPage implements OnInit, OnDestroy {

  faEye = faEye;
  faEyeSlash = faEyeSlash;
  showBalance: boolean = false;
  codEmpresaSub!: Subscription;
  detalheArray$!: Observable<any[]>;
  totalCashback$ = this.userService.totalCashback$;

  constructor(
    private httpService: HttpService,
    private userService: UserService
  ) { }

  ngOnInit() {
    this.codEmpresaSub = this.userService.codEmpresa$.subscribe(codEmpresa => {
      if (codEmpresa) {
        this.loadExtrato(codEmpresa);
      }
    });
  }

  loadExtrato(codEmpresa: number) {

    this.detalheArray$ = this.httpService.getExpiringCashback(this.userService.getUserId()!, codEmpresa).pipe(
      map(response => response?.detalhe ?? []),
      catchError(error => {
        console.log(error);
        return of([]);
      })
    );

  }

  toggleBalance() {
    this.showBalance = !this.showBalance;
  }

  ngOnDestroy() {
    if (this.codEmpresaSub) {
      this.codEmpresaSub.unsubscribe();
    }
  }

}