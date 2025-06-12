import { Component, EventEmitter, Output, OnInit, ElementRef, ViewChild, AfterViewInit, HostListener, Renderer2 } from '@angular/core';
import { gsap } from 'gsap';
import { Draggable } from 'gsap/Draggable';
import { Establishment } from 'src/app/interface/establishment';

@Component({
  selector: 'app-bottom-sheet',
  templateUrl: './bottom-sheet.component.html',
  styleUrls: ['./bottom-sheet.component.scss'],
  standalone: false 
})

export class BottomSheetComponent implements OnInit, AfterViewInit {

  @Output() loadingChange = new EventEmitter<boolean>();

  isLoading: boolean = true;

  @ViewChild('bottomSheet') bottomSheet!: ElementRef;
  @ViewChild('sheetContent') sheetContent!: ElementRef;
  @ViewChild('header') header!: ElementRef;
  @ViewChild('couponsList') couponsList!: ElementRef;
  @ViewChild('button') button!: ElementRef;
  @ViewChild('searchBar') searchBar!: ElementRef;

  establishments: Establishment[] = [];
  selectedEstablishmentId: number | null = null;
  currentEstablishment: Establishment | null = null;
  searchTerm = '';

  // Breakpoints (as percentage of window height)
  readonly EXPANDED_BREAKPOINT = 0.96;
  readonly DEFAULT_BREAKPOINT = 0.6;
  readonly MIN_BREAKPOINT_BASE = 0.15;
  readonly SNAP_TOLERANCE_UP = 0.15;
  readonly SNAP_TOLERANCE_DOWN = 0.15;
  readonly MIN_SEPARATION = 0.1;

  windowHeight = window.innerHeight;
  isDragging = false;
  currentBreakpoint = this.DEFAULT_BREAKPOINT;
  draggableInstance: any;
  actualMinBreakpoint = this.MIN_BREAKPOINT_BASE;
  isScrollEnabled = false;
  lastDragDirection = 0;
  previousY = 0;
  initialScrollTop = 0;
  dragStartTime = 0;
  maintainButtonVisibility = true;
  isAnimatingToMinBreakpoint = false;
  previousBreakpoint = this.DEFAULT_BREAKPOINT;
  lastKnownBreakpoint = this.DEFAULT_BREAKPOINT;
  lastKnownScrollTop = 0;
  preventNextVisibilityUpdate = false;
  isRestoringState = false;
  visibilityChangeAnimationId: any = null;
  initialRenderCompleted = false;
  private timeoutIds: number[] = [];
  private cachedOrderedIds: number[] = [];

  constructor(private renderer: Renderer2) {
    gsap.registerPlugin(Draggable);
    this.prePositionBottomSheet();
  }

  prePositionBottomSheet(): void {
    setTimeout(() => {
      const sheetElements = document.querySelectorAll('.bottom-sheet');
      if (sheetElements.length > 0) {
        const y = this.windowHeight * (1 - this.DEFAULT_BREAKPOINT);
        this.renderer.setStyle(sheetElements[0], 'transform', `translateY(${y}px)`);
        this.renderer.setStyle(sheetElements[0], 'height', `${this.windowHeight}px`);
      }
    }, 0);
  }

  ngOnInit(): void {
    this.loadingChange.emit(this.isLoading);
    document.body.classList.add('bottom-sheet-open');
    const style = document.createElement('style');
    style.innerHTML = `
      .bottom-sheet {
        transform: translateY(${this.windowHeight * (1 - this.DEFAULT_BREAKPOINT)}px);
        height: ${this.windowHeight}px;
      }
    `;
    document.head.appendChild(style);
  }

  onLoadingChange(isLoading: boolean): void {
    this.isLoading = isLoading;
    this.loadingChange.emit(isLoading);
  }

  onEstablishmentsLoaded(establishments: Establishment[]): void {
    this.establishments = establishments;
    // Select first establishment by default if available
    if (establishments.length > 0 && !this.selectedEstablishmentId) {
      this.onEstablishmentSelected(establishments[0]);
    }
    // Recalculate min breakpoint after establishments are loaded
    this.addTimeoutCallback(() => {
      this.calculateMinBreakpoint();
    }, 50);
  }

  onEstablishmentSelected(establishment: Establishment): void {
    console.log('Selected establishment:', establishment);

    // Update the ID
    this.selectedEstablishmentId = establishment.id;
    this.currentEstablishment = establishment;

    // Make sure all establishments have correct selection state
    this.establishments.forEach(est => {
      est.isSelected = est.id === establishment.id;
    });

    // If at min breakpoint, make sure selected is visible
    if (this.currentBreakpoint === this.actualMinBreakpoint) {
      this.moveSelectedEstablishmentToFirst();
    }

    // Force recalculation of min height and button position
    this.addTimeoutCallback(() => {
      this.calculateMinBreakpoint();
      this.setButtonToDefaultPosition();

      if (this.currentBreakpoint === this.actualMinBreakpoint) {
        this.updateBottomSheetPosition();
      }

      this.saveBottomSheetState();
    }, 50);
  }

  getOrderedEstablishmentIds(): number[] {
    if (!this.establishments || this.establishments.length === 0) {
      return [];
    }

    const ids = this.establishments.map(establishment => establishment.id);

    // Only log if the IDs actually changed to avoid log spam
    const newIdsString = JSON.stringify(ids);
    const cachedIdsString = JSON.stringify(this.cachedOrderedIds);

    if (newIdsString !== cachedIdsString) {
      console.log('Providing ordered IDs to child:', ids);
      this.cachedOrderedIds = [...ids];
    }

    return this.cachedOrderedIds;
  }

  ngAfterViewInit(): void {
    // Mark as ready to skip initial animation
    this.initialRenderCompleted = true;

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

  // Helper method to store timeout IDs for cleanup
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
          this.synchronizeEstablishmentData(); // Add this line
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

    // MODIFIED: Use gsap.set without animation for initial positioning
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

  calculateMinBreakpoint(): void {
    if (!this.header || !this.button || !this.searchBar || !this.couponsList) return;

    // Add a short delay to ensure render cycle completes
    this.addTimeoutCallback(() => {
      // Step 1: Get precise measurements of each component
      const headerHeight = this.header.nativeElement.offsetHeight;
      const searchBarHeight = this.searchBar.nativeElement.offsetHeight;

      // Step 2: Find an establishment and measure its height
      // Since we know the height should be consistent, just use the first one
      const establishmentContainers = document.querySelectorAll('.establishment-container');
      let selectedEstablishmentHeight = 0;
      if (establishmentContainers.length > 0) {
        selectedEstablishmentHeight = establishmentContainers[0].clientHeight;
      } else {
        selectedEstablishmentHeight = 96; // Fallback height
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
    if (!this.sheetContent) return;

    // Just scroll to top since with the API the selected item will be at the top
    gsap.to(this.sheetContent.nativeElement, {
      scrollTop: 0,
      duration: 0.2,
      ease: 'power2.out'
    });
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
      this.synchronizeEstablishmentData(); // Add this line
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

  selectEstablishment(establishment: Establishment): void {
    // Only proceed if this is a different establishment
    if (!establishment.isSelected) {
      // Deselect all establishments first
      this.establishments.forEach(c => c.isSelected = false);
  
      // Select the clicked establishment
      establishment.isSelected = true;
  
      // Only move selected establishment to top if we're at MIN breakpoint
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

  moveSelectedEstablishmentToFirst(): void {
    // Find the selected establishment
    const selectedEstablishment = this.establishments.find(establishment => establishment.isSelected);
    if (!selectedEstablishment) {
      console.log('No selected establishment found');
      return;
    }
  
    // Find the index of the selected establishment
    const selectedIndex = this.establishments.findIndex(establishment => establishment.isSelected);
  
    // If it's already the first one, do nothing
    if (selectedIndex <= 0) {
      console.log('Selected establishment already at first position');
      return;
    }
  
    console.log('Moving establishment ID', selectedEstablishment.id, 'from position', selectedIndex, 'to first position');
  
    // Create a new array with the selected establishment first
    // This is cleaner than splice operations
    const reorderedEstablishments = [
      selectedEstablishment,
      ...this.establishments.slice(0, selectedIndex),
      ...this.establishments.slice(selectedIndex + 1)
    ];
  
    // Replace the entire array at once
    this.establishments = reorderedEstablishments;
    
    console.log('New establishment order:', this.establishments.map(e => e.id));
    
    // Force the child component to fully refresh by first clearing the selectedEstablishmentId
    const currentId = this.selectedEstablishmentId;
    this.selectedEstablishmentId = null;
    
    // Clear the cached IDs to ensure proper update
    this.cachedOrderedIds = [];
    
    // Use a longer timeout to ensure the Angular change detection has completed one cycle
    setTimeout(() => {
      // Restore the selected ID, forcing a second change detection cycle
      this.selectedEstablishmentId = currentId;
      // Scroll to top to ensure visibility
      this.scrollToTop();
    }, 50); // Increased timeout for more reliable operation
    
    // Ensure button stays in default position
    this.setButtonToDefaultPosition();
  }

  synchronizeEstablishmentData(): void {
    // This method forces the establishment component to refresh its data
    // by toggling the selectedEstablishmentId
    if (this.selectedEstablishmentId !== null) {
      const currentId = this.selectedEstablishmentId;
      this.selectedEstablishmentId = null;
      setTimeout(() => {
        this.selectedEstablishmentId = currentId;
      }, 0);
    }
  }

  getButtonLabel(): string {
    if (!this.currentEstablishment) return 'Escolher estabelecimento';
    
    return `Escolher ${this.getEstablishmentName(this.currentEstablishment)}`;
  }

  getEstablishmentName(establishment: Establishment): string {
    if (!establishment.nomeempresa) return '';
    const names = establishment.nomeempresa.split(' ');
    return names.slice(0, 2).join(' ');
  }

  isButtonEnabled(): boolean {
    return this.selectedEstablishmentId !== null;
  }

  trackByEstablishmentId(index: number, establishment: Establishment): number {
    return establishment.id;
  }

  // Improved search functionality
  searchEstablishments(): Establishment[] {
    if (!this.searchTerm || this.searchTerm.trim() === '') {
      return this.establishments;
    }

    const term = this.searchTerm.toLowerCase().trim();
    const filteredEstablishments = this.establishments.filter(establishment => 
      establishment.nomeempresa.toLowerCase().includes(term) || 
      (establishment.cb_perc_creditoporcompra + '').includes(term) ||
      (establishment.vr_comprasacimade + '').includes(term)
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