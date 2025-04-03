import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-coupons',
  templateUrl: './coupons.page.html',
  styleUrls: ['./coupons.page.scss'],
  standalone: false
})
export class CouponsPage implements OnInit {

  current = 1;

  constructor() { }

  ngOnInit() {
    const barOuter = document.querySelector(".bar-outer") as HTMLElement | null;
    const options = document.querySelectorAll<HTMLElement>(".bar-grey .option");

    options.forEach((option, i) => {
      (option as any).index = i + 1; // TypeScript does not allow adding properties dynamically
    });

    options.forEach((option) =>
      option.addEventListener("click", function () {
        if (!barOuter) return;
    
        barOuter.className = "bar-outer"; // Reset classes
        barOuter.classList.add(`pos${(option as any).index}`);
    
        if ((option as any).index > this.current) {
          barOuter.classList.add("right");
        } else if ((option as any).index < this.current) {
          barOuter.classList.add("left");
        }
    
        this.current = (option as any).index;
      }.bind(this))
    );
  }
}
