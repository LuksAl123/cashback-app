import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss'],
  standalone: false
})

export class DetailsComponent {

  @Input() data: any;

}