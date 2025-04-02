// import { Component, OnInit, ElementRef, ViewChild, AfterViewInit, HostListener } from '@angular/core';
// import { gsap } from 'gsap';
// import { Draggable } from 'gsap/Draggable';

// interface Coupon {
//   id: number;
//   title: string;
//   discount: string;
//   originalPrice: number;
//   discountedPrice: number;
//   isSelected: boolean;
// }

// @Component({
//   selector: 'app-bottom-sheet',
//   templateUrl: './bottom-sheet.component.html',
//   styleUrls: ['./bottom-sheet.component.scss'],
//   standalone: false 
// })

// export class BottomSheetComponent implements OnInit, AfterViewInit {
//   @ViewChild('bottomSheet') bottomSheet!: ElementRef;
//   @ViewChild('sheetContent') sheetContent!: ElementRef;
//   @ViewChild('header') header!: ElementRef;
//   @ViewChild('couponsList') couponsList!: ElementRef;
//   @ViewChild('button') button!: ElementRef;
//   @ViewChild('searchBar') searchBar!: ElementRef;

//   coupons: Coupon[] = [
//     { id: 1, title: 'Comfort', discount: 'R$ 11,50', originalPrice: 22.99, discountedPrice: 11.49, isSelected: true },
//     { id: 2, title: 'UberX', discount: 'R$ 8,97', originalPrice: 17.94, discountedPrice: 8.97, isSelected: false },
//     { id: 3, title: 'Prioridade', discount: 'R$ 12,59', originalPrice: 25.18, discountedPrice: 12.59, isSelected: false },
//     { id: 4, title: 'Black', discount: 'R$ 38,57', originalPrice: 77.14, discountedPrice: 38.57, isSelected: false },
//     { id: 5, title: 'Comfort1', discount: 'R$ 11,50', originalPrice: 22.99, discountedPrice: 11.49, isSelected: false },
//     { id: 6, title: 'UberX', discount: 'R$ 8,97', originalPrice: 17.94, discountedPrice: 8.97, isSelected: false },
//     { id: 7, title: 'Prioridade', discount: 'R$ 12,59', originalPrice: 25.18, discountedPrice: 12.59, isSelected: false },
//     { id: 8, title: 'Black', discount: 'R$ 38,57', originalPrice: 77.14, discountedPrice: 38.57, isSelected: false },
//     { id: 9, title: 'Comfort2', discount: 'R$ 11,50', originalPrice: 22.99, discountedPrice: 11.49, isSelected: false },
//     { id: 10, title: 'UberX', discount: 'R$ 8,97', originalPrice: 17.94, discountedPrice: 8.97, isSelected: false },
//     { id: 11, title: 'Prioridade', discount: 'R$ 12,59', originalPrice: 25.18, discountedPrice: 12.59, isSelected: false },
//     { id: 12, title: 'Black', discount: 'R$ 38,57', originalPrice: 77.14, discountedPrice: 38.57, isSelected: false }
//   ];

//   // Breakpoints (as percentage of window height)
//   readonly EXPANDED_BREAKPOINT = 0.95;
//   readonly DEFAULT_BREAKPOINT = 0.6;
//   readonly MIN_BREAKPOINT_BASE = 0.15; // Lower base value to ensure enough separation from DEFAULT_BREAKPOINT
//   readonly SNAP_TOLERANCE_UP = 0.15; // For upward dragging
//   readonly SNAP_TOLERANCE_DOWN = 0.15; // For downward dragging
//   readonly MIN_SEPARATION = 0.1; // Minimum separation between DEFAULT and MIN breakpoints

//   windowHeight = window.innerHeight;
//   isDragging = false;
//   currentBreakpoint = this.DEFAULT_BREAKPOINT;
//   draggableInstance: any;
//   actualMinBreakpoint = this.MIN_BREAKPOINT_BASE;
//   isScrollEnabled = false;
//   lastDragDirection = 0; // 1 for up, -1 for down, 0 for no drag
//   previousY = 0;
//   searchTerm = ''; // For search functionality
//   initialScrollTop = 0; // To track initial scroll position when dragging starts
//   dragStartTime = 0; // To detect quick drags for better snapping
//   maintainButtonVisibility = true; // For continuous button visibility

//   constructor() {
//     gsap.registerPlugin(Draggable);
//   }

//   ngOnInit(): void {
//     // First coupon is selected by default
//     this.selectCoupon(this.coupons[0]);
//     // Move selected coupon to top
//     this.moveSelectedCouponToFirst();
    
//     // Add class to body to prevent background scrolling
//     document.body.classList.add('bottom-sheet-open');
//   }

//   ngAfterViewInit(): void {
//     // Set initial position at DEFAULT_BREAKPOINT
//     setTimeout(() => {
//       this.calculateMinBreakpoint();
//       this.setupBottomSheet();
//       this.initializeButtonVisibility(); // Start keeping button visible
      
//       // After initial setup, observe for any DOM mutations (size changes)
//       // to recalculate the min breakpoint if necessary
//       this.setupResizeObserver();
//     }, 100);
//   }
  
//   // Setup MutationObserver to detect size changes in elements
//   setupResizeObserver(): void {
//     if (window.ResizeObserver) {
//       const resizeObserver = new ResizeObserver(entries => {
//         if (this.currentBreakpoint === this.actualMinBreakpoint) {
//           this.calculateMinBreakpoint();
//           this.adjustButtonPosition();
//         }
//       });
      
//       // Observe the critical elements whose size changes might affect our calculations
//       if (this.header) resizeObserver.observe(this.header.nativeElement);
//       if (this.searchBar) resizeObserver.observe(this.searchBar.nativeElement);
//       if (this.couponsList) resizeObserver.observe(this.couponsList.nativeElement);
//     }
//   }
  
//   ngOnDestroy(): void {
//     // Stop button visibility checks
//     this.maintainButtonVisibility = false;
    
//     // Remove class from body when component is destroyed
//     document.body.classList.remove('bottom-sheet-open');
//   }

//   @HostListener('window:resize')
//   onResize(): void {
//     this.windowHeight = window.innerHeight;
//     this.calculateMinBreakpoint();
//     this.setupBottomSheet();
//     this.adjustButtonPosition();
//   }

//   // Initialize continuous button visibility check
//   initializeButtonVisibility(): void {
//     if (this.maintainButtonVisibility) {
//       this.ensureButtonVisibility();
//     }
//   }

//   // Continuously ensure button is visible
//   ensureButtonVisibility(): void {
//     if (!this.button) return;
    
//     // Force button to be visible and properly positioned
//     this.button.nativeElement.style.display = 'block';
//     this.button.nativeElement.style.visibility = 'visible';
//     this.button.nativeElement.style.opacity = '1';
//     this.button.nativeElement.style.zIndex = '99999';
//     this.button.nativeElement.style.position = 'fixed';
//     this.button.nativeElement.style.bottom = '0';
//     this.button.nativeElement.style.left = '0';
//     this.button.nativeElement.style.right = '0';
    
//     // Schedule next check
//     if (this.maintainButtonVisibility) {
//       requestAnimationFrame(() => this.ensureButtonVisibility());
//     }
//   }

//   setupBottomSheet(): void {
//     // Reset any existing animation
//     if (this.draggableInstance) {
//       this.draggableInstance.kill();
//     }

//     // Initial position at DEFAULT_BREAKPOINT
//     gsap.set(this.bottomSheet.nativeElement, {
//       y: this.windowHeight * (1 - this.DEFAULT_BREAKPOINT),
//       height: this.windowHeight
//     });

//     // Create draggable instance with stricter bounds
//     this.draggableInstance = Draggable.create(this.bottomSheet.nativeElement, {
//       type: 'y',
//       bounds: {
//         minY: this.windowHeight * (1 - this.EXPANDED_BREAKPOINT) - 1, // Prevent dragging above EXPANDED_BREAKPOINT
//         maxY: this.windowHeight * (1 - this.actualMinBreakpoint) + 1 // Prevent dragging below actualMinBreakpoint
//       },
//       edgeResistance: 0.95, // Increased resistance near the edges for smoother behavior
//       inertia: true, // Enable physics-based animation
//       overshootTolerance: 0, // Prevent overshooting
//       onDragStart: () => {
//         this.isDragging = true;
//         this.dragStartTime = Date.now(); // Record drag start time

//         // Save initial scroll position
//         if (this.sheetContent) {
//           this.initialScrollTop = this.sheetContent.nativeElement.scrollTop;
//         }

//         // Disable scrolling while dragging
//         this.isScrollEnabled = false;

//         // Record initial y position for determining drag direction
//         this.previousY = this.draggableInstance.y;
//       },
//       onDrag: this.onDrag.bind(this),
//       onDragEnd: this.onDragEnd.bind(this),
//       onThrowComplete: () => {
//         this.isDragging = false;
//         // Enable scrolling only if at expanded breakpoint
//         this.isScrollEnabled = this.currentBreakpoint === this.EXPANDED_BREAKPOINT;
//       }
//     })[0];
//   }

//   // CRITICAL: Precise calculation of min breakpoint for perfect fit
//   calculateMinBreakpoint(): void {
//     if (!this.header || !this.button || !this.searchBar || !this.couponsList) return;

//     // Wait for rendering to complete to get accurate measurements
//     setTimeout(() => {
//       // Step 1: Get precise measurements of each component
//       const headerHeight = this.header.nativeElement.offsetHeight;
//       const searchBarHeight = this.searchBar.nativeElement.offsetHeight;
      
//       // Step 2: Find the selected coupon and measure its exact height
//       let selectedCouponHeight = 0;
//       let selectedCouponEl = null;
      
//       const couponsArray = this.couponsList.nativeElement.querySelectorAll('.coupon-item');
//       for (let i = 0; i < couponsArray.length; i++) {
//         if (couponsArray[i].classList.contains('selected')) {
//           selectedCouponEl = couponsArray[i];
//           selectedCouponHeight = selectedCouponEl.offsetHeight;
//           break;
//         }
//       }
      
//       // Use default if we can't find selected coupon
//       if (selectedCouponHeight === 0) {
//         selectedCouponHeight = 86; // Fallback height
//       }
      
//       // Step 3: Measure button height
//       const buttonHeight = this.button.nativeElement.offsetHeight;
      
//       // Step 4: Calculate necessary space with minimal adjustment
//       const adjustment = 2; // Minimal adjustment for borders
//       const exactContentHeight = headerHeight + searchBarHeight + selectedCouponHeight + buttonHeight + adjustment;
      
//       // Step 5: Calculate as percentage of window height
//       this.actualMinBreakpoint = exactContentHeight / this.windowHeight;
      
//       // Step 6: Apply minimum threshold to ensure it doesn't get too small
//       this.actualMinBreakpoint = Math.max(this.actualMinBreakpoint, this.MIN_BREAKPOINT_BASE);
      
//       // Step 7: Ensure sufficient separation from DEFAULT breakpoint
//       if (this.DEFAULT_BREAKPOINT - this.actualMinBreakpoint < this.MIN_SEPARATION) {
//         this.actualMinBreakpoint = this.DEFAULT_BREAKPOINT - this.MIN_SEPARATION;
//       }
      
//       // Step 8: Update draggable bounds
//       if (this.draggableInstance) {
//         this.draggableInstance.applyBounds({
//           minY: this.windowHeight * (1 - this.EXPANDED_BREAKPOINT) - 1,
//           maxY: this.windowHeight * (1 - this.actualMinBreakpoint) + 1
//         });
//       }
      
//       // Step 9: Update position if currently at min height
//       if (this.currentBreakpoint === this.actualMinBreakpoint) {
//         this.updateBottomSheetPosition();
//       }
      
//       console.log('Calculated heights:', {
//         headerHeight,
//         searchBarHeight,
//         selectedCouponHeight,
//         buttonHeight,
//         totalHeight: exactContentHeight,
//         windowHeight: this.windowHeight,
//         minBreakpoint: this.actualMinBreakpoint
//       });
//     }, 50); // Short delay to ensure DOM is updated
//   }

//   // New method to update bottom sheet position with better timing
//   updateBottomSheetPosition(): void {
//     gsap.to(this.bottomSheet.nativeElement, {
//       y: this.windowHeight * (1 - this.actualMinBreakpoint),
//       duration: 0.2,
//       ease: 'power2.out',
//       onComplete: () => {
//         // Ensure selected coupon is visible
//         this.scrollToSelectedCoupon();
//       }
//     });
//   }

//   // New method to scroll to selected coupon
//   scrollToSelectedCoupon(): void {
//     if (!this.sheetContent || !this.couponsList) return;
    
//     const couponsArray = this.couponsList.nativeElement.querySelectorAll('.coupon-item');
//     for (let i = 0; i < couponsArray.length; i++) {
//       if (couponsArray[i].classList.contains('selected')) {
//         gsap.to(this.sheetContent.nativeElement, {
//           scrollTop: 0, // Always scroll to top to show selected coupon
//           duration: 0.2,
//           ease: 'power2.out'
//         });
//         break;
//       }
//     }
//   }

//   onDrag(): void {
//     if (!this.draggableInstance) return;
    
//     // Get current position
//     const currentY = this.draggableInstance.y;

//     // Determine drag direction with improved sensitivity
//     if (currentY > this.previousY + 1) { // Added threshold to ignore tiny movements
//       // Dragging down
//       this.lastDragDirection = -1;
//     } else if (currentY < this.previousY - 1) { // Added threshold to ignore tiny movements
//       // Dragging up
//       this.lastDragDirection = 1;
//     }

//     // Store previous position for next comparison
//     this.previousY = currentY;
   
//     // Enforce bounds with stronger resistance to prevent visual glitches
//     const maxY = this.windowHeight * (1 - this.actualMinBreakpoint);
//     const minY = this.windowHeight * (1 - this.EXPANDED_BREAKPOINT);

//     if (currentY < minY) {
//       // Trying to drag above expanded limit - snap back immediately to prevent disconnection
//       gsap.to(this.bottomSheet.nativeElement, {
//         y: minY,
//         duration: 0.1, // Faster correction to avoid visual glitch
//         ease: "power2.out"
//       });
//       this.draggableInstance.update(true);
//     } else if (currentY > maxY) {
//       // Trying to drag below min limit - snap back immediately
//       gsap.to(this.bottomSheet.nativeElement, {
//         y: maxY,
//         duration: 0.1, // Faster correction to avoid visual glitch
//         ease: "power2.out"
//       });
//       this.draggableInstance.update(true);
//     }
    
//     // Always ensure button is visible during dragging
//     this.adjustButtonPosition();
//   }

//   onDragEnd(): void {
//     if (!this.draggableInstance) return;
    
//     // Get current position as percentage of window height
//     const position = 1 - (this.draggableInstance.y / this.windowHeight);
    
//     // Calculate drag duration for improved snapping logic
//     const dragDuration = Date.now() - this.dragStartTime;
//     const isQuickDrag = dragDuration < 300; // Consider drags shorter than 300ms as "quick flicks"
    
//     // Improved snapping logic for different scenarios
//     let targetBreakpoint;
    
//     // Determine target breakpoint based on current position, drag direction, and drag speed
//     if (this.lastDragDirection === 1) {
//       // Dragging up
//       if (position >= this.EXPANDED_BREAKPOINT - this.SNAP_TOLERANCE_UP || 
//           (position >= this.DEFAULT_BREAKPOINT + (this.SNAP_TOLERANCE_UP / 2) && isQuickDrag)) {
//         // Either close to EXPANDED or quick upward flick from above DEFAULT
//         targetBreakpoint = this.EXPANDED_BREAKPOINT;
//       } else if (position >= this.DEFAULT_BREAKPOINT - this.SNAP_TOLERANCE_UP || 
//                 (position >= this.actualMinBreakpoint + (this.SNAP_TOLERANCE_UP / 2) && isQuickDrag)) {
//         // Either close to DEFAULT or quick upward flick from above MIN
//         targetBreakpoint = this.DEFAULT_BREAKPOINT;
//       } else {
//         targetBreakpoint = this.actualMinBreakpoint;
//       }
//     } else {
//       // Dragging down or no movement
//       if (position <= this.DEFAULT_BREAKPOINT + this.SNAP_TOLERANCE_DOWN || 
//           (position <= this.EXPANDED_BREAKPOINT - (this.SNAP_TOLERANCE_DOWN / 2) && isQuickDrag)) {
//         // Either close to DEFAULT or quick downward flick from below EXPANDED
//         if (position <= this.actualMinBreakpoint + this.SNAP_TOLERANCE_DOWN || 
//             (position <= this.DEFAULT_BREAKPOINT - (this.SNAP_TOLERANCE_DOWN / 2) && isQuickDrag)) {
//           // Either close to MIN or quick downward flick from below DEFAULT
//           targetBreakpoint = this.actualMinBreakpoint;
//         } else {
//           targetBreakpoint = this.DEFAULT_BREAKPOINT;
//         }
//       } else {
//         targetBreakpoint = this.EXPANDED_BREAKPOINT;
//       }
//     }
    
//     // Check if we're changing breakpoint
//     const isBreakpointChange = targetBreakpoint !== this.currentBreakpoint;
    
//     // When changing to a smaller breakpoint or from EXPANDED to DEFAULT,
//     // ensure selected coupon is at the top and visible
//     if (isBreakpointChange && 
//         (targetBreakpoint < this.currentBreakpoint || 
//          (this.currentBreakpoint === this.EXPANDED_BREAKPOINT && targetBreakpoint === this.DEFAULT_BREAKPOINT))) {
//       this.moveSelectedCouponToFirst();
//     }
    
//     // Store the previous breakpoint
//     const previousBreakpoint = this.currentBreakpoint;
    
//     // If we're going to MIN breakpoint, recalculate it first for perfect fit
//     if (targetBreakpoint === this.actualMinBreakpoint) {
//       this.calculateMinBreakpoint();
//     }
    
//     // Animate to target position with smoother animation to prevent glitches
//     gsap.to(this.bottomSheet.nativeElement, {
//       y: this.windowHeight * (1 - targetBreakpoint),
//       duration: 0.3,
//       ease: 'power2.out',
//       onComplete: () => {
//         this.currentBreakpoint = targetBreakpoint;
//         this.isDragging = false;
        
//         // Enable scrolling only if at expanded breakpoint
//         this.isScrollEnabled = targetBreakpoint === this.EXPANDED_BREAKPOINT;

//         // Reset drag direction
//         this.lastDragDirection = 0;

//         // Always scroll to top when moving between breakpoints
//         if (isBreakpointChange) {
//           this.scrollToSelectedCoupon();
//         }
        
//         // Always update button position when breakpoint changes
//         this.adjustButtonPosition();
//       }
//     });
//   }

//   // Improved scrollToTop method with smoother animation
//   scrollToTop(): void {
//     if (this.sheetContent) {
//       // Scroll the content to top with animation
//       gsap.to(this.sheetContent.nativeElement, {
//         scrollTop: 0,
//         duration: 0.2,
//         ease: 'power2.out'
//       });
//     }
//   }

//   // Enhanced selectCoupon method for immediate recalculation
//   selectCoupon(coupon: Coupon): void {
//     // Only proceed if this is a different coupon
//     if (!coupon.isSelected) {
//       // Deselect all coupons first
//       this.coupons.forEach(c => c.isSelected = false);

//       // Select the clicked coupon
//       coupon.isSelected = true;

//       // If sheet is not at expanded breakpoint, move selected coupon to the top
//       if (this.currentBreakpoint !== this.EXPANDED_BREAKPOINT) {
//         this.moveSelectedCouponToFirst();
//       }

//       // Force recalculation of min height and button position
//       setTimeout(() => {
//         this.calculateMinBreakpoint();
        
//         // If currently at min height, animate to the new min height for perfect fit
//         if (this.currentBreakpoint === this.actualMinBreakpoint) {
//           this.updateBottomSheetPosition();
//         } else {
//           this.adjustButtonPosition();
//         }
//       }, 50);
//     }
//   }

//   // Improved animation for moving selected coupon to top
//   animateSelectedCouponToFirst(): void {
//     // Find the selected coupon
//     const selectedCoupon = this.coupons.find(coupon => coupon.isSelected);
//     if (!selectedCoupon) return;

//     // Find the index of the selected coupon
//     const selectedIndex = this.coupons.findIndex(coupon => coupon.isSelected);
  
//     // If it's already the first one, do nothing
//     if (selectedIndex <= 0) return;
  
//     // Create a temporary array for the animation
//     const newOrder = [...this.coupons];
  
//     // Remove the selected coupon from its current position
//     newOrder.splice(selectedIndex, 1);
  
//     // Add it to the beginning of the array
//     newOrder.unshift(selectedCoupon);
  
//     // Scroll to top first to ensure visibility
//     this.scrollToTop();
    
//     // Use a short timeout to ensure scroll completes first
//     setTimeout(() => {
//       // Apply a fade transition for smoother visual effect
//       if (this.couponsList) {
//         gsap.to(this.couponsList.nativeElement, {
//           opacity: 0.8,
//           duration: 0.1,
//           onComplete: () => {
//             // Update the coupons array with the new order
//             this.coupons = newOrder;
            
//             // Fade back in
//             gsap.to(this.couponsList.nativeElement, {
//               opacity: 1,
//               duration: 0.2
//             });
//           }
//         });
//       } else {
//         // Fallback if couponsList ref is not available
//         this.coupons = newOrder;
//       }
//     }, 100);
//   }

//   // More reliable method to move selected coupon to top
//   moveSelectedCouponToFirst(): void {
//     // Find the selected coupon
//     const selectedCoupon = this.coupons.find(coupon => coupon.isSelected);
//     if (!selectedCoupon) return;
    
//     // Find the index of the selected coupon
//     const selectedIndex = this.coupons.findIndex(coupon => coupon.isSelected);
    
//     // If it's already the first one, do nothing
//     if (selectedIndex <= 0) return;

//     // Remove the selected coupon from its current position
//     this.coupons.splice(selectedIndex, 1);

//     // Add it to the beginning of the array
//     this.coupons = [selectedCoupon, ...this.coupons];

//     // Scroll to top to ensure visibility
//     this.scrollToTop();
//   }

//   getButtonLabel(): string {
//     const selectedCoupon = this.coupons.find(coupon => coupon.isSelected);
//     return selectedCoupon ? `Escolher ${selectedCoupon.title}` : 'Escolher serviço';
//   }

//   isButtonEnabled(): boolean {
//     return this.coupons.some(coupon => coupon.isSelected);
//   }

//   trackByCouponId(index: number, coupon: Coupon): number {
//     return coupon.id;
//   }

//   // Enhanced method to adjust button position for perfect fit
//   adjustButtonPosition(): void {
//     if (!this.button) return;
    
//     // CRITICAL: Force button to stay at bottom, regardless of sheet position
//     this.button.nativeElement.style.position = 'fixed';
//     this.button.nativeElement.style.bottom = '0';
//     this.button.nativeElement.style.left = '0';
//     this.button.nativeElement.style.right = '0';

//     // Ensure critical styles are always applied
//     this.button.nativeElement.style.display = 'block';
//     this.button.nativeElement.style.visibility = 'visible';
//     this.button.nativeElement.style.zIndex = '99999';
//   }

//   // Improved search functionality
//   searchCoupons(): Coupon[] {
//     if (!this.searchTerm || this.searchTerm.trim() === '') {
//       return this.coupons;
//     }

//     const term = this.searchTerm.toLowerCase().trim();
//     const filteredCoupons = this.coupons.filter(coupon => 
//       coupon.title.toLowerCase().includes(term)
//     );
    
//     // If we're at MIN_HEIGHT or DEFAULT_HEIGHT, ensure the selected coupon
//     // is visible by putting it at the top of the filtered results
//     if ((this.currentBreakpoint === this.actualMinBreakpoint || 
//          this.currentBreakpoint === this.DEFAULT_BREAKPOINT) && 
//         filteredCoupons.length > 0) {
      
//       const selectedCoupon = filteredCoupons.find(coupon => coupon.isSelected);
      
//       if (selectedCoupon) {
//         // Remove the selected coupon from its current position
//         const filteredWithoutSelected = filteredCoupons.filter(c => !c.isSelected);
        
//         // Return with selected coupon at the top
//         return [selectedCoupon, ...filteredWithoutSelected];
//       }
//     }
    
//     return filteredCoupons;
//   }

//   clearSearch(): void {
//     this.searchTerm = '';
    
//     // When clearing search, ensure selected coupon is at the top if not at EXPANDED
//     if (this.currentBreakpoint !== this.EXPANDED_BREAKPOINT) {
//       this.moveSelectedCouponToFirst();
//     }
//   }
// }

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
  @ViewChild('searchBar') searchBar!: ElementRef;

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
  readonly MIN_BREAKPOINT_BASE = 0.15; // Lower base value to ensure enough separation from DEFAULT_BREAKPOINT
  readonly SNAP_TOLERANCE_UP = 0.15; // For upward dragging
  readonly SNAP_TOLERANCE_DOWN = 0.15; // For downward dragging
  readonly MIN_SEPARATION = 0.1; // Minimum separation between DEFAULT and MIN breakpoints

  windowHeight = window.innerHeight;
  isDragging = false;
  currentBreakpoint = this.DEFAULT_BREAKPOINT;
  draggableInstance: any;
  actualMinBreakpoint = this.MIN_BREAKPOINT_BASE;
  isScrollEnabled = false;
  lastDragDirection = 0; // 1 for up, -1 for down, 0 for no drag
  previousY = 0;
  searchTerm = ''; // For search functionality
  initialScrollTop = 0; // To track initial scroll position when dragging starts
  dragStartTime = 0; // To detect quick drags for better snapping
  maintainButtonVisibility = true; // For continuous button visibility

  constructor() {
    gsap.registerPlugin(Draggable);
  }

  ngOnInit(): void {
    // First coupon is selected by default
    this.selectCoupon(this.coupons[0]);
    // Move selected coupon to top
    this.moveSelectedCouponToFirst();

    // Add class to body to prevent background scrolling
    document.body.classList.add('bottom-sheet-open');
  }

  ngAfterViewInit(): void {
    // Set initial position at DEFAULT_BREAKPOINT
    setTimeout(() => {
      this.calculateMinBreakpoint();
      this.setupBottomSheet();
      this.initializeButtonVisibility(); // Start keeping button visible

      // After initial setup, observe for any DOM mutations (size changes)
      // to recalculate the min breakpoint if necessary
      this.setupResizeObserver();
    }, 100);
  }

  // Setup MutationObserver to detect size changes in elements
  setupResizeObserver(): void {
    if (window.ResizeObserver) {
      const resizeObserver = new ResizeObserver(entries => {
        if (this.currentBreakpoint === this.actualMinBreakpoint) {
          this.calculateMinBreakpoint();
          this.adjustButtonPosition();
        }
      });

      // Observe the critical elements whose size changes might affect our calculations
      if (this.header) resizeObserver.observe(this.header.nativeElement);
      if (this.searchBar) resizeObserver.observe(this.searchBar.nativeElement);
      if (this.couponsList) resizeObserver.observe(this.couponsList.nativeElement);
    }
  }

  ngOnDestroy(): void {
    // Stop button visibility checks
    this.maintainButtonVisibility = false;

    // Remove class from body when component is destroyed
    document.body.classList.remove('bottom-sheet-open');
  }

  @HostListener('window:resize')
  onResize(): void {
    this.windowHeight = window.innerHeight;
    this.calculateMinBreakpoint();
    this.setupBottomSheet();
    this.adjustButtonPosition();
  }

  // Initialize continuous button visibility check
  initializeButtonVisibility(): void {
    if (this.maintainButtonVisibility) {
      this.ensureButtonVisibility();
    }
  }

  // Continuously ensure button is visible
  ensureButtonVisibility(): void {
    if (!this.button) return;

    // Force button to be visible and properly positioned
    this.button.nativeElement.style.display = 'block';
    this.button.nativeElement.style.visibility = 'visible';
    this.button.nativeElement.style.opacity = '1';
    this.button.nativeElement.style.zIndex = '99999';
    this.button.nativeElement.style.position = 'fixed';
    this.button.nativeElement.style.bottom = '0';
    this.button.nativeElement.style.left = '0';
    this.button.nativeElement.style.right = '0';

    // Schedule next check
    if (this.maintainButtonVisibility) {
      requestAnimationFrame(() => this.ensureButtonVisibility());
    }
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

    // Create draggable instance with stricter bounds
    this.draggableInstance = Draggable.create(this.bottomSheet.nativeElement, {
      type: 'y',
      bounds: {
        minY: this.windowHeight * (1 - this.EXPANDED_BREAKPOINT) - 1, // Prevent dragging above EXPANDED_BREAKPOINT
        maxY: this.windowHeight * (1 - this.actualMinBreakpoint) + 1 // Prevent dragging below actualMinBreakpoint
      },
      edgeResistance: 0.95, // Increased resistance near the edges for smoother behavior
      inertia: true, // Enable physics-based animation
      overshootTolerance: 0, // Prevent overshooting
      onDragStart: () => {
        this.isDragging = true;
        this.dragStartTime = Date.now(); // Record drag start time

        // Save initial scroll position
        if (this.sheetContent) {
          this.initialScrollTop = this.sheetContent.nativeElement.scrollTop;
        }

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
  }

  // CRITICAL: Precise calculation of min breakpoint for perfect fit
  calculateMinBreakpoint(): void {
    if (!this.header || !this.button || !this.searchBar || !this.couponsList) return;

    // Wait for rendering to complete to get accurate measurements
    setTimeout(() => {
      // Step 1: Get precise measurements of each component
      const headerHeight = this.header.nativeElement.offsetHeight;
      const searchBarHeight = this.searchBar.nativeElement.offsetHeight;

      // Step 2: Find the selected coupon and measure its exact height
      let selectedCouponHeight = 0;
      let selectedCouponEl = null;

      const couponsArray = this.couponsList.nativeElement.querySelectorAll('.coupon-item');
      for (let i = 0; i < couponsArray.length; i++) {
        if (couponsArray[i].classList.contains('selected')) {
          selectedCouponEl = couponsArray[i];
          selectedCouponHeight = selectedCouponEl.offsetHeight;
          break;
        }
      }

      // Use default if we can't find selected coupon
      if (selectedCouponHeight === 0) {
        selectedCouponHeight = 86; // Fallback height
      }

      // **INSERTED CODE BLOCK START**
      // Adjust for the complete border visibility
      if (selectedCouponHeight > 0) {
        // Add a small adjustment to account for full border visibility
        selectedCouponHeight += 4; // Add 4px to ensure border is fully visible
      }
      // **INSERTED CODE BLOCK END**

      // Step 3: Measure button height
      const buttonHeight = this.button.nativeElement.offsetHeight;

      // Step 4: Calculate necessary space with minimal adjustment
      const adjustment = 2; // Minimal adjustment for borders
      const exactContentHeight = headerHeight + searchBarHeight + selectedCouponHeight + buttonHeight + adjustment;

      // Step 5: Calculate as percentage of window height
      this.actualMinBreakpoint = exactContentHeight / this.windowHeight;

      // Step 6: Apply minimum threshold to ensure it doesn't get too small
      this.actualMinBreakpoint = Math.max(this.actualMinBreakpoint, this.MIN_BREAKPOINT_BASE);

      // Step 7: Ensure sufficient separation from DEFAULT breakpoint
      if (this.DEFAULT_BREAKPOINT - this.actualMinBreakpoint < this.MIN_SEPARATION) {
        this.actualMinBreakpoint = this.DEFAULT_BREAKPOINT - this.MIN_SEPARATION;
      }

      // Step 8: Update draggable bounds
      if (this.draggableInstance) {
        this.draggableInstance.applyBounds({
          minY: this.windowHeight * (1 - this.EXPANDED_BREAKPOINT) - 1,
          maxY: this.windowHeight * (1 - this.actualMinBreakpoint) + 1
        });
      }

      // Step 9: Update position if currently at min height
      if (this.currentBreakpoint === this.actualMinBreakpoint) {
        this.updateBottomSheetPosition();
      }

      console.log('Calculated heights:', {
        headerHeight,
        searchBarHeight,
        selectedCouponHeight,
        buttonHeight,
        totalHeight: exactContentHeight,
        windowHeight: this.windowHeight,
        minBreakpoint: this.actualMinBreakpoint
      });
    }, 50); // Short delay to ensure DOM is updated
  }

  // New method to update bottom sheet position with better timing
  updateBottomSheetPosition(): void {
    gsap.to(this.bottomSheet.nativeElement, {
      y: this.windowHeight * (1 - this.actualMinBreakpoint),
      duration: 0.2,
      ease: 'power2.out',
      onComplete: () => {
        // Ensure selected coupon is visible
        this.scrollToSelectedCoupon();
      }
    });
  }

  // New method to scroll to selected coupon
  scrollToSelectedCoupon(): void {
    if (!this.sheetContent || !this.couponsList) return;

    const couponsArray = this.couponsList.nativeElement.querySelectorAll('.coupon-item');
    for (let i = 0; i < couponsArray.length; i++) {
      if (couponsArray[i].classList.contains('selected')) {
        gsap.to(this.sheetContent.nativeElement, {
          scrollTop: 0, // Always scroll to top to show selected coupon
          duration: 0.2,
          ease: 'power2.out'
        });
        break;
      }
    }
  }

  onDrag(): void {
    if (!this.draggableInstance) return;

    // Get current position
    const currentY = this.draggableInstance.y;

    // Determine drag direction with improved sensitivity
    if (currentY > this.previousY + 1) { // Added threshold to ignore tiny movements
      // Dragging down
      this.lastDragDirection = -1;
    } else if (currentY < this.previousY - 1) { // Added threshold to ignore tiny movements
      // Dragging up
      this.lastDragDirection = 1;
    }

    // Store previous position for next comparison
    this.previousY = currentY;

    // Enforce bounds with stronger resistance to prevent visual glitches
    const maxY = this.windowHeight * (1 - this.actualMinBreakpoint);
    const minY = this.windowHeight * (1 - this.EXPANDED_BREAKPOINT);

    if (currentY < minY) {
      // Trying to drag above expanded limit - snap back immediately to prevent disconnection
      gsap.to(this.bottomSheet.nativeElement, {
        y: minY,
        duration: 0.1, // Faster correction to avoid visual glitch
        ease: "power2.out"
      });
      this.draggableInstance.update(true);
    } else if (currentY > maxY) {
      // Trying to drag below min limit - snap back immediately
      gsap.to(this.bottomSheet.nativeElement, {
        y: maxY,
        duration: 0.1, // Faster correction to avoid visual glitch
        ease: "power2.out"
      });
      this.draggableInstance.update(true);
    }

    // Always ensure button is visible during dragging
    this.adjustButtonPosition();
  }

  onDragEnd(): void {
    if (!this.draggableInstance) return;

    // Get current position as percentage of window height
    const position = 1 - (this.draggableInstance.y / this.windowHeight);

    // Calculate drag duration for improved snapping logic
    const dragDuration = Date.now() - this.dragStartTime;
    const isQuickDrag = dragDuration < 300; // Consider drags shorter than 300ms as "quick flicks"

    // Improved snapping logic for different scenarios
    let targetBreakpoint;

    // Determine target breakpoint based on current position, drag direction, and drag speed
    if (this.lastDragDirection === 1) {
      // Dragging up
      if (position >= this.EXPANDED_BREAKPOINT - this.SNAP_TOLERANCE_UP ||
          (position >= this.DEFAULT_BREAKPOINT + (this.SNAP_TOLERANCE_UP / 2) && isQuickDrag)) {
        // Either close to EXPANDED or quick upward flick from above DEFAULT
        targetBreakpoint = this.EXPANDED_BREAKPOINT;
      } else if (position >= this.DEFAULT_BREAKPOINT - this.SNAP_TOLERANCE_UP ||
                 (position >= this.actualMinBreakpoint + (this.SNAP_TOLERANCE_UP / 2) && isQuickDrag)) {
        // Either close to DEFAULT or quick upward flick from above MIN
        targetBreakpoint = this.DEFAULT_BREAKPOINT;
      } else {
        targetBreakpoint = this.actualMinBreakpoint;
      }
    } else {
      // Dragging down or no movement
      if (position <= this.DEFAULT_BREAKPOINT + this.SNAP_TOLERANCE_DOWN ||
          (position <= this.EXPANDED_BREAKPOINT - (this.SNAP_TOLERANCE_DOWN / 2) && isQuickDrag)) {
        // Either close to DEFAULT or quick downward flick from below EXPANDED
        if (position <= this.actualMinBreakpoint + this.SNAP_TOLERANCE_DOWN ||
            (position <= this.DEFAULT_BREAKPOINT - (this.SNAP_TOLERANCE_DOWN / 2) && isQuickDrag)) {
          // Either close to MIN or quick downward flick from below DEFAULT
          targetBreakpoint = this.actualMinBreakpoint;
        } else {
          targetBreakpoint = this.DEFAULT_BREAKPOINT;
        }
      } else {
        targetBreakpoint = this.EXPANDED_BREAKPOINT;
      }
    }

    // Check if we're changing breakpoint
    const isBreakpointChange = targetBreakpoint !== this.currentBreakpoint;

    // When changing to a smaller breakpoint or from EXPANDED to DEFAULT,
    // ensure selected coupon is at the top and visible
    if (isBreakpointChange &&
        (targetBreakpoint < this.currentBreakpoint ||
         (this.currentBreakpoint === this.EXPANDED_BREAKPOINT && targetBreakpoint === this.DEFAULT_BREAKPOINT))) {
      this.moveSelectedCouponToFirst();
    }

    // Store the previous breakpoint
    const previousBreakpoint = this.currentBreakpoint;

    // If we're going to MIN breakpoint, recalculate it first for perfect fit
    if (targetBreakpoint === this.actualMinBreakpoint) {
      this.calculateMinBreakpoint();
    }

    // Animate to target position with smoother animation to prevent glitches
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

        // Always scroll to top when moving between breakpoints
        if (isBreakpointChange) {
          this.scrollToSelectedCoupon();
        }

        // Always update button position when breakpoint changes
        this.adjustButtonPosition();
      }
    });
  }

  // Improved scrollToTop method with smoother animation
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

  // Enhanced selectCoupon method for immediate recalculation
  selectCoupon(coupon: Coupon): void {
    // Only proceed if this is a different coupon
    if (!coupon.isSelected) {
      // Deselect all coupons first
      this.coupons.forEach(c => c.isSelected = false);

      // Select the clicked coupon
      coupon.isSelected = true;

      // If sheet is not at expanded breakpoint, move selected coupon to the top
      if (this.currentBreakpoint !== this.EXPANDED_BREAKPOINT) {
        this.moveSelectedCouponToFirst();
      }

      // Force recalculation of min height and button position
      setTimeout(() => {
        this.calculateMinBreakpoint();

        // If currently at min height, animate to the new min height for perfect fit
        if (this.currentBreakpoint === this.actualMinBreakpoint) {
          this.updateBottomSheetPosition();
        } else {
          this.adjustButtonPosition();
        }
      }, 50);
    }
  }

  // Improved animation for moving selected coupon to top
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

    // Scroll to top first to ensure visibility
    this.scrollToTop();

    // Use a short timeout to ensure scroll completes first
    setTimeout(() => {
      // Apply a fade transition for smoother visual effect
      if (this.couponsList) {
        gsap.to(this.couponsList.nativeElement, {
          opacity: 0.8,
          duration: 0.1,
          onComplete: () => {
            // Update the coupons array with the new order
            this.coupons = newOrder;

            // Fade back in
            gsap.to(this.couponsList.nativeElement, {
              opacity: 1,
              duration: 0.2
            });
          }
        });
      } else {
        // Fallback if couponsList ref is not available
        this.coupons = newOrder;
      }
    }, 100);
  }

  // More reliable method to move selected coupon to top
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

    // Scroll to top to ensure visibility
    this.scrollToTop();
  }

  getButtonLabel(): string {
    const selectedCoupon = this.coupons.find(coupon => coupon.isSelected);
    return selectedCoupon ? `Escolher ${selectedCoupon.title}` : 'Escolher serviço';
  }

  isButtonEnabled(): boolean {
    return this.coupons.some(coupon => coupon.isSelected);
  }

  trackByCouponId(index: number, coupon: Coupon): number {
    return coupon.id;
  }

  // Enhanced method to adjust button position for perfect fit
  adjustButtonPosition(): void {
    if (!this.button) return;

    // CRITICAL: Force button to stay at bottom, regardless of sheet position
    this.button.nativeElement.style.position = 'fixed';
    this.button.nativeElement.style.bottom = '0';
    this.button.nativeElement.style.left = '0';
    this.button.nativeElement.style.right = '0';

    // Ensure critical styles are always applied
    this.button.nativeElement.style.display = 'block';
    this.button.nativeElement.style.visibility = 'visible';
    this.button.nativeElement.style.zIndex = '99999';

    // **INSERTED CODE BLOCK START**
    const selectedCouponEl = this.couponsList?.nativeElement.querySelector('.coupon-item.selected');
    if (selectedCouponEl) {
      // Get the bottom position of the selected coupon
      const couponRect = selectedCouponEl.getBoundingClientRect();

      // Add a small offset to account for the border and margin
      const borderOffset = 2;
      const buttonTop = couponRect.bottom + borderOffset;

      // Set button position precisely at the bottom of the coupon with small gap for border
      gsap.set(this.button.nativeElement, {
        position: 'fixed',
        top: buttonTop,
        bottom: 'auto'
      });
    }
    // **INSERTED CODE BLOCK END**
  }

  // Improved search functionality
  searchCoupons(): Coupon[] {
    if (!this.searchTerm || this.searchTerm.trim() === '') {
      return this.coupons;
    }

    const term = this.searchTerm.toLowerCase().trim();
    const filteredCoupons = this.coupons.filter(coupon =>
      coupon.title.toLowerCase().includes(term)
    );

    // If we're at MIN_HEIGHT or DEFAULT_HEIGHT, ensure the selected coupon
    // is visible by putting it at the top of the filtered results
    if ((this.currentBreakpoint === this.actualMinBreakpoint ||
         this.currentBreakpoint === this.DEFAULT_BREAKPOINT) &&
        filteredCoupons.length > 0) {

      const selectedCoupon = filteredCoupons.find(coupon => coupon.isSelected);

      if (selectedCoupon) {
        // Remove the selected coupon from its current position
        const filteredWithoutSelected = filteredCoupons.filter(c => !c.isSelected);

        // Return with selected coupon at the top
        return [selectedCoupon, ...filteredWithoutSelected];
      }
    }

    return filteredCoupons;
  }

  clearSearch(): void {
    this.searchTerm = '';

    // When clearing search, ensure selected coupon is at the top if not at EXPANDED
    if (this.currentBreakpoint !== this.EXPANDED_BREAKPOINT) {
      this.moveSelectedCouponToFirst();
    }
  }
}