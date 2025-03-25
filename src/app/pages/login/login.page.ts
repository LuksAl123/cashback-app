import { Component, OnInit } from '@angular/core';
import { MaskitoElementPredicate, MaskitoOptions } from '@maskito/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false
})

export class LoginPage implements OnInit {

  readonly phoneMask: MaskitoOptions = {
    mask: ['(', /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/],
  };

  readonly maskPredicate: MaskitoElementPredicate = async (el) => (el as HTMLIonInputElement).getInputElement();

  constructor() { }

  ngOnInit() {
  }

}
