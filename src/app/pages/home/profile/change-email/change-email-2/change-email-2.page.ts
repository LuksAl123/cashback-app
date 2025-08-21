import { Component, OnInit } from '@angular/core';
import { HttpService } from 'src/app/services/http/http.service';
import { ToastService } from 'src/app/services/toast/toast.service';
import { UserService } from 'src/app/services/user/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-change-email-2',
  templateUrl: './change-email-2.page.html',
  styleUrls: ['./change-email-2.page.scss'],
  standalone: false,
})
export class ChangeEmail2Page implements OnInit {
  email: string = '';
  verificationCode: string = '';

  constructor(
    private httpService: HttpService,
    private toastService: ToastService,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit() {}

  ionViewDidEnter() {
    this.email = this.httpService.email;
  }

  verify() {
    if (this.verificationCode === this.httpService.verificationCode) {
      console.log(this.verificationCode);
      console.log(this.email);
      console.log(this.httpService.verificationCode);
      this.httpService.changeEmail(this.email).subscribe({
        next: () => {
          this.userService.setEmail(this.email);
          this.toastService.show('Email alterado com sucesso', 'success');
          this.router.navigate(['/home/profile']);
        },
      });
    } else {
      console.log('Código de verificação incorreto');
      this.toastService.show('Código de verificação incorreto', 'error');
    }
  }
}
