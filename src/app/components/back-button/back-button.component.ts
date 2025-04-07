import { Component, OnInit } from '@angular/core';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-back-button',
  templateUrl: './back-button.component.html',
  styleUrls: ['./back-button.component.scss'],
  standalone: false
})

export class BackButtonComponent implements OnInit {
  faArrowLeft = faArrowLeft;

  constructor() { }

  ngOnInit() {}

}
