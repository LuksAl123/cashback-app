import { Component, OnInit, ElementRef, ViewChild, AfterViewInit, HostListener } from '@angular/core';
import { gsap } from 'gsap';
import { Draggable } from 'gsap/Draggable';

interface Coupon {
  id: number;
  title: string;
  discount: string;
  originalPrice: number;
  discountedPrice: number;
  isSelected: boolean;
}

@Component({
  selector: 'app-bottom-sheet',
  templateUrl: './bottom-sheet.component.html',
  styleUrls: ['./bottom-sheet.component.scss'],
  standalone: false 
})

export class BottomSheetComponent implements OnInit, AfterViewInit {
  @ViewChild('bottomSheet') bottomSheet!: ElementRef;
  @ViewChild('sheetContent') sheetContent!: ElementRef;
  @ViewChild('header') header!: ElementRef;
  @ViewChild('couponsList') couponsList!: ElementRef;
  @ViewChild('button') button!: ElementRef;

  coupons: Coupon[] = [
    { id: 1, title: 'Comfort', discount: 'R$ 11,50', originalPrice: 22.99, discountedPrice: 11.49, isSelected: true },
    { id: 2, title: 'UberX', discount: 'R$ 8,97', originalPrice: 17.94, discountedPrice: 8.97, isSelected: false },
    { id: 3, title: 'Prioridade', discount: 'R$ 12,59', originalPrice: 25.18, discountedPrice: 12.59, isSelected: false },
    { id: 4, title: 'Black', discount: 'R$ 38,57', originalPrice: 77.14, discountedPrice: 38.57, isSelected: false },
    { id: 5, title: 'Comfort1', discount: 'R$ 11,50', originalPrice: 22.99, discountedPrice: 11.49, isSelected: false },
    { id: 6, title: 'UberX', discount: 'R$ 8,97', originalPrice: 17.94, discountedPrice: 8.97, isSelected: false },
    { id: 7, title: 'Prioridade', discount: 'R$ 12,59', originalPrice: 25.18, discountedPrice: 12.59, isSelected: false },
    { id: 8, title: 'Black', discount: 'R$ 38,57', originalPrice: 77.14, discountedPrice: 38.57, isSelected: false },
    { id: 9, title: 'Comfort2', discount: 'R$ 11,50', originalPrice: 22.99, discountedPrice: 11.49, isSelected: false },
    { id: 10, title: 'UberX', discount: 'R$ 8,97', originalPrice: 17.94, discountedPrice: 8.97, isSelected: false },
    { id: 11, title: 'Prioridade', discount: 'R$ 12,59', originalPrice: 25.18, discountedPrice: 12.59, isSelected: false },
    { id: 12, title: 'Black', discount: 'R$ 38,57', originalPrice: 77.14, discountedPrice: 38.57, isSelected: false }
  ];

  // Breakpoints (as percentage of window height)
  readonly EXPANDED_BREAKPOINT = 0.95;
  readonly DEFAULT_BREAKPOINT = 0.6;
  readonly MIN_BREAKPOINT = 0.3; // Will be dynamically adjusted based on content
  readonly SNAP_TOLERANCE = 0.15;

  windowHeight = window.innerHeight;
  isDragging = false;
  currentBreakpoint = this.DEFAULT_BREAKPOINT;
  draggableInstance: any;
  actualMinBreakpoint = this.MIN_BREAKPOINT;
  isScrollEnabled = false;
  lastDragDirection = 0; // 1 for up, -1 for down, 0 for no drag
  previousY = 0;
  isDraggingBelowMin = false;

  constructor() {
    gsap.registerPlugin(Draggable);
  }

  ngOnInit(): void {
    // First coupon is selected by default
    this.selectCoupon(this.coupons[0]);
  }

  ngAfterViewInit(): void {
    // Set initial position at DEFAULT_BREAKPOINT
    this.setupBottomSheet();
    setTimeout(() => {
      this.calculateMinBreakpoint();
    }, 100);
  }

  @HostListener('window:resize')
  onResize(): void {
    this.windowHeight = window.innerHeight;
    this.setupBottomSheet();
    this.calculateMinBreakpoint();
  }

  setupBottomSheet(): void {
    // Reset any existing animation
    if (this.draggableInstance) {
      this.draggableInstance.kill();
    }

    // Initial position at DEFAULT_BREAKPOINT
    gsap.set(this.bottomSheet.nativeElement, {
      y: this.windowHeight * (1 - this.DEFAULT_BREAKPOINT),
      height: this.windowHeight
    });

    // Create draggable instance
    this.draggableInstance = Draggable.create(this.bottomSheet.nativeElement, {
      type: 'y',
      bounds: {
        minY: this.windowHeight * (1 - this.EXPANDED_BREAKPOINT),
        maxY: this.windowHeight * (1 - this.actualMinBreakpoint)
      },
      edgeResistance: 0.8,
      onDragStart: () => {
        this.isDragging = true;
        // Disable scrolling while dragging
        this.isScrollEnabled = false;
        // Record initial y position for determining drag direction
        this.previousY = this.draggableInstance.y;
      },
      onDrag: this.onDrag.bind(this),
      onDragEnd: this.onDragEnd.bind(this),
      onThrowComplete: () => {
        this.isDragging = false;
        // Enable scrolling only if at expanded breakpoint
        this.isScrollEnabled = this.currentBreakpoint === this.EXPANDED_BREAKPOINT;
      }
    })[0];
    
    // Add a custom event listener to prevent dragging below min breakpoint
    this.draggableInstance.addEventListener('drag', this.preventDraggingBelowMin.bind(this));
  }

  calculateMinBreakpoint(): void {
    // Calculate min breakpoint dynamically based on header + selected coupon + button height
    const headerHeight = this.header.nativeElement.offsetHeight;
    const singleCouponHeight = 100; // Approximate height of a single coupon
    const buttonHeight = this.button.nativeElement.offsetHeight;
    const minContentHeight = headerHeight + singleCouponHeight + buttonHeight + 20; // 20px for padding
    
    this.actualMinBreakpoint = Math.max(this.MIN_BREAKPOINT, minContentHeight / this.windowHeight);
    
    // Update bounds of draggable
    if (this.draggableInstance) {
      this.draggableInstance.applyBounds({
        minY: this.windowHeight * (1 - this.EXPANDED_BREAKPOINT),
        maxY: this.windowHeight * (1 - this.actualMinBreakpoint)
      });
    }
  }

  preventDraggingBelowMin(event: any): void {
    // Get the current position
    const currentY = this.draggableInstance.y;
    const maxY = this.windowHeight * (1 - this.actualMinBreakpoint);
    
    // If trying to drag below min breakpoint
    if (currentY > maxY && this.lastDragDirection === -1) {
      // Set the position to the min breakpoint
      gsap.set(this.bottomSheet.nativeElement, {
        y: maxY
      });

      // Update the draggable's position
      this.draggableInstance.update();
      
      // Flag that we're trying to drag below min
      this.isDraggingBelowMin = true;
    } else {
      this.isDraggingBelowMin = false;
    }
  }

  onDrag(): void {
    // Calculate current position as percentage of window height
    const currentY = this.draggableInstance.y;
    
    // Determine drag direction
    if (currentY > this.previousY) {
      // Dragging down
      this.lastDragDirection = -1;
    } else if (currentY < this.previousY) {
      // Dragging up
      this.lastDragDirection = 1;
    }
    
    this.previousY = currentY;
  }

  onDragEnd(): void {
    // If we're trying to drag below min, don't do anything
    if (this.isDraggingBelowMin) {
      this.isDraggingBelowMin = false;
      return;
    }
    
    // Get current position
    const position = 1 - (this.draggableInstance.y / this.windowHeight);
    
    // Determine which breakpoint to snap to
    let targetBreakpoint;
    
    if (position > this.EXPANDED_BREAKPOINT - this.SNAP_TOLERANCE) {
      // Snap to expanded
      targetBreakpoint = this.EXPANDED_BREAKPOINT;
    } else if (position > this.DEFAULT_BREAKPOINT - this.SNAP_TOLERANCE) {
      // Snap to default
      targetBreakpoint = this.DEFAULT_BREAKPOINT;
    } else {
      // Snap to min
      targetBreakpoint = this.actualMinBreakpoint;
    }

    // Check if we're dragging downward and changing breakpoint
    const isMovingDown = this.lastDragDirection === -1;
    const isBreakpointChange = targetBreakpoint !== this.currentBreakpoint;
    
    // If dragging down AND changing breakpoint, move selected coupon to first position
    if (isMovingDown && isBreakpointChange) {
      // Animate the selected coupon to the first position
      this.animateSelectedCouponToFirst();
    }
    
    // Store the previous breakpoint
    const previousBreakpoint = this.currentBreakpoint;
    
    // Animate to target position
    gsap.to(this.bottomSheet.nativeElement, {
      y: this.windowHeight * (1 - targetBreakpoint),
      duration: 0.3,
      ease: 'power2.out',
      onComplete: () => {
        this.currentBreakpoint = targetBreakpoint;
        this.isDragging = false;
        
        // Enable scrolling only if at expanded breakpoint
        this.isScrollEnabled = targetBreakpoint === this.EXPANDED_BREAKPOINT;
        
        // Reset drag direction
        this.lastDragDirection = 0;
        
        // If moving from expanded to any other breakpoint, scroll to top
        if (previousBreakpoint === this.EXPANDED_BREAKPOINT && targetBreakpoint !== this.EXPANDED_BREAKPOINT) {
          this.scrollToTop();
        }
      }
    });
  }

  scrollToTop(): void {
    if (this.sheetContent) {
      // Scroll the content to top with animation
      gsap.to(this.sheetContent.nativeElement, {
        scrollTop: 0,
        duration: 0.2,
        ease: 'power2.out'
      });
    }
  }

  selectCoupon(coupon: Coupon): void {
    // Only proceed if this is a different coupon
    if (!coupon.isSelected) {
      // Deselect all coupons first
      this.coupons.forEach(c => c.isSelected = false);
      // Select the clicked coupon
      coupon.isSelected = true;
    }
  }

  animateSelectedCouponToFirst(): void {
    // Find the selected coupon
    const selectedCoupon = this.coupons.find(coupon => coupon.isSelected);
    if (!selectedCoupon) return;
    
    // Find the index of the selected coupon
    const selectedIndex = this.coupons.findIndex(coupon => coupon.isSelected);
    
    // If it's already the first one, do nothing
    if (selectedIndex <= 0) return;
    
    // Create a temporary array for the animation
    const newOrder = [...this.coupons];
    
    // Remove the selected coupon from its current position
    newOrder.splice(selectedIndex, 1);
    
    // Add it to the beginning of the array
    newOrder.unshift(selectedCoupon);
    
    // Animate the transition by setting up a GSAP timeline
    // We'll just update the array directly and let Angular handle the DOM updates
    // This creates a smooth visual effect as Angular's change detection processes the new array
    gsap.to({}, {
      duration: 0.3,
      onComplete: () => {
        // Update the coupons array with the new order
        this.coupons = newOrder;
      }
    });
  }

  moveSelectedCouponToFirst(): void {
    // Find the selected coupon
    const selectedCoupon = this.coupons.find(coupon => coupon.isSelected);
    if (!selectedCoupon) return;
    
    // Find the index of the selected coupon
    const selectedIndex = this.coupons.findIndex(coupon => coupon.isSelected);
    
    // If it's already the first one, do nothing
    if (selectedIndex <= 0) return;
    
    // Remove the selected coupon from its current position
    this.coupons.splice(selectedIndex, 1);
    
    // Add it to the beginning of the array
    this.coupons = [selectedCoupon, ...this.coupons];
  }

  getButtonLabel(): string {
    const selectedCoupon = this.coupons.find(coupon => coupon.isSelected);
    return selectedCoupon ? `Escolher ${selectedCoupon.title}` : 'Escolher serviço';
  }

  isButtonEnabled(): boolean {
    return this.coupons.some(coupon => coupon.isSelected);
  }

  // Add the trackByCouponId method here, inside the component class
  trackByCouponId(index: number, coupon: Coupon): number {
    return coupon.id;
  }
}