import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
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
  showBalance: boolean = true;
  totalCashback$ = this.userService.totalCashback$;

  constructor(
    private userService: UserService,
    private router: Router
  ) { }

  ngOnInit() {
    this.userService.loadBalance();
  }

  selectEstablishment(codEmpresa: number) {
    this.userService.setCodEmpresa(codEmpresa);
    this.router.navigate(['/home/extrato/per-establishment']);
  }

  toggleBalance() {
    this.showBalance = !this.showBalance;
  }
}
