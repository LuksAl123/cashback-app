import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-filter-extracts-modal',
  templateUrl: './filter-extracts-modal.component.html',
  styleUrls: ['./filter-extracts-modal.component.scss'],
  standalone: false
})

export class FilterExtractsModalComponent {
  constructor(private modalCtrl: ModalController) {}

  dismiss() {
    this.modalCtrl.dismiss();
  }
}
