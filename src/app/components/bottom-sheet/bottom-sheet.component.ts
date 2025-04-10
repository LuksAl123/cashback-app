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
//   readonly EXPANDED_BREAKPOINT = 0.96;
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
//   isAnimatingToMinBreakpoint = false; // Add flag to track if we're animating to min breakpoint
//   previousBreakpoint = this.DEFAULT_BREAKPOINT; // Add a flag to track previous breakpoint for correct transitions
  
//   // NEW: Store app state for tab/screen switching
//   lastKnownBreakpoint = this.DEFAULT_BREAKPOINT;
//   lastKnownScrollTop = 0;
//   preventNextVisibilityUpdate = false;
//   isRestoringState = false;
//   visibilityChangeAnimationId: any = null; // For tracking and cancelling animations (accepts GSAP Tween)

//   // NEW: Store timeout IDs for proper cleanup
//   private timeoutIds: number[] = [];

//   constructor() {
//     gsap.registerPlugin(Draggable);
//   }

//   ngOnInit(): void {
//     // First coupon is selected by default
//     this.selectCoupon(this.coupons[0]);

//     // Add class to body to prevent background scrolling
//     document.body.classList.add('bottom-sheet-open');
//   }

//   ngAfterViewInit(): void {
//     // Set initial position at DEFAULT_BREAKPOINT
//     this.addTimeoutCallback(() => {
//       this.calculateMinBreakpoint();
//       this.setupBottomSheet();

//       // Set button to default position at bottom of screen initially
//       this.setButtonToDefaultPosition();

//       // After initial setup, observe for any DOM mutations (size changes)
//       // to recalculate the min breakpoint if necessary
//       this.setupResizeObserver();

//       // Add visibility change listener to handle tab switching
//       this.setupVisibilityChangeListeners();
//     }, 100);
//   }

//   // NEW: Helper method to store timeout IDs for cleanup
//   private addTimeoutCallback(callback: Function, delay: number): void {
//     const timeoutId = window.setTimeout(() => {
//       callback();
//       // Remove from array once executed
//       const index = this.timeoutIds.indexOf(timeoutId);
//       if (index !== -1) {
//         this.timeoutIds.splice(index, 1);
//       }
//     }, delay);
//     this.timeoutIds.push(timeoutId);
//   }

//   // Setup MutationObserver to detect size changes in elements
//   setupResizeObserver(): void {
//     if (window.ResizeObserver) {
//       const resizeObserver = new ResizeObserver(entries => {
//         if (this.currentBreakpoint === this.actualMinBreakpoint) {
//           this.calculateMinBreakpoint();
//           // Always use default button position
//           this.setButtonToDefaultPosition();
//         }
//       });

//       // Observe the critical elements whose size changes might affect our calculations
//       if (this.header) resizeObserver.observe(this.header.nativeElement);
//       if (this.searchBar) resizeObserver.observe(this.searchBar.nativeElement);
//       if (this.couponsList) resizeObserver.observe(this.couponsList.nativeElement);
//     }
//   }

//   // REVISED: Enhanced visibility change listeners with proper state preservation
//   setupVisibilityChangeListeners(): void {
//     // Handle visibility change (tab switching)
//     document.addEventListener('visibilitychange', this.handleVisibilityChange.bind(this));
    
//     // Handle window focus/blur events
//     window.addEventListener('focus', this.handleWindowFocus.bind(this));
//     window.addEventListener('blur', this.handleWindowBlur.bind(this));
    
//     // Additional pageshow event for more reliable detection
//     window.addEventListener('pageshow', this.handlePageShow.bind(this));
//   }
  
//   // NEW: Handle document visibility change
//   handleVisibilityChange(): void {
//     if (this.preventNextVisibilityUpdate) {
//       this.preventNextVisibilityUpdate = false;
//       return;
//     }
    
//     if (!document.hidden) {
//       // Tab became visible again - restore state after a short delay
//       this.addTimeoutCallback(() => {
//         this.restoreBottomSheetState();
//       }, 50);
//     } else {
//       // Tab hidden - save current state
//       this.saveBottomSheetState();
//     }
//   }
  
//   // NEW: Handle window focus
//   handleWindowFocus(): void {
//     if (this.preventNextVisibilityUpdate) {
//       this.preventNextVisibilityUpdate = false;
//       return;
//     }
    
//     // Window gained focus - restore state after a short delay
//     this.addTimeoutCallback(() => {
//       this.restoreBottomSheetState();
//     }, 50);
//   }
  
//   // NEW: Handle window blur
//   handleWindowBlur(): void {
//     // Window lost focus - save current state
//     this.saveBottomSheetState();
//   }
  
//   // NEW: Handle pageshow event
//   handlePageShow(event: any): void {
//     // If page is restored from bfcache
//     if (event.persisted) {
//       this.addTimeoutCallback(() => {
//         this.restoreBottomSheetState();
//       }, 50);
//     }
//   }
  
//   // NEW: Save the exact state of the bottom sheet
//   saveBottomSheetState(): void {
//     this.lastKnownBreakpoint = this.currentBreakpoint;
    
//     if (this.sheetContent) {
//       this.lastKnownScrollTop = this.sheetContent.nativeElement.scrollTop;
//     }
    
//     // Cancel any ongoing animations
//     if (this.visibilityChangeAnimationId) {
//       gsap.killTweensOf(this.bottomSheet.nativeElement);
//       this.visibilityChangeAnimationId = null;
//     }
//   }
  
//   // NEW: Restore the exact state of the bottom sheet
//   restoreBottomSheetState(): void {
//     if (!this.bottomSheet || this.isRestoringState) return;
    
//     this.isRestoringState = true;
    
//     // 1. Ensure min breakpoint calculation is up-to-date
//     this.calculateMinBreakpoint();
    
//     // 2. Ensure button is properly positioned
//     this.setButtonToDefaultPosition();

//     // 3. Set correct scroll state
//     this.isScrollEnabled = this.lastKnownBreakpoint === this.EXPANDED_BREAKPOINT;

//     // 4. Restore exact sheet position
//     this.visibilityChangeAnimationId = gsap.set(this.bottomSheet.nativeElement, {
//       y: this.windowHeight * (1 - this.lastKnownBreakpoint),
//       onComplete: () => {
//         // 5. Update component state
//         this.currentBreakpoint = this.lastKnownBreakpoint;

//         // 6. Restore scroll position if at expanded breakpoint
//         if (this.isScrollEnabled && this.sheetContent) {
//           this.sheetContent.nativeElement.scrollTop = this.lastKnownScrollTop;
//         }

//         // 7. Reset restoration flag
//         this.isRestoringState = false;
//         this.visibilityChangeAnimationId = null;

//         // 8. Move selected coupon to top if at min breakpoint
//         if (this.currentBreakpoint === this.actualMinBreakpoint) {
//           this.moveSelectedCouponToFirst();
//           this.scrollToSelectedCoupon();
//         }
//       }
//     });
//   }

//   ngOnDestroy(): void {
//     // Stop button visibility checks
//     this.maintainButtonVisibility = false;

//     // Remove class from body when component is destroyed
//     document.body.classList.remove('bottom-sheet-open');

//     // Clean up event listeners
//     document.removeEventListener('visibilitychange', this.handleVisibilityChange.bind(this));
//     window.removeEventListener('focus', this.handleWindowFocus.bind(this));
//     window.removeEventListener('blur', this.handleWindowBlur.bind(this));
//     window.removeEventListener('pageshow', this.handlePageShow.bind(this));

//     // Kill any ongoing GSAP animations
//     gsap.killTweensOf(this.bottomSheet.nativeElement);
//     if (this.sheetContent) {
//       gsap.killTweensOf(this.sheetContent.nativeElement);
//     }

//     // Clean up draggable instance
//     if (this.draggableInstance) {
//       this.draggableInstance.kill();
//     }

//     // Clear any pending timeouts
//     this.timeoutIds.forEach(id => window.clearTimeout(id));
//     this.timeoutIds = [];
//   }

//   @HostListener('window:resize')
//   onResize(): void {
//     this.windowHeight = window.innerHeight;
//     this.calculateMinBreakpoint();
//     this.setupBottomSheet();

//     // Always use default position for button
//     this.setButtonToDefaultPosition();
//   }

//   // Set button to default bottom position
//   setButtonToDefaultPosition(): void {
//     if (!this.button) return;

//     // Always force the button to be at the bottom of the screen with fixed position
//     gsap.set(this.button.nativeElement, {
//       position: 'fixed',
//       top: 'auto',
//       bottom: 0,
//       left: 0,
//       right: 0,
//       display: 'block',
//       visibility: 'visible',
//       opacity: 1,
//       zIndex: 99999
//     });
//   }

//   setupBottomSheet(): void {
//     // Reset any existing animation
//     if (this.draggableInstance) {
//       this.draggableInstance.kill();
//     }

//     // Initial position at DEFAULT_BREAKPOINT or last known breakpoint if restoring
//     const initialBreakpoint = this.isRestoringState ? this.lastKnownBreakpoint : this.currentBreakpoint;
    
//     gsap.set(this.bottomSheet.nativeElement, {
//       y: this.windowHeight * (1 - initialBreakpoint),
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
//         this.isAnimatingToMinBreakpoint = false; // Reset animation flag
//         this.preventNextVisibilityUpdate = true; // Prevent visibility changes during drag

//         // Save initial scroll position
//         if (this.sheetContent) {
//           this.initialScrollTop = this.sheetContent.nativeElement.scrollTop;
//         }

//         // Disable scrolling while dragging
//         this.isScrollEnabled = false;

//         // Record initial y position for determining drag direction
//         this.previousY = this.draggableInstance.y;
        
//         // When starting to drag, set button to default position
//         this.setButtonToDefaultPosition();
//       },
//       onDrag: this.onDrag.bind(this),
//       onDragEnd: this.onDragEnd.bind(this),
//       onThrowComplete: () => {
//         this.isDragging = false;
//         // Save current state after drag completes
//         this.saveBottomSheetState();
        
//         // Enable scrolling only if at expanded breakpoint
//         this.isScrollEnabled = this.currentBreakpoint === this.EXPANDED_BREAKPOINT;
        
//         // Reset prevention flag after drag
//         this.preventNextVisibilityUpdate = false;
        
//         // Ensure button stays in default position
//         this.setButtonToDefaultPosition();
//       }
//     })[0];
//   }

//   // CRITICAL: Precise calculation of min breakpoint for perfect fit
//   calculateMinBreakpoint(): void {
//     if (!this.header || !this.button || !this.searchBar || !this.couponsList) return;

//     // Add a short delay to ensure render cycle completes
//     this.addTimeoutCallback(() => {
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
      
//       // CRITICAL: Add extra space for border visibility
//       selectedCouponHeight += 8; // Add 8px to ensure border is fully visible
      
//       // Step 3: Measure button height
//       const buttonHeight = this.button.nativeElement.offsetHeight;
      
//       // Step 4: Calculate necessary space with adjustment for border
//       const adjustment = 8; // Increased adjustment for better stability
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
      
//       // Step 9: Update position if currently at min height and not restoring or dragging
//       if (this.currentBreakpoint === this.actualMinBreakpoint && !this.isDragging && !this.isRestoringState) {
//         this.updateBottomSheetPosition();
//       }
//     }, 50);
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

//         // Ensure button stays in default position
//         this.setButtonToDefaultPosition();

//         // Save state after update
//         this.saveBottomSheetState();
//       }
//     });
//   }

//   // Optimized method to scroll to selected coupon
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
    
//     // During dragging, always use default button position at bottom
//     this.setButtonToDefaultPosition();
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
    
//     // Save previous breakpoint
//     this.previousBreakpoint = this.currentBreakpoint;
    
//     // FIX BUG 2: Move selected coupon to top when transitioning from higher to lower breakpoint
//     const isMovingDown = targetBreakpoint < this.previousBreakpoint;

//     // Set animation flag when moving to min breakpoint
//     this.isAnimatingToMinBreakpoint = targetBreakpoint === this.actualMinBreakpoint && isMovingDown;
    
//     if (isMovingDown) {
//       // Move selected coupon to top when transitioning from higher to lower breakpoint
//       // This applies when going from EXPANDED→DEFAULT or DEFAULT→MIN
//       this.moveSelectedCouponToFirst();
//     }
    
//     // If we're going to MIN breakpoint, recalculate it first for perfect fit
//     if (targetBreakpoint === this.actualMinBreakpoint) {
//       this.calculateMinBreakpoint();
//     }
    
//     // Always keep button at default position during animation
//     this.setButtonToDefaultPosition();
    
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

//         // Always scroll to top when moving to a lower breakpoint
//         if (isMovingDown) {
//           this.scrollToSelectedCoupon();
//         }
        
//         // Always use default button position
//         this.setButtonToDefaultPosition();
        
//         this.isAnimatingToMinBreakpoint = false;
        
//         // Save the new state after animation completes
//         this.saveBottomSheetState();
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

//       // FIX BUG 2: Only move selected coupon to top if we're at MIN breakpoint
//       // NOT at DEFAULT breakpoint
//       if (this.currentBreakpoint === this.actualMinBreakpoint) {
//         this.moveSelectedCouponToFirst();
//       }

//       // Force recalculation of min height and button position
//       this.addTimeoutCallback(() => {
//         this.calculateMinBreakpoint();
        
//         // Ensure button stays in default position
//         this.setButtonToDefaultPosition();
        
//         // If currently at min height, animate to the new min height for perfect fit
//         if (this.currentBreakpoint === this.actualMinBreakpoint) {
//           this.updateBottomSheetPosition();
//         }
        
//         // Save state after coupon selection
//         this.saveBottomSheetState();
//       }, 50);
//     }
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
    
//     // Ensure button stays in default position
//     this.setButtonToDefaultPosition();
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

//   // FIXING MAJOR BUGS: 
//   // 1. Button always stays at bottom of screen regardless of breakpoint
//   // 2. Button doesn't stick to selected coupon after a while
//   // 3. Button doesn't move up when changing tabs
//   adjustButtonPosition(): void {
//     // CRITICAL FIX: Always use default position
//     this.setButtonToDefaultPosition();
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
    
//     // If we're at MIN_HEIGHT, ensure the selected coupon
//     // is visible by putting it at the top of the filtered results
//     if (this.currentBreakpoint === this.actualMinBreakpoint && filteredCoupons.length > 0) {
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
    
//     // When clearing search, ensure selected coupon is at the top if at MIN breakpoint
//     if (this.currentBreakpoint === this.actualMinBreakpoint) {
//       this.moveSelectedCouponToFirst();
//     }
    
//     // Ensure button stays in default position
//     this.setButtonToDefaultPosition();
    
//     // Save state after clearing search
//     this.saveBottomSheetState();
//   }
// }

import { Component, OnInit, ElementRef, ViewChild, AfterViewInit, HostListener } from '@angular/core';
import { gsap } from 'gsap';
import { Draggable } from 'gsap/Draggable';

interface Establishment {
  id: number;
  title: string;
  description: string;
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

  establishments: Establishment[] = [
    { id: 1, title: 'BIT SHOP', description: 'Receba 15% de cashback para compras a partir de 150 reais.', isSelected: true },
    { id: 2, title: 'TECH STORE', description: 'Ganhe 10% de cashback em compras acima de 100 reais.', isSelected: false },
    { id: 3, title: 'COFFEE SHOP', description: 'Aproveite 20% de cashback no seu café favorito.', isSelected: false },
    { id: 4, title: 'BOOK STORE', description: 'Desfrute de 12% de cashback em todos os livros.', isSelected: false },
    { id: 5, title: 'SPORT CENTER', description: 'Receba 15% de cashback em artigos esportivos.', isSelected: false },
    { id: 6, title: 'FASHION WEAR', description: 'Ganhe 8% de cashback em roupas e acessórios.', isSelected: false },
    { id: 7, title: 'ORGANIC MARKET', description: 'Desfrute de 10% de cashback em produtos orgânicos.', isSelected: false },
    { id: 8, title: 'GAME STORE', description: 'Aproveite 18% de cashback em jogos digitais.', isSelected: false },
    { id: 9, title: 'HOME DECOR', description: 'Receba 14% de cashback em itens de decoração.', isSelected: false },
    { id: 10, title: 'ELECTRONICS', description: 'Ganhe 12% de cashback em dispositivos eletrônicos.', isSelected: false },
    { id: 11, title: 'PET SHOP', description: 'Desfrute de 15% de cashback em produtos para pets.', isSelected: false },
    { id: 12, title: 'BEAUTY SALON', description: 'Aproveite 20% de cashback em serviços de beleza.', isSelected: false }
  ];

  // Breakpoints (as percentage of window height)
  readonly EXPANDED_BREAKPOINT = 0.96;
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
  isAnimatingToMinBreakpoint = false; // Add flag to track if we're animating to min breakpoint
  previousBreakpoint = this.DEFAULT_BREAKPOINT; // Add a flag to track previous breakpoint for correct transitions

  // NEW: Store app state for tab/screen switching
  lastKnownBreakpoint = this.DEFAULT_BREAKPOINT;
  lastKnownScrollTop = 0;
  preventNextVisibilityUpdate = false;
  isRestoringState = false;
  visibilityChangeAnimationId: any = null; // For tracking and cancelling animations (accepts GSAP Tween)

  // NEW: Store timeout IDs for proper cleanup
  private timeoutIds: number[] = [];

  constructor() {
    gsap.registerPlugin(Draggable);
  }

  ngOnInit(): void {
    // First establishment is selected by default
    this.selectEstablishment(this.establishments[0]);

    // Add class to body to prevent background scrolling
    document.body.classList.add('bottom-sheet-open');
  }

  ngAfterViewInit(): void {
    // Set initial position at DEFAULT_BREAKPOINT
    this.addTimeoutCallback(() => {
      this.calculateMinBreakpoint();
      this.setupBottomSheet();

      // Set button to default position at bottom of screen initially
      this.setButtonToDefaultPosition();

      // After initial setup, observe for any DOM mutations (size changes)
      // to recalculate the min breakpoint if necessary
      this.setupResizeObserver();

      // Add visibility change listener to handle tab switching
      this.setupVisibilityChangeListeners();
    }, 100);
  }

  // NEW: Helper method to store timeout IDs for cleanup
  private addTimeoutCallback(callback: Function, delay: number): void {
    const timeoutId = window.setTimeout(() => {
      callback();
      // Remove from array once executed
      const index = this.timeoutIds.indexOf(timeoutId);
      if (index !== -1) {
        this.timeoutIds.splice(index, 1);
      }
    }, delay);
    this.timeoutIds.push(timeoutId);
  }

  // Setup MutationObserver to detect size changes in elements
  setupResizeObserver(): void {
    if (window.ResizeObserver) {
      const resizeObserver = new ResizeObserver(entries => {
        if (this.currentBreakpoint === this.actualMinBreakpoint) {
          this.calculateMinBreakpoint();
          // Always use default button position
          this.setButtonToDefaultPosition();
        }
      });

      // Observe the critical elements whose size changes might affect our calculations
      if (this.header) resizeObserver.observe(this.header.nativeElement);
      if (this.searchBar) resizeObserver.observe(this.searchBar.nativeElement);
      if (this.couponsList) resizeObserver.observe(this.couponsList.nativeElement);
    }
  }

  // REVISED: Enhanced visibility change listeners with proper state preservation
  setupVisibilityChangeListeners(): void {
    // Handle visibility change (tab switching)
    document.addEventListener('visibilitychange', this.handleVisibilityChange.bind(this));

    // Handle window focus/blur events
    window.addEventListener('focus', this.handleWindowFocus.bind(this));
    window.addEventListener('blur', this.handleWindowBlur.bind(this));

    // Additional pageshow event for more reliable detection
    window.addEventListener('pageshow', this.handlePageShow.bind(this));
  }

  // NEW: Handle document visibility change
  handleVisibilityChange(): void {
    if (this.preventNextVisibilityUpdate) {
      this.preventNextVisibilityUpdate = false;
      return;
    }

    if (!document.hidden) {
      // Tab became visible again - restore state after a short delay
      this.addTimeoutCallback(() => {
        this.restoreBottomSheetState();
      }, 50);
    } else {
      // Tab hidden - save current state
      this.saveBottomSheetState();
    }
  }

  // NEW: Handle window focus
  handleWindowFocus(): void {
    if (this.preventNextVisibilityUpdate) {
      this.preventNextVisibilityUpdate = false;
      return;
    }

    // Window gained focus - restore state after a short delay
    this.addTimeoutCallback(() => {
      this.restoreBottomSheetState();
    }, 50);
  }

  // NEW: Handle window blur
  handleWindowBlur(): void {
    // Window lost focus - save current state
    this.saveBottomSheetState();
  }

  // NEW: Handle pageshow event
  handlePageShow(event: any): void {
    // If page is restored from bfcache
    if (event.persisted) {
      this.addTimeoutCallback(() => {
        this.restoreBottomSheetState();
      }, 50);
    }
  }

  // NEW: Save the exact state of the bottom sheet
  saveBottomSheetState(): void {
    this.lastKnownBreakpoint = this.currentBreakpoint;

    if (this.sheetContent) {
      this.lastKnownScrollTop = this.sheetContent.nativeElement.scrollTop;
    }

    // Cancel any ongoing animations
    if (this.visibilityChangeAnimationId) {
      gsap.killTweensOf(this.bottomSheet.nativeElement);
      this.visibilityChangeAnimationId = null;
    }
  }

  // NEW: Restore the exact state of the bottom sheet
  restoreBottomSheetState(): void {
    if (!this.bottomSheet || this.isRestoringState) return;

    this.isRestoringState = true;

    // 1. Ensure min breakpoint calculation is up-to-date
    this.calculateMinBreakpoint();

    // 2. Ensure button is properly positioned
    this.setButtonToDefaultPosition();

    // 3. Set correct scroll state
    this.isScrollEnabled = this.lastKnownBreakpoint === this.EXPANDED_BREAKPOINT;

    // 4. Restore exact sheet position
    this.visibilityChangeAnimationId = gsap.set(this.bottomSheet.nativeElement, {
      y: this.windowHeight * (1 - this.lastKnownBreakpoint),
      onComplete: () => {
        // 5. Update component state
        this.currentBreakpoint = this.lastKnownBreakpoint;

        // 6. Restore scroll position if at expanded breakpoint
        if (this.isScrollEnabled && this.sheetContent) {
          this.sheetContent.nativeElement.scrollTop = this.lastKnownScrollTop;
        }

        // 7. Reset restoration flag
        this.isRestoringState = false;
        this.visibilityChangeAnimationId = null;

        // 8. Move selected establishment to top if at min breakpoint
        if (this.currentBreakpoint === this.actualMinBreakpoint) {
          this.moveSelectedEstablishmentToFirst();
          this.scrollToSelectedEstablishment();
        }
      }
    });
  }

  ngOnDestroy(): void {
    // Stop button visibility checks
    this.maintainButtonVisibility = false;

    // Remove class from body when component is destroyed
    document.body.classList.remove('bottom-sheet-open');

    // Clean up event listeners
    document.removeEventListener('visibilitychange', this.handleVisibilityChange.bind(this));
    window.removeEventListener('focus', this.handleWindowFocus.bind(this));
    window.removeEventListener('blur', this.handleWindowBlur.bind(this));
    window.removeEventListener('pageshow', this.handlePageShow.bind(this));

    // Kill any ongoing GSAP animations
    gsap.killTweensOf(this.bottomSheet.nativeElement);
    if (this.sheetContent) {
      gsap.killTweensOf(this.sheetContent.nativeElement);
    }

    // Clean up draggable instance
    if (this.draggableInstance) {
      this.draggableInstance.kill();
    }

    // Clear any pending timeouts
    this.timeoutIds.forEach(id => window.clearTimeout(id));
    this.timeoutIds = [];
  }

  @HostListener('window:resize')
  onResize(): void {
    this.windowHeight = window.innerHeight;
    this.calculateMinBreakpoint();
    this.setupBottomSheet();

    // Always use default position for button
    this.setButtonToDefaultPosition();
  }

  // Set button to default bottom position
  setButtonToDefaultPosition(): void {
    if (!this.button) return;

    // Always force the button to be at the bottom of the screen with fixed position
    gsap.set(this.button.nativeElement, {
      position: 'fixed',
      top: 'auto',
      bottom: 0,
      left: 0,
      right: 0,
      display: 'block',
      visibility: 'visible',
      opacity: 1,
      zIndex: 99999
    });
  }

  setupBottomSheet(): void {
    // Reset any existing animation
    if (this.draggableInstance) {
      this.draggableInstance.kill();
    }

    // Initial position at DEFAULT_BREAKPOINT or last known breakpoint if restoring
    const initialBreakpoint = this.isRestoringState ? this.lastKnownBreakpoint : this.currentBreakpoint;

    gsap.set(this.bottomSheet.nativeElement, {
      y: this.windowHeight * (1 - initialBreakpoint),
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
        this.isAnimatingToMinBreakpoint = false; // Reset animation flag
        this.preventNextVisibilityUpdate = true; // Prevent visibility changes during drag

        // Save initial scroll position
        if (this.sheetContent) {
          this.initialScrollTop = this.sheetContent.nativeElement.scrollTop;
        }

        // Disable scrolling while dragging
        this.isScrollEnabled = false;

        // Record initial y position for determining drag direction
        this.previousY = this.draggableInstance.y;

        // When starting to drag, set button to default position
        this.setButtonToDefaultPosition();
      },
      onDrag: this.onDrag.bind(this),
      onDragEnd: this.onDragEnd.bind(this),
      onThrowComplete: () => {
        this.isDragging = false;
        // Save current state after drag completes
        this.saveBottomSheetState();

        // Enable scrolling only if at expanded breakpoint
        this.isScrollEnabled = this.currentBreakpoint === this.EXPANDED_BREAKPOINT;

        // Reset prevention flag after drag
        this.preventNextVisibilityUpdate = false;

        // Ensure button stays in default position
        this.setButtonToDefaultPosition();
      }
    })[0];
  }

  // CRITICAL: Precise calculation of min breakpoint for perfect fit
  calculateMinBreakpoint(): void {
    if (!this.header || !this.button || !this.searchBar || !this.couponsList) return;

    // Add a short delay to ensure render cycle completes
    this.addTimeoutCallback(() => {
      // Step 1: Get precise measurements of each component
      const headerHeight = this.header.nativeElement.offsetHeight;
      const searchBarHeight = this.searchBar.nativeElement.offsetHeight;

      // Step 2: Find the selected establishment and measure its exact height
      let selectedEstablishmentHeight = 0;
      let selectedEstablishmentEl = null;

      const establishmentsArray = this.couponsList.nativeElement.querySelectorAll('.establishment-wrapper');
      for (let i = 0; i < establishmentsArray.length; i++) {
        if (establishmentsArray[i].classList.contains('selected')) {
          selectedEstablishmentEl = establishmentsArray[i];
          selectedEstablishmentHeight = selectedEstablishmentEl.offsetHeight;
          break;
        }
      }

      // Use default if we can't find selected establishment
      if (selectedEstablishmentHeight === 0) {
        selectedEstablishmentHeight = 96; // Fallback height for establishment component (12vh)
      }

      // CRITICAL: Add extra space for border visibility and to ensure the entire component is visible
      selectedEstablishmentHeight += 16; // Increased padding to ensure the bottom is fully visible

      // Step 3: Measure button height
      const buttonHeight = this.button.nativeElement.offsetHeight;

      // Step 4: Calculate necessary space with adjustment for border
      const adjustment = 16; // Increased adjustment for better stability and visibility
      const exactContentHeight = headerHeight + searchBarHeight + selectedEstablishmentHeight + buttonHeight + adjustment;

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

      // Step 9: Update position if currently at min height and not restoring or dragging
      if (this.currentBreakpoint === this.actualMinBreakpoint && !this.isDragging && !this.isRestoringState) {
        this.updateBottomSheetPosition();
      }
    }, 50);
  }

  // New method to update bottom sheet position with better timing
  updateBottomSheetPosition(): void {
    gsap.to(this.bottomSheet.nativeElement, {
      y: this.windowHeight * (1 - this.actualMinBreakpoint),
      duration: 0.2,
      ease: 'power2.out',
      onComplete: () => {
        // Ensure selected establishment is visible
        this.scrollToSelectedEstablishment();

        // Ensure button stays in default position
        this.setButtonToDefaultPosition();

        // Save state after update
        this.saveBottomSheetState();
      }
    });
  }

  // Optimized method to scroll to selected establishment
  scrollToSelectedEstablishment(): void {
    if (!this.sheetContent || !this.couponsList) return;

    const establishmentsArray = this.couponsList.nativeElement.querySelectorAll('.establishment-wrapper');
    for (let i = 0; i < establishmentsArray.length; i++) {
      if (establishmentsArray[i].classList.contains('selected')) {
        gsap.to(this.sheetContent.nativeElement, {
          scrollTop: 0, // Always scroll to top to show selected establishment
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

    // During dragging, always use default button position at bottom
    this.setButtonToDefaultPosition();
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

    // Save previous breakpoint
    this.previousBreakpoint = this.currentBreakpoint;

    // FIX BUG 2: Move selected establishment to top when transitioning from higher to lower breakpoint
    const isMovingDown = targetBreakpoint < this.previousBreakpoint;

    // Set animation flag when moving to min breakpoint
    this.isAnimatingToMinBreakpoint = targetBreakpoint === this.actualMinBreakpoint && isMovingDown;

    if (isMovingDown) {
      // Move selected establishment to top when transitioning from higher to lower breakpoint
      // This applies when going from EXPANDED→DEFAULT or DEFAULT→MIN
      this.moveSelectedEstablishmentToFirst();
    }

    // If we're going to MIN breakpoint, recalculate it first for perfect fit
    if (targetBreakpoint === this.actualMinBreakpoint) {
      this.calculateMinBreakpoint();
    }

    // Always keep button at default position during animation
    this.setButtonToDefaultPosition();

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

        // Always scroll to top when moving to a lower breakpoint
        if (isMovingDown) {
          this.scrollToSelectedEstablishment();
        }

        // Always use default button position
        this.setButtonToDefaultPosition();

        this.isAnimatingToMinBreakpoint = false;

        // Save the new state after animation completes
        this.saveBottomSheetState();
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

  // Enhanced selectEstablishment method for immediate recalculation
  selectEstablishment(establishment: Establishment): void {
    // Only proceed if this is a different establishment
    if (!establishment.isSelected) {
      // Deselect all establishments first
      this.establishments.forEach(c => c.isSelected = false);

      // Select the clicked establishment
      establishment.isSelected = true;

      // FIX BUG 2: Only move selected establishment to top if we're at MIN breakpoint
      // NOT at DEFAULT breakpoint
      if (this.currentBreakpoint === this.actualMinBreakpoint) {
        this.moveSelectedEstablishmentToFirst();
      }

      // Force recalculation of min height and button position
      this.addTimeoutCallback(() => {
        this.calculateMinBreakpoint();

        // Ensure button stays in default position
        this.setButtonToDefaultPosition();

        // If currently at min height, animate to the new min height for perfect fit
        if (this.currentBreakpoint === this.actualMinBreakpoint) {
          this.updateBottomSheetPosition();
        }

        // Save state after establishment selection
        this.saveBottomSheetState();
      }, 50);
    }
  }

  // More reliable method to move selected establishment to top
  moveSelectedEstablishmentToFirst(): void {
    // Find the selected establishment
    const selectedEstablishment = this.establishments.find(establishment => establishment.isSelected);
    if (!selectedEstablishment) return;

    // Find the index of the selected establishment
    const selectedIndex = this.establishments.findIndex(establishment => establishment.isSelected);

    // If it's already the first one, do nothing
    if (selectedIndex <= 0) return;

    // Remove the selected establishment from its current position
    this.establishments.splice(selectedIndex, 1);

    // Add it to the beginning of the array
    this.establishments = [selectedEstablishment, ...this.establishments];

    // Scroll to top to ensure visibility
    this.scrollToTop();

    // Ensure button stays in default position
    this.setButtonToDefaultPosition();
  }

  getButtonLabel(): string {
    const selectedEstablishment = this.establishments.find(establishment => establishment.isSelected);
    return selectedEstablishment ? `Escolher ${selectedEstablishment.title}` : 'Escolher estabelecimento';
  }

  isButtonEnabled(): boolean {
    return this.establishments.some(establishment => establishment.isSelected);
  }

  trackByEstablishmentId(index: number, establishment: Establishment): number {
    return establishment.id;
  }

  // FIXING MAJOR BUGS: 
  // 1. Button always stays at bottom of screen regardless of breakpoint
  // 2. Button doesn't stick to selected establishment after a while
  // 3. Button doesn't move up when changing tabs
  adjustButtonPosition(): void {
    // CRITICAL FIX: Always use default position
    this.setButtonToDefaultPosition();
  }

  // Improved search functionality
  searchEstablishments(): Establishment[] {
    if (!this.searchTerm || this.searchTerm.trim() === '') {
      return this.establishments;
    }

    const term = this.searchTerm.toLowerCase().trim();
    const filteredEstablishments = this.establishments.filter(establishment => 
      establishment.title.toLowerCase().includes(term) || 
      establishment.description.toLowerCase().includes(term)
    );

    // If we're at MIN_HEIGHT, ensure the selected establishment
    // is visible by putting it at the top of the filtered results
    if (this.currentBreakpoint === this.actualMinBreakpoint && filteredEstablishments.length > 0) {
      const selectedEstablishment = filteredEstablishments.find(establishment => establishment.isSelected);

      if (selectedEstablishment) {
        // Remove the selected establishment from its current position
        const filteredWithoutSelected = filteredEstablishments.filter(e => !e.isSelected);

        // Return with selected establishment at the top
        return [selectedEstablishment, ...filteredWithoutSelected];
      }
    }

    return filteredEstablishments;
  }

  clearSearch(): void {
    this.searchTerm = '';

    // When clearing search, ensure selected establishment is at the top if at MIN breakpoint
    if (this.currentBreakpoint === this.actualMinBreakpoint) {
      this.moveSelectedEstablishmentToFirst();
    }

    // Ensure button stays in default position
    this.setButtonToDefaultPosition();

    // Save state after clearing search
    this.saveBottomSheetState();
  }
}