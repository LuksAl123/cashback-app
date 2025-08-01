import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpService } from 'src/app/services/http/http.service';
import { ToastService } from 'src/app/services/toast/toast.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
  standalone: false
})

export class ForgotPasswordPage implements OnInit {

  forgotPasswordForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private httpService: HttpService,
    private toastService: ToastService
  ) { }

  ngOnInit() {
    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onSubmit() {
    if (this.forgotPasswordForm.invalid) return;
    this.httpService.recoverPassword(this.forgotPasswordForm.value).subscribe({
      next: (response) => {
        this.toastService.show(response.mensagem, 'success');
      },
      error: (error) => {
        console.error(error);
      }
    });
  }
}