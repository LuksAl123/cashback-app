import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { MaskitoElementPredicate, MaskitoOptions } from '@maskito/core';
import { faEye, faEyeSlash } from '@fortawesome/free-regular-svg-icons';
import { Router } from '@angular/router';
import { interval, Observable, startWith, scan, takeWhile, Subscription } from 'rxjs';
import { ApiService } from 'src/app/services/api/api.service';

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

  constructor(
    private fb: FormBuilder, 
    private router: Router,
    private apiService: ApiService,
    private renderer: Renderer2
  ) {}

  ngOnInit() {
    this.loginForm = this.fb.group({
      tel: ['', [Validators.required, Validators.minLength(10)]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    });

    this.signupForm = this.fb.group(
      {
        phone: ['', [Validators.required, Validators.minLength(10)]],
        verificationCode: ['', [Validators.required, Validators.minLength(4)]],
        name: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', Validators.required],
        referral: ['', Validators.required]
      },
      { validators: this.passwordsMatch }
    );

    this.resendCountdown$ = interval(1000).pipe(startWith(-1),takeWhile((v) => v >= 0));
  }

  ngOnDestroy() {
    this.countdownTrigger$?.unsubscribe();
  }

  switchToLogin() {
    this.signupStep = 1;
    this.signupForm.reset();
    const loginTabInput = document.getElementById('tab-1') as HTMLInputElement;
    if (loginTabInput) {
      this.renderer.setProperty(loginTabInput, 'checked', true);
    }
  }

  onLogin() {
    if (this.loginForm.invalid) return;
    // handle login logic…
    this.router.navigate(['/home']);
  }

  nextStep() {
    if (this.signupStep === 1 && this.signupForm.get('phone')?.invalid) {
      return;
    } else if (this.signupStep === 1 && this.signupForm.get('phone')?.invalid === false) {
      this.sendVerificationCode();
      this.signupStep++;
    };

    if (this.signupStep === 2 && this.signupForm.get('verificationCode')?.invalid) {
      return;
    } else if (this.signupStep === 2 && this.signupForm.get('verificationCode')?.invalid === false) {
      this.verifyCode() ? this.signupStep++ : null;
    };

    if (this.signupStep === 1) {
      this.startResend();
    }

    if (this.signupStep === 2) {
      this.resetCountdown();
    }
  }

  goBack(step: number) {
    this.signupStep = step;
    if (step === 1) {
      this.stopResend();
    }
    this.signupForm.reset();
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

  private resetCountdown() {
    this.resendCountdown$ = interval(1000).pipe(startWith(30), scan(acc => acc - 1, 30), takeWhile(v => v >= 0));
  }

  resendCode() {
    // simulate resend…
    this.startResend();
  }

  sendVerificationCode() {
    const rawPhone = this.signupForm.get('phone')?.value?.replace(/\D/g, '');
    this.apiService.sendVerificationCode(rawPhone).subscribe({
      error: (err) => {
        console.error('Failed to send verification code:', err);
      }
    });
  }

  verifyCode(): boolean {
    const enteredCode = this.signupForm.get('verificationCode')?.value;
    const receivedCode = this.apiService.verificationCode;
    if (enteredCode === receivedCode) {
      return true;
    } else {
      this.signupForm.get('verificationCode')?.setErrors({ incorrect: true });
      return false;
    }
  }
}




