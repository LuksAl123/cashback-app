import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { Observable } from 'rxjs';
import { UserService } from 'src/app/services/user/user.service';
import { SharedDataService } from 'src/app/shared-data.service';

@Component({
  selector: 'app-extrato',
  templateUrl: './extrato.page.html',
  styleUrls: ['./extrato.page.scss'],
  standalone: false
})

export class ExtratoPage implements OnInit {

  faEye = faEye;
  faEyeSlash = faEyeSlash;
  showBalance: boolean = true;
  totalCashback$!: Observable<number>;
  detalheArray$!: Observable<any[]>;

  constructor(
    private userService: UserService,
    private router: Router,
    private sharedDataService: SharedDataService
  ) { }

  ngOnInit() {
    this.sharedDataService.loadBalance();
    this.detalheArray$ = this.sharedDataService.detalheArray$;
    this.totalCashback$ = this.sharedDataService.totalCashback$;
  }

  selectEstablishment(codEmpresa: number) {
    this.userService.setCodEmpresa(codEmpresa);
    this.router.navigate(['/home/extrato/per-establishment']);
  }

  toggleBalance() {
    this.showBalance = !this.showBalance;
  }
}
