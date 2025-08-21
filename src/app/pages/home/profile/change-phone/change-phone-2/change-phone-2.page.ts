import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpService } from 'src/app/services/http/http.service';
import { ToastService } from 'src/app/services/toast/toast.service';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-change-phone-2',
  templateUrl: './change-phone-2.page.html',
  styleUrls: ['./change-phone-2.page.scss'],
  standalone: false,
})
export class ChangePhone2Page implements OnInit {
  phone: string = '';
  phoneMasked: string = '';
  verificationCode: string = '';

  constructor(
    private httpService: HttpService,
    private toastService: ToastService,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit() {}

  ionViewDidEnter() {
    this.phone = this.httpService.phone;
    this.phoneMasked = this.httpService.phoneMasked;
  }

  verify() {
    if (this.verificationCode === this.httpService.verificationCode) {
      console.log(this.verificationCode);
      console.log(this.phone);
      console.log(this.httpService.verificationCode);
      this.httpService.changePhone(this.phone).subscribe({
        next: () => {
          this.userService.setPhone(this.phone);
          this.toastService.show('Telefone alterado com sucesso', 'success');
          this.router.navigate(['/home/profile']);
        },
      });
    } else {
      console.log('Código de verificação incorreto');
      this.toastService.show('Código de verificação incorreto', 'error');
    }
  }
}
