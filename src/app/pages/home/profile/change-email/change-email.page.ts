import { Component, OnInit } from '@angular/core';
import { HttpService } from 'src/app/services/http/http.service';

@Component({
  selector: 'app-change-email',
  templateUrl: './change-email.page.html',
  styleUrls: ['./change-email.page.scss'],
  standalone: false
})

export class ChangeEmailPage implements OnInit {

  email: string = "";

  constructor(private httpService: HttpService) { }

  ngOnInit() {
  }

  changeEmail() {
    this.httpService.changeEmail(this.email).subscribe({
      error: (err) => {
        console.log(err);
      }
    })
  }

}