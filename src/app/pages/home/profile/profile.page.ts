import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  faArrowRightFromBracket,
  faPencil,
  faRightLeft,
} from '@fortawesome/free-solid-svg-icons';
import { HttpService } from 'src/app/services/http/http.service';
import { ToastService } from 'src/app/services/toast/toast.service';
import { UserService } from 'src/app/services/user/user.service';
import { ProfileModalComponent } from './detail/profile-modal/profile-modal.component';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: false,
})
export class ProfilePage implements OnInit {
  faArrowRightFromBracket = faArrowRightFromBracket;
  faPencil = faPencil;
  faRightLeft = faRightLeft;

  name: string = '';
  email: string = '';
  phone: string = '';
  originalName: string = '';
  hasNameChanged: boolean = false;
  hasNameEverChanged: boolean = false;

  message: string = '';

  constructor(
    private router: Router,
    private userService: UserService,
    private httpService: HttpService,
    private toastService: ToastService,
    private modalCtrl: ModalController
  ) {}

  ngOnInit() {}

  ionViewWillEnter() {
    this.name = this.userService.getName();
    this.email = this.userService.getEmail();
    this.phone = this.userService.getPhone();
    this.originalName = this.name ?? '';
    this.hasNameChanged = false;
    this.hasNameEverChanged = false;
  }

  onNameChange(value: string) {
    const current = (value ?? '').trim();
    const original = (this.originalName ?? '').trim();
    this.hasNameChanged = current !== original;
    if (this.hasNameChanged) {
      this.hasNameEverChanged = true;
    }
  }

  saveName() {
    // Prevent saving if the name hasn't changed
    const current = (this.name ?? '').trim();
    const original = (this.originalName ?? '').trim();
    if (current === original) {
      this.toastService.show('O nome não foi alterado!', 'error');
      return;
    }

    this.httpService
      .updateName(
        this.userService.getUserId()!,
        this.userService.getPhone(),
        current
      )
      .subscribe({
        error: (err) => {
          this.toastService.show('Erro ao salvar nome!', 'error');
          console.error(err);
        },
        complete: () => {
          this.toastService.show('Nome salvo com sucesso!', 'success');
          this.router.navigate(['/home']);
          this.userService.setName(current);
          this.originalName = current;
          this.hasNameChanged = false;
          this.hasNameEverChanged = false;
        },
      });
  }

  async openModal(inputType: string) {
    const modal = await this.modalCtrl.create({
      component: ProfileModalComponent,
      cssClass: 'profile-modal',
    });

    modal.present();

    const { data, role } = await modal.onWillDismiss();

    if (role === 'confirm') {
      this.toastService.show('Verificação concluída!', 'success');
      if (inputType === 'email') {
        this.router.navigate(['/home/profile/change-email']);
      } else if (inputType === 'tel') {
        this.router.navigate(['/home/profile/change-phone']);
      }
    }
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
