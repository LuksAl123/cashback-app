import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
  animations: [
    trigger('routeAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(40px)' }),
        animate('400ms ease', style({ opacity: 1, transform: 'none' }))
      ]),
      transition(':leave', [
        animate('400ms ease', style({ opacity: 0, transform: 'translateX(-40px)' }))
      ])
    ])
  ],
  standalone: false
})

export class ForgotPasswordPage implements OnInit {
  forgotPasswordForm!: FormGroup;

  constructor(private fb: FormBuilder, private router: Router) { }

  ngOnInit() {
    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onSubmit() {
    if (this.forgotPasswordForm.invalid) return;
    alert('Password reset link sent (mock).');
  }

  goBackToLogin() {
    this.router.navigate(['/login-signup']);
  }
}