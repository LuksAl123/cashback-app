import { Component, OnInit } from '@angular/core';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { NavigationService } from 'src/app/services/navigation/navigation.service';

@Component({
  selector: 'app-back-button',
  templateUrl: './back-button.component.html',
  styleUrls: ['./back-button.component.scss'],
  standalone: false
})

export class BackButtonComponent implements OnInit {
  faArrowLeft = faArrowLeft;

  constructor(private navigationService: NavigationService) {}

  ngOnInit() {}

  goBack() {
    const previousUrl = this.navigationService.getPreviousUrl();
    if (previousUrl) {
      this.navigationService.navigateTo(previousUrl);
    }
  }
}
