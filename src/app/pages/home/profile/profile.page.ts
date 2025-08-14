import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { faArrowRightFromBracket, faPencil, faRightLeft } from '@fortawesome/free-solid-svg-icons';
import { IonModal } from '@ionic/angular';
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

  @ViewChild('modal', { static: false} ) modal!: IonModal;

  faArrowRightFromBracket = faArrowRightFromBracket;
  faPencil = faPencil;
  faRightLeft = faRightLeft;

  name: string = '';
  email: string = '';
  phone: string = '';

  constructor(
    private router: Router,
    private userService: UserService,
    private httpService: HttpService,
    private toastService: ToastService
  ) { }

  ngOnInit() {
    this.name = this.userService.getName();
    this.email = this.userService.getEmail();
    this.phone = this.userService.getPhone();
  }

  saveName() {
    this.httpService.updateName(this.userService.getUserId()!, this.userService.getPhone(), this.name).subscribe({
      error: (err) => {
        this.toastService.show('Erro ao salvar nome!');
        console.error(err);
      },
      complete: () => {
        this.toastService.show('Nome salvo com sucesso!');
        this.router.navigate(['/home']);
        this.userService.setName(this.name);
      }
    });
  }

  openModal() {
    return true;
  }

  closeModal() {
    this.modal.dismiss();
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