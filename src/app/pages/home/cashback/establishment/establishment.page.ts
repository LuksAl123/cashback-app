import { Component, OnInit } from '@angular/core';
import { faPhone, faEnvelope } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-establishment',
  templateUrl: './establishment.page.html',
  styleUrls: ['./establishment.page.scss'],
  standalone: false
})

export class EstablishmentPage implements OnInit {

  faPhone = faPhone;
  faEnvelope = faEnvelope;
  
  constructor() { }

  ngOnInit() {
  }
}
