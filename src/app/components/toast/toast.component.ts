import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-toast',
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.scss'],
  standalone: false
})

export class ToastComponent implements OnInit {
  private _message: string = '';

  @Input()

  set message(val: string) {
    this._message = val ? val.replace(/^\s*-\s*/, '') : '';
  }

  get message(): string {
    return this._message;
  }

  @Input() type: 'success' | 'error' | 'info' = 'info';
  @Input() visible: boolean = false;
  @Input() closable: boolean = false;

  constructor() { }

  ngOnInit(): void {}
}
