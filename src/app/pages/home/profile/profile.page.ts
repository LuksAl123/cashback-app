import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { faArrowRightFromBracket } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: false
})

export class ProfilePage implements OnInit {

  faArrowRightFromBracket = faArrowRightFromBracket;

  constructor(private router: Router) { }

  ngOnInit() {
  }

  logout() {
    localStorage.removeItem('sessionActive');
    if (localStorage.getItem('rememberPasswordChecked') === 'true') {
    } else {
      localStorage.removeItem('rememberedPhone');
      localStorage.removeItem('rememberedPassword');
    }
    this.router.navigate(['/login-signup']);
  }

}
