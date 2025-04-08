import { Component, OnInit } from '@angular/core';
import { faEye } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-per-establishment',
  templateUrl: './per-establishment.page.html',
  styleUrls: ['./per-establishment.page.scss'],
  standalone: false
})

export class PerEstablishmentPage implements OnInit {

  faEye = faEye;

  constructor() { }

  ngOnInit() {
  }

}
