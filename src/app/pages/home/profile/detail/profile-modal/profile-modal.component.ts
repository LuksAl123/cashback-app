import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { faArrowLeft, faCommentSms, faEnvelope, faXmark } from '@fortawesome/free-solid-svg-icons';
import { HttpService } from 'src/app/services/http/http.service';
import { UserService } from 'src/app/services/user/user.service';
import { interval, map, Observable, scan, startWith, takeWhile } from 'rxjs';

@Component({
  selector: 'app-profile-modal',
  templateUrl: './profile-modal.component.html',
  styleUrls: ['./profile-modal.component.scss'],
  standalone: false
})

export class ProfileModalComponent implements OnInit {

  faXmark = faXmark;
  faCommentSms = faCommentSms;
  faEnvelope = faEnvelope;
  faArrowLeft = faArrowLeft;
  step: number = 1;
  email: string = this.userService.getEmail();

  name!: string;

  resendCountdown$!: Observable<number>;

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
    return this.modalCtrl.dismiss(null, 'confirm');
  }

  nextStep(method: string) {
    if (method === 'sms') {
      this.step = 2;
      this.startResend();
      this.sendSms();
    } else if (method === 'email') {
      this.step = 3;
      this.startResend();
      this.sendEmail();
    }
  }

  previousStep() {
    this.step = 1;
    this.stopResend();
  }

  private startResend() {
    this.resendCountdown$ = interval(1000).pipe(startWith(21),scan((acc) => acc - 1, 21),map(val => val < 0 ? 0 : val));
  }

  private stopResend() {
    this.resendCountdown$ = interval(0).pipe(takeWhile(() => false));
  }

  resendCode() {
    this.startResend();
    this.sendSms();
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