import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
  Renderer2,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
} from '@angular/forms';
import { MaskitoElementPredicate, MaskitoOptions } from '@maskito/core';
import { faEye, faEyeSlash } from '@fortawesome/free-regular-svg-icons';
import { Router } from '@angular/router';
import {
  interval,
  Observable,
  startWith,
  scan,
  takeWhile,
  Subscription,
} from 'rxjs';
import { HttpService } from 'src/app/services/http/http.service';
import { ToastService } from 'src/app/services/toast/toast.service';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-login-signup',
  templateUrl: './login-signup.page.html',
  styleUrls: ['./login-signup.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class LoginPage implements OnInit, OnDestroy {
  faEye = faEye;
  faEyeSlash = faEyeSlash;

  loginForm!: FormGroup;
  signupForm!: FormGroup;

  signupStep = 1;
  showLoginPassword = false;
  showSignupPassword = false;

  wrongCode: boolean = false;

  resendCountdown$!: Observable<number>;
  private countdownTrigger$!: Subscription;

  readonly phoneMask: MaskitoOptions = {
    mask: [
      '(',
      /\d/,
      /\d/,
      ')',
      ' ',
      /\d/,
      /\d/,
      /\d/,
      /\d/,
      /\d/,
      '-',
      /\d/,
      /\d/,
      /\d/,
      /\d/,
    ],
  };

  readonly maskPredicate: MaskitoElementPredicate = async (el) =>
    (el as HTMLIonInputElement).getInputElement();

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private httpService: HttpService,
    private renderer: Renderer2,
    private toastService: ToastService,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.loginForm = this.fb.group({
      tel: [
        this.userService.getPhone(),
        [Validators.required, Validators.minLength(10)],
      ],
      password: [
        this.userService.getPassword(),
        [Validators.required, Validators.minLength(4)],
      ],
      rememberPassword: [this.userService.getRememberPasswordChecked()],
    });

    this.signupForm = this.fb.group(
      {
        phone: ['', [Validators.required, Validators.minLength(10)]],
        verificationCode: ['', [Validators.required, Validators.minLength(4)]],
        name: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(4)]],
        confirmPassword: ['', Validators.required],
        referral: ['', Validators.required],
      },
      { validators: this.passwordsMatch }
    );
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
    this.loginForm
      .get('tel')
      ?.setValue(this.formatPhone(this.loginForm.get('tel')?.value));
    this.httpService.loginUser(this.loginForm.value).subscribe({
      next: (response) => {
        if (response.codmensagem === 2) {
          this.router.navigate(['/home']);
          this.setLoginData(response.detalhe);
          if (response.detalhe && response.detalhe.id) {
            this.userService.setUserId(response.detalhe.id);
          }

          if (this.loginForm.value.rememberPassword) {
            this.userService.setPassword(this.loginForm.value.password);
            this.userService.setPhone(this.loginForm.value.tel);
          } else {
            this.userService.clearUserData();
          }
        } else {
          this.toastService.show(response.mensagem, 'error');
        }
      },
      error: (err) => {
        let errorMsg = 'Erro ao fazer login. Tente novamente.';
        if (err?.error?.message) {
          errorMsg = err.error.message;
        } else if (err?.message) {
          errorMsg = err.message;
        } else if (typeof err === 'string') {
          errorMsg = err;
        }
        this.toastService.show(errorMsg, 'error');
      },
    });
  }

  setLoginData(data: any) {
    localStorage.setItem('sessionActive', 'true');
    this.userService.setName(data.nome);
    this.userService.setEmail(data.email);
    this.userService.setPhone(data.tel);
  }

  nextStep() {
    if (this.signupStep === 1 && this.signupForm.get('phone')?.invalid) {
      return;
    } else if (
      this.signupStep === 1 &&
      this.signupForm.get('phone')?.invalid === false
    ) {
      this.sendVerificationCode();
      this.startResend();
      this.signupStep++;
    }

    if (
      this.signupStep === 2 &&
      this.signupForm.get('verificationCode')?.invalid
    ) {
      return;
    } else if (
      this.signupStep === 2 &&
      this.signupForm.get('verificationCode')?.invalid === false
    ) {
      this.verifyCode() ? this.signupStep++ : null;
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
    this.signupForm
      .get('phone')
      ?.setValue(this.formatPhone(this.signupForm.get('phone')?.value));
    this.httpService.registerUser(this.signupForm.value).subscribe({
      next: (response) => {
        this.router.navigate(['/home']);
      },
      error: (err) => {
        let errorMsg = 'Erro ao registrar. Tente novamente.';
        if (err?.error?.message) {
          errorMsg = err.error.message;
        } else if (err?.message) {
          errorMsg = err.message;
        } else if (typeof err === 'string') {
          errorMsg = err;
        }
        this.toastService.show(errorMsg, 'error');
      },
    });
  }

  private passwordsMatch(group: AbstractControl) {
    const pass = group.get('password')!.value;
    const confirm = group.get('confirmPassword')!.value;
    return pass === confirm ? null : { mismatch: true };
  }

  private startResend() {
    this.resendCountdown$ = interval(1000).pipe(
      startWith(31),
      scan((acc) => acc - 1, 31),
      takeWhile((val) => val >= 0)
    );
  }

  private stopResend() {
    this.resendCountdown$ = interval(0).pipe(takeWhile(() => false));
  }

  resendCode() {
    this.startResend();
    this.sendVerificationCode();
  }

  sendVerificationCode() {
    const rawPhone = this.formatPhone(this.signupForm.get('phone')?.value);
    this.httpService.sendVerificationCode(rawPhone).subscribe({
      error: (err) => {
        console.error('Failed to send verification code:', err);
      },
    });
  }

  private formatPhone(phone: string): string {
    return phone.replace(/\D/g, '');
  }

  verifyCode(): boolean {
    const enteredCode = this.signupForm.get('verificationCode')?.value;
    const receivedCode = this.httpService.verificationCode;
    if (enteredCode === receivedCode) {
      this.wrongCode = false;
      return true;
    } else {
      this.wrongCode = true;
      this.signupForm.get('verificationCode')?.setErrors({ incorrect: true });
      return false;
    }
  }

  goToForgotPassword() {
    this.router.navigate(['/login-signup/forgot-password']);
  }
}
