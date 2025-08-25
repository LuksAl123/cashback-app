import { Component, OnInit } from '@angular/core';
import { HttpService } from 'src/app/services/http/http.service';
import { ToastService } from 'src/app/services/toast/toast.service';
import { UserService } from 'src/app/services/user/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.page.html',
  styleUrls: ['./change-password.page.scss'],
  standalone: false,
})
export class ChangePasswordPage implements OnInit {
  password: string = '';
  constructor(
    private httpService: HttpService,
    private userService: UserService,
    private toastService: ToastService,
    private router: Router
  ) {}

  ngOnInit() {}

  changePassword() {
    this.httpService
      .changePassword(this.userService.getPhone(), this.password)
      .subscribe({
        next: () => {
          this.userService.setPassword(this.password);
          this.toastService.show('Senha alterada com sucesso', 'success');
          this.router.navigate(['/home/profile']);
        },
      });
  }
}
