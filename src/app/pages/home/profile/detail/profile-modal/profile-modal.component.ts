import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import {
  faArrowLeft,
  faCommentSms,
  faEnvelope,
  faXmark,
} from '@fortawesome/free-solid-svg-icons';
import { HttpService } from 'src/app/services/http/http.service';
import { UserService } from 'src/app/services/user/user.service';
import { interval, map, Observable, scan, startWith, takeWhile } from 'rxjs';
import { ToastService } from 'src/app/services/toast/toast.service';

@Component({
  selector: 'app-profile-modal',
  templateUrl: './profile-modal.component.html',
  styleUrls: ['./profile-modal.component.scss'],
  standalone: false,
})
export class ProfileModalComponent implements OnInit {
  verificationCode: string = '';

  faXmark = faXmark;
  faCommentSms = faCommentSms;
  faEnvelope = faEnvelope;
  faArrowLeft = faArrowLeft;
  step: number = 1;
  email: string = this.userService.getEmail();

  method: string = '';

  name!: string;

  resendCountdown$!: Observable<number>;

  constructor(
    private httpService: HttpService,
    private userService: UserService,
    private modalCtrl: ModalController,
    private toastService: ToastService
  ) {}

  ngOnInit() {}

  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

  confirm() {
    if (this.verificationCode === this.httpService.verificationCode) {
      this.userService.setVerificationCode(this.verificationCode);
      return this.modalCtrl.dismiss(null, 'confirm');
    } else {
      this.toastService.show('Código de verificação incorreto', 'error');
      return undefined;
    }
  }

  nextStep(method: string) {
    if (method === 'sms') {
      this.step = 2;
      this.startResend();
      this.sendSms();
    } else if (method === 'email') {
      this.step = 2;
      this.startResend();
      this.sendEmail();
    }
  }

  previousStep() {
    this.step = 1;
    this.stopResend();
  }

  private startResend() {
    this.resendCountdown$ = interval(1000).pipe(
      startWith(21),
      scan((acc) => acc - 1, 21),
      map((val) => (val < 0 ? 0 : val))
    );
  }

  private stopResend() {
    this.resendCountdown$ = interval(0).pipe(takeWhile(() => false));
  }

  resendCode() {
    this.startResend();
    this.sendSms();
  }

  sendSms() {
    this.httpService.sendSMS(this.userService.getPhone()).subscribe({
      error: (err) => {
        console.log(err);
      },
    });
  }

  sendEmail() {
    this.httpService.sendEmail(this.userService.getEmail()).subscribe({
      error: (err) => {
        console.log(err);
      },
    });
  }
}
