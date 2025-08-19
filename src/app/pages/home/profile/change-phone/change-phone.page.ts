import { Component, OnInit } from '@angular/core';
import { HttpService } from 'src/app/services/http/http.service';

@Component({
  selector: 'app-change-phone',
  templateUrl: './change-phone.page.html',
  styleUrls: ['./change-phone.page.scss'],
  standalone: false
})

export class ChangePhonePage implements OnInit {

  phone: string = "";

  constructor(private httpService: HttpService) { }

  ngOnInit() {
  }

  changePhone() {
    this.httpService.changePhone(this.phone).subscribe({
      error: (err) => {
        console.log(err);
      }
    })
  }
}