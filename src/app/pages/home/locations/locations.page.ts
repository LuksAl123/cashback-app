import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-locations',
  templateUrl: './locations.page.html',
  styleUrls: ['./locations.page.scss'],
  standalone: false
})

export class LocationsPage implements OnInit {

  constructor() {}

  ngOnInit() {
  }

  // async selectLocation() {
  //   try {
  //     const options = {
  //       component: BottomSheetComponent,
  //       // componentProps: { [key: string]: any },
  //       showBackdrop: false,
  //       backdropDismiss: true,
  //       cssClass: 'bottom-sheet-modal',
  //       animated: true,
  //       canDismiss: false,
  //       mode: 'md',
  //       keyboardClose: true,
  //       breakpoints: [0.3, 0.6, 0.95],
  //       initialBreakpoint: 0.6,
  //       handle: true,
  //       // swipeToClose: true,
  //     };
  //     await this.global.createModal(options);
  //   } catch(e) {
  //     console.log(e);
  //   }
  // }

}
