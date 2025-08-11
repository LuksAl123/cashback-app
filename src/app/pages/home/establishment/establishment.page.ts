import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { faPhone, faEnvelope } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-establishment',
  templateUrl: './establishment.page.html',
  styleUrls: ['./establishment.page.scss'],
  standalone: false
})

export class EstablishmentPage implements OnInit {
  
  establishmentId = signal('');

  faPhone = faPhone;
  faEnvelope = faEnvelope;
  
  constructor(private route: ActivatedRoute) {
    this.route.params.subscribe((params) => {
      this.establishmentId.set(params['id']);
    });
    console.log(this.establishmentId);
  }

  ngOnInit() { }
}