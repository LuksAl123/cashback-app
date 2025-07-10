import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { CouponFilterService } from 'src/app/services/coupon-filter/coupon-filter.service';

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

  constructor(
    private couponFilterService: CouponFilterService
  ) {}

  ngOnInit() {
  }

  ngAfterViewInit() {
    setTimeout(() => {
      const firstSegment = document.querySelector('.segment');
      if (firstSegment) {
        firstSegment.classList.add('segment-active');
      }
      this.updateIndicatorPosition(this.activeSegment);
      this.resizeListener = this.handleResize.bind(this);
      window.addEventListener('resize', this.resizeListener);
    }, 50);
  }

  ngOnDestroy() {
    if (this.resizeListener) {
      window.removeEventListener('resize', this.resizeListener);
    }
  }

  private handleResize(): void {
    this.updateIndicatorPosition(this.activeSegment);
  }

  selectSegment(event: any, index: number): void {
    this.activeSegment = index;

    const segmentButtons = document.querySelectorAll('.segment');
    segmentButtons.forEach(button => {
      button.classList.remove('segment-active');
    });
    event.target.classList.add('segment-active');
    this.updateIndicatorPosition(index);
    const filter = this.couponFilterService.setFilter(index);
    console.log(filter);
  }

  private updateIndicatorPosition(index: number): void {
    const segments = document.querySelectorAll('.segment');
    const indicator = document.querySelector('.segment-indicator') as HTMLElement;
    const container = document.querySelector('.segmented-control') as HTMLElement;

    if (!segments.length || !indicator || !container) return;

    const selectedSegment = segments[index] as HTMLElement;
    const segmentRect = selectedSegment.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();
    const width = segmentRect.width;
    const leftPosition = segmentRect.left - containerRect.left;

    indicator.style.width = `${width - 4}px`;
    indicator.style.left = `${leftPosition + 2}px`;
    indicator.style.transform = 'none';

    if (index === segments.length - 1) {
      const rightEdge = containerRect.right - 2;
      const indicatorRight = leftPosition + width;
      if (indicatorRight < rightEdge) {
        indicator.style.width = `${width - 2}px`;
      }
    }
  }
}
