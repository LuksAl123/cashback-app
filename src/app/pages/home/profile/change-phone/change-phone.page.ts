import { Component, OnInit } from '@angular/core';
import { HttpService } from 'src/app/services/http/http.service';
import { MaskitoElementPredicate, MaskitoOptions } from '@maskito/core';
import { UserService } from 'src/app/services/user/user.service';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-change-phone',
  templateUrl: './change-phone.page.html',
  styleUrls: ['./change-phone.page.scss'],
  standalone: false,
})
export class ChangePhonePage implements OnInit {
  phone: string = '';
  phoneMasked: string = '';
  phoneError: string = '';

  readonly phoneMask: MaskitoOptions = {
    mask: [
      '(',
      /\d/,
      /\d/,
      ')',
      ' ',
      /\d/,
      /\d/,
      /\d/,
      /\d/,
      /\d/,
      '-',
      /\d/,
      /\d/,
      /\d/,
      /\d/,
    ],
  };

  readonly maskPredicate: MaskitoElementPredicate = async (el) =>
    (el as HTMLIonInputElement).getInputElement();

  constructor(
    private httpService: HttpService,
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {}

  onPhoneChange() {
    this.phoneError = '';
  }

  changePhone() {
    console.log(this.phone);
    this.phone = this.phoneMasked.replace(/\D/g, '');
    console.log(this.phone);
    if (this.phone === this.userService.getPhone()) {
      this.phoneError = 'Telefone não pode ser o mesmo';
      return;
    }
    this.httpService.sendSMS(this.phone).subscribe({
      next: (response) => {
        this.httpService.phone = this.phone;
        this.httpService.phoneMasked = this.phoneMasked;
        this.httpService.verificationCode = response.detalhe.codigovalidacao;
        console.log(this.httpService.verificationCode);
        this.router.navigate(['change-phone-2'], { relativeTo: this.route });
      },
    });
  }
}
