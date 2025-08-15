import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { faArrowLeft, faCommentSms, faEnvelope, faXmark } from '@fortawesome/free-solid-svg-icons';
import { HttpService } from 'src/app/services/http/http.service';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-profile-modal',
  templateUrl: './profile-modal.component.html',
  styleUrls: ['./profile-modal.component.scss'],
  standalone: false
})

export class ProfileModalComponent implements OnInit {

  //method 1 and 2
  // @ViewChild('modal', { static: false}) modal!: IonModal;

  faXmark = faXmark;
  faCommentSms = faCommentSms;
  faEnvelope = faEnvelope;
  faArrowLeft = faArrowLeft;
  step: number = 1;
  email: string = this.userService.getEmail();

  name!: string;

  //method 2
  // @Input() open = false;
  // @Output() closed = new EventEmitter<void>();

  // ngOnChanges(changes: SimpleChanges) {
  //   if (changes['open'] && changes['open'].currentValue) {
  //     this.modal.present();
  //   }
  // }

  constructor(
    private httpService: HttpService,
    private userService: UserService,
    private modalCtrl: ModalController
  ) { }

  ngOnInit() { }

  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

  confirm() {
    return this.modalCtrl.dismiss(this.name, 'confirm');
  }

  //method 1
  // openModal() {
  //   this.modal.present();
  // }

  // closeModal() {
  //   this.modal.dismiss();
  // }

  //method 2
  // closeModal() {
  //   this.modal.dismiss();
  //   this.closed.emit();
  // }

  nextStep(method: string) {
    if (method === 'sms') {
      this.step = 2;
      console.log(this.step)
      this.sendSms();
    } else if (method === 'email') {
      this.step = 3;
      console.log(this.step)
      this.sendEmail();
    }
  }

  sendSms() {
    this.httpService.changePhone(this.userService.getPhone()).subscribe({
      error: (err) => {
        console.log(err);
      }
    })
  }

  sendEmail() {
    this.httpService.changeEmail(this.userService.getEmail()).subscribe({
      error: (err) => {
        console.log(err);
      }
    })
  }
}