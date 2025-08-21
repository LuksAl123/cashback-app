import { Component, OnInit } from '@angular/core';
import { HttpService } from 'src/app/services/http/http.service';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-change-email',
  templateUrl: './change-email.page.html',
  styleUrls: ['./change-email.page.scss'],
  standalone: false,
})
export class ChangeEmailPage implements OnInit {
  email: string = '';
  emailError: string = '';

  constructor(
    private httpService: HttpService,
    private router: Router,
    private route: ActivatedRoute,
    private userService: UserService
  ) {}

  ngOnInit() {}

  onEmailChange() {
    this.emailError = '';
  }

  changeEmail() {
    if (this.email === this.userService.getEmail()) {
      this.emailError = 'Email não pode ser o mesmo';
      return;
    }
    this.httpService.sendEmail(this.email).subscribe({
      next: (response) => {
        this.httpService.email = this.email;
        this.httpService.verificationCode =
          response.detalhe.codigovalidacaoemail;
        this.router.navigate(['change-email-2'], { relativeTo: this.route });
      },
    });
  }
}
