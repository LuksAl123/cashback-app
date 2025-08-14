import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-profile-modal',
  templateUrl: './profile-modal.component.html',
  styleUrls: ['./profile-modal.component.scss'],
  standalone: false
})

export class ProfileModalComponent  implements OnInit {

  @Input() openModal: boolean = false;

  constructor() { }

  ngOnInit() {}

}