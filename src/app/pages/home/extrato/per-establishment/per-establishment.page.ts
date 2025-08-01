import { Component, OnInit } from '@angular/core';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { catchError, map, Observable, of } from 'rxjs';
import { HttpService } from 'src/app/services/http/http.service';
import { UserService } from 'src/app/services/user/user.service';
import { SharedDataService } from 'src/app/shared-data.service';

@Component({
  selector: 'app-per-establishment',
  templateUrl: './per-establishment.page.html',
  styleUrls: ['./per-establishment.page.scss'],
  standalone: false
})

export class PerEstablishmentPage implements OnInit {

  faEye = faEye;
  faEyeSlash = faEyeSlash;
  showBalance: boolean = false; 
  detalheArray$!: Observable<any[]>;
  totalCashback$!: Observable<number>;
  detailData: any = null;

  constructor(
    private httpService: HttpService,
    private userService: UserService,
    private sharedDataService: SharedDataService
  ) { }

  ngOnInit() {
    this.totalCashback$ = this.sharedDataService.totalCashback$;
  }

  ionViewWillEnter() {
    this.loadExtrato(this.userService.getCodEmpresa());
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

  filterExtracts(event?: any) {
    if(event && event.detail) {
      const selectedValue = event.detail.value;
    }
  }
}
