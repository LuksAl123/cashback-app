import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { faArrowRightFromBracket, faPencil, faRightLeft } from '@fortawesome/free-solid-svg-icons';
import { HttpService } from 'src/app/services/http/http.service';
import { ToastService } from 'src/app/services/toast/toast.service';
import { UserService } from 'src/app/services/user/user.service';
import { ProfileModalComponent } from './detail/profile-modal/profile-modal.component';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: false
})

export class ProfilePage implements OnInit {

  //method 1
  // @ViewChild(ProfileModalComponent) profileModalComponent!: ProfileModalComponent;

  faArrowRightFromBracket = faArrowRightFromBracket;
  faPencil = faPencil;
  faRightLeft = faRightLeft;

  name: string = '';
  email: string = '';
  phone: string = '';

  message: string = '';

  constructor(
    private router: Router,
    private userService: UserService,
    private httpService: HttpService,
    private toastService: ToastService,
    private modalCtrl: ModalController
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

  async openModal() {
    const modal = await this.modalCtrl.create({
      component: ProfileModalComponent,
      cssClass: 'profile-modal'
    });
    modal.present();

    const { data, role } = await modal.onWillDismiss();

    if (role === 'confirm') {
      this.message = `Hello, ${data}!`;
    }
  }

  //method 1
  // open() {
  //   this.profileModalComponent.openModal();
  // }

  //method 2
  // isModalOpen = false;

  // open() {
  //   this.isModalOpen = true;
  // }

  // onModalClosed() {
  //   this.isModalOpen = false;
  // }

  logout() {
    localStorage.removeItem('sessionActive');
    if (localStorage.getItem('rememberPasswordChecked') === 'true') {
    } else {
      this.userService.clearUserData();
    }
    this.router.navigate(['/login-signup']);
  }
}