import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { trigger, transition, style, animate } from '@angular/animations';
import { GlobalService } from 'src/app/services/global/global.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
  animations: [
    trigger('routeAnimation', [
      transition('forward => *', [
        style({ opacity: 0, transform: 'translateX(40px)' }),
        animate('400ms ease', style({ opacity: 1, transform: 'none' }))
      ]),
      transition('backward => *', [
        style({ opacity: 0, transform: 'translateX(-40px)' }),
        animate('400ms ease', style({ opacity: 1, transform: 'none' }))
      ]),
      transition(':leave', [
        animate('400ms ease', style({ opacity: 0 }))
      ])
    ])
  ],
  standalone: false
})

export class ForgotPasswordPage implements OnInit {

  animationDirection = 'forward';

  forgotPasswordForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private global: GlobalService
  ) { }

  ngOnInit() {
    this.animationDirection = this.global.direction;
    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onSubmit() {
    if (this.forgotPasswordForm.invalid) return;
    alert('Password reset link sent (mock).');
  }

}