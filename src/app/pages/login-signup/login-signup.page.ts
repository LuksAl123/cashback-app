import { Component, OnInit } from '@angular/core';
import { MaskitoElementPredicate, MaskitoOptions } from '@maskito/core';
import { faEye, faEyeSlash } from '@fortawesome/free-regular-svg-icons';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-signup',
  templateUrl: './login-signup.page.html',
  styleUrls: ['./login-signup.page.scss'],
  standalone: false
})

export class LoginPage implements OnInit {

  faEye = faEye;
  faEyeSlash = faEyeSlash;

  readonly phoneMask: MaskitoOptions = {
    mask: ['(', /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/],
  };

  readonly maskPredicate: MaskitoElementPredicate = async (el) => (el as HTMLIonInputElement).getInputElement();

  signupStep: number = 1;
  resendCountdown: number = 30;
  resendInterval: any;

  signupData = {
    phone: '',
    verificationCode: '',
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    referral: ''
  };

  formErrors = {
    phone: false,
    verificationCode: false,
    name: false,
    email: false,
    password: false,
    confirmPassword: false,
    referral: false
  };

  constructor(private router: Router) {}

  ngOnInit() {}

  togglePasswordVisibility(field: string) {
    const inputElement = document.querySelector(`ion-input[name="${field}"]`) as HTMLIonInputElement;

    if (inputElement) {
      const currentType = inputElement.type;
      inputElement.type = currentType === 'password' ? 'text' : 'password';
      this.faEye = currentType === 'password' ? this.faEyeSlash : this.faEye;
    }
  }

  goToNextStep(event: Event) {
    event.preventDefault();

    // Validation for each step
    if (this.signupStep === 1) {
      if (!this.validateStep1()) {
        return;
      }
      // Start countdown for verification code
      this.startResendCountdown();
    } else if (this.signupStep === 2) {
      if (!this.validateStep2()) {
        return;
      }
      // Clear countdown timer when moving to step 3
      this.clearResendCountdown();
    }

    this.signupStep++;
  }

  goBackToStep(step: number) {
    this.signupStep = step;

    // If going back to step 1, clear countdown
    if (step === 1) {
      this.clearResendCountdown();
    }
  }

  goToLogin() {
    const radioButton = document.getElementById('tab-1') as HTMLInputElement;
    if (radioButton) {
      radioButton.checked = true;
    }
  }

  // Validation methods
  validateStep1(): boolean {
    if (!this.signupData.phone || this.signupData.phone.length < 10) {
      this.formErrors.phone = true;
      return false;
    }

    this.formErrors.phone = false;
    return true;
  }

  validateStep2(): boolean {
    if (!this.signupData.verificationCode || this.signupData.verificationCode.length < 4) {
      this.formErrors.verificationCode = true;
      return false;
    }

    this.formErrors.verificationCode = false;
    return true;
  }

  validateStep3(): boolean {
    let isValid = true;

    if (!this.signupData.name) {
      this.formErrors.name = true;
      isValid = false;
    } else {
      this.formErrors.name = false;
    }

    if (!this.signupData.email || !this.validateEmail(this.signupData.email)) {
      this.formErrors.email = true;
      isValid = false;
    } else {
      this.formErrors.email = false;
    }

    if (!this.signupData.password || this.signupData.password.length < 6) {
      this.formErrors.password = true;
      isValid = false;
    } else {
      this.formErrors.password = false;
    }

    if (!this.signupData.confirmPassword || this.signupData.password !== this.signupData.confirmPassword) {
      this.formErrors.confirmPassword = true;
      isValid = false;
    } else {
      this.formErrors.confirmPassword = false;
    }

    if (!this.signupData.referral) {
      this.formErrors.referral = true;
      isValid = false;
    } else {
      this.formErrors.referral = false;
    }

    return isValid;
  }

  validateEmail(email: string): boolean {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(email.toLowerCase());
  }

  // Verification code methods
  startResendCountdown() {
    this.resendCountdown = 30;

    this.clearResendCountdown(); // Clear any existing interval

    this.resendInterval = setInterval(() => {
      this.resendCountdown--;

      if (this.resendCountdown <= 0) {
        this.clearResendCountdown();
      }
    }, 1000);
  }

  clearResendCountdown() {
    if (this.resendInterval) {
      clearInterval(this.resendInterval);
      this.resendInterval = null;
    }
  }

  resendCode() {
    if (this.resendCountdown <= 0) {
      // Simulate code resend
      console.log('Resending verification code to', this.signupData.phone);
      this.startResendCountdown();
    }
  }

  // Final form submission
  submitRegistration(event: Event) {
    event.preventDefault();

    if (!this.validateStep3()) {
      return;
    }

    // Handle successful registration
    console.log('Registration data:', this.signupData);
    this.router.navigate(['/home']);
  }

}
