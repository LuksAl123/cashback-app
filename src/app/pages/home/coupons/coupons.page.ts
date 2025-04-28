import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-coupons',
  templateUrl: './coupons.page.html',
  styleUrls: ['./coupons.page.scss'],
  standalone: false
})

export class CouponsPage implements OnInit, AfterViewInit, OnDestroy {
  
  isCouponLoading: boolean = true;

  activeSegment: number = 0;
  private resizeListener: any = null;

  constructor() {}

  ngOnInit() {
  }

  ngAfterViewInit() {
    setTimeout(() => {
      const firstSegment = document.querySelector('.segment');
      if (firstSegment) {
        firstSegment.classList.add('segment-active');
      }

      // Position the indicator initially
      this.updateIndicatorPosition(this.activeSegment);
      
      // Add resize listener
      this.resizeListener = this.handleResize.bind(this);
      window.addEventListener('resize', this.resizeListener);
    }, 50);
  }
  
  ngOnDestroy() {
    // Remove resize listener
    if (this.resizeListener) {
      window.removeEventListener('resize', this.resizeListener);
    }
  }
  
  private handleResize(): void {
    this.updateIndicatorPosition(this.activeSegment);
  }

  selectSegment(event: any, index: number): void {
    // Update the active segment
    this.activeSegment = index;

    // Get all segment buttons
    const segmentButtons = document.querySelectorAll('.segment');

    // Remove active class from all buttons
    segmentButtons.forEach(button => {
      button.classList.remove('segment-active');
    });

    // Add active class to the selected button
    event.target.classList.add('segment-active');

    // Update indicator position
    this.updateIndicatorPosition(index);
  }
  
  private updateIndicatorPosition(index: number): void {
    const segments = document.querySelectorAll('.segment');
    const indicator = document.querySelector('.segment-indicator') as HTMLElement;
    const container = document.querySelector('.segmented-control') as HTMLElement;
    
    if (!segments.length || !indicator || !container) return;
  
    // Get the selected segment and its dimensions
    const selectedSegment = segments[index] as HTMLElement;
    const segmentRect = selectedSegment.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();
    
    // Calculate the exact width and position
    const width = segmentRect.width;
    
    // Calculate exact left position relative to container
    // Subtract container's left position to get the relative position
    const leftPosition = segmentRect.left - containerRect.left;
  
    // Apply the exact dimensions with a small adjustment for padding
    indicator.style.width = `${width - 4}px`; // -4px for the padding
    indicator.style.left = `${leftPosition + 2}px`; // +2px for the left padding
    indicator.style.transform = 'none'; // Remove transform as we're using absolute positioning
    
    // Handle right edge special case
    if (index === segments.length - 1) {
      const rightEdge = containerRect.right - 2; // -2px for right padding
      const indicatorRight = leftPosition + width;
      
      if (indicatorRight < rightEdge) {
        // Adjust width to reach right edge properly
        indicator.style.width = `${width - 2}px`; // -2px for right padding
      }
    }
  }
}
