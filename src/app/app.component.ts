import { Component } from '@angular/core';
import { ToastService } from './services/toast/toast.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: false,
})

export class AppComponent {

  toast: any;

  constructor(private toastService: ToastService) {
    this.toastService.toast$.subscribe(t => this.toast = t);
  }
}
