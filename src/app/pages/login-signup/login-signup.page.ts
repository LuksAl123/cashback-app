import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { MaskitoElementPredicate, MaskitoOptions } from '@maskito/core';
import { faEye, faEyeSlash } from '@fortawesome/free-regular-svg-icons';
import { Router } from '@angular/router';
import { interval, Observable, startWith, scan, takeWhile, Subscription } from 'rxjs';

@Component({
  selector: 'app-login-signup',
  templateUrl: './login-signup.page.html',
  styleUrls: ['./login-signup.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false
})

export class LoginPage implements OnInit, OnDestroy {

  faEye = faEye;
  faEyeSlash = faEyeSlash;

  loginForm!: FormGroup;
  signupForm!: FormGroup;

  mode: 'login' | 'signup' = 'login';
  signupStep = 1;
  showLoginPassword = false;
  showSignupPassword = false;

  resendCountdown$!: Observable<number>;
  private countdownTrigger$!: Subscription;

  readonly phoneMask: MaskitoOptions = {
    mask: ['(', /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/],
  };

  readonly maskPredicate: MaskitoElementPredicate = async (el) =>
    (el as HTMLIonInputElement).getInputElement();

  constructor(private fb: FormBuilder, private router: Router) {}

  ngOnInit() {
    this.loginForm = this.fb.group({
      tel: ['', [Validators.required, Validators.minLength(10)]],
      password: ['', [Validators.required, Validators.minLength(8)]],
    });

    this.signupForm = this.fb.group(
      {
        phone: ['', [Validators.required, Validators.minLength(10)]],
        verificationCode: ['', [Validators.required, Validators.minLength(4)]],
        name: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', Validators.required],
        referral: ['', Validators.required],
      },
      { validators: this.passwordsMatch }
    );

    this.resendCountdown$ = interval(1000).pipe(startWith(-1),takeWhile((v) => v >= 0));
  }

  ngOnDestroy() {
    this.countdownTrigger$?.unsubscribe();
  }

  switchToLogin() {
    this.mode = 'login';
    this.signupStep = 1;
  }

  switchToSignup() {
    this.mode = 'signup';
    this.signupStep = 1;
  }

  onLogin() {
    if (this.loginForm.invalid) return;
    // handle login logic…
    this.router.navigate(['/home']);
  }

  nextStep() {
    if (this.signupStep === 1 && this.signupForm.get('phone')?.invalid) return;
    if (this.signupStep === 2 && this.signupForm.get('verificationCode')?.invalid) return;
    if (this.signupStep === 1) {
      this.startResend();
    }
    this.signupStep++;
  }

  goBack(step: number) {
    this.signupStep = step;
    if (step === 1) {
      this.stopResend();
    }
  }

  toggleLoginPassword() {
    this.showLoginPassword = !this.showLoginPassword;
  }

  toggleSignupPassword() {
    this.showSignupPassword = !this.showSignupPassword;
  }

  submitRegistration() {
    if (this.signupForm.invalid) return;
    // handle registration…
    this.router.navigate(['/home']);
  }

  private passwordsMatch(group: AbstractControl) {
    const pass = group.get('password')!.value;
    const confirm = group.get('confirmPassword')!.value;
    return pass === confirm ? null : { mismatch: true };
  }

  private startResend() {
    this.resendCountdown$ = interval(1000).pipe(startWith(30),scan((acc) => acc - 1, 30),takeWhile((val) => val >= 0));
  }

  private stopResend() {
    this.resendCountdown$ = interval(0).pipe(takeWhile(() => false));
  }

  resendCode() {
    // simulate resend…
    this.startResend();
  }
}


