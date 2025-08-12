import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { faArrowRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import { HttpService } from 'src/app/services/http/http.service';
import { ToastService } from 'src/app/services/toast/toast.service';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: false
})

export class ProfilePage implements OnInit {

  faArrowRightFromBracket = faArrowRightFromBracket;

  name: string = '';

  constructor(
    private router: Router,
    private userService: UserService,
    private httpService: HttpService,
    private toastService: ToastService
  ) { }

  ngOnInit() {
    this.name = this.userService.getProfileData();
  }

  saveName() {
    this.httpService.updateName(this.userService.getUserId()!.toString(), this.userService.getLoginData()[0].toString(), this.userService.getProfileData()).subscribe({
      next: () => {
        this.toastService.show('Nome salvo com sucesso!');
        this.router.navigate(['/home']);
      },
      error: (err) => {
        this.toastService.show('Erro ao salvar nome!');
        console.error(err);
      }
    });
  }

  logout() {
    localStorage.removeItem('sessionActive');
    if (localStorage.getItem('rememberPasswordChecked') === 'true') {
    } else {
      this.userService.clearUserData();
    }
    this.router.navigate(['/login-signup']);
  }
}