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
    if (establishments.length > 0 && !this.selectedEstablishmentId) {
      this.onEstablishmentSelected(establishments[0]);
    }
    this.addTimeoutCallback(() => {
      this.calculateMinBreakpoint();
    }, 50);
  }

  onEstablishmentSelected(establishment: Establishment): void {
    console.log('Selected establishment:', establishment);

    this.selectedEstablishmentId = establishment.id;
    this.currentEstablishment = establishment;

    this.establishments.forEach(est => {
      est.isSelected = est.id === establishment.id;
    });

    if (this.currentBreakpoint === this.actualMinBreakpoint) {
      this.moveSelectedEstablishmentToFirst();
    }

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

    const newIdsString = JSON.stringify(ids);
    const cachedIdsString = JSON.stringify(this.cachedOrderedIds);

    if (newIdsString !== cachedIdsString) {
      console.log('Providing ordered IDs to child:', ids);
      this.cachedOrderedIds = [...ids];
    }

    return this.cachedOrderedIds;
  }

  ngAfterViewInit(): void {
    this.initialRenderCompleted = true;

    this.addTimeoutCallback(() => {
      this.calculateMinBreakpoint();
      this.setupBottomSheet();

      this.setButtonToDefaultPosition();

      this.setupResizeObserver();

      this.setupVisibilityChangeListeners();
    }, 100);
  }

  private addTimeoutCallback(callback: Function, delay: number): void {
    const timeoutId = window.setTimeout(() => {
      callback();
      const index = this.timeoutIds.indexOf(timeoutId);
      if (index !== -1) {
        this.timeoutIds.splice(index, 1);
      }
    }, delay);
    this.timeoutIds.push(timeoutId);
  }

  setupResizeObserver(): void {
    if (window.ResizeObserver) {
      const resizeObserver = new ResizeObserver(entries => {
        if (this.currentBreakpoint === this.actualMinBreakpoint) {
          this.calculateMinBreakpoint();
          this.setButtonToDefaultPosition();
        }
      });
      if (this.header) resizeObserver.observe(this.header.nativeElement);
      if (this.searchBar) resizeObserver.observe(this.searchBar.nativeElement);
      if (this.couponsList) resizeObserver.observe(this.couponsList.nativeElement);
    }
  }

  setupVisibilityChangeListeners(): void {
    document.addEventListener('visibilitychange', this.handleVisibilityChange.bind(this));

    window.addEventListener('focus', this.handleWindowFocus.bind(this));
    window.addEventListener('blur', this.handleWindowBlur.bind(this));

    window.addEventListener('pageshow', this.handlePageShow.bind(this));
  }

  handleVisibilityChange(): void {
    if (this.preventNextVisibilityUpdate) {
      this.preventNextVisibilityUpdate = false;
      return;
    }

    if (!document.hidden) {
      this.addTimeoutCallback(() => {
        this.restoreBottomSheetState();
      }, 50);
    } else {
      this.saveBottomSheetState();
    }
  }

  handleWindowFocus(): void {
    if (this.preventNextVisibilityUpdate) {
      this.preventNextVisibilityUpdate = false;
      return;
    }

    this.addTimeoutCallback(() => {
      this.restoreBottomSheetState();
    }, 50);
  }

  handleWindowBlur(): void {
    this.saveBottomSheetState();
  }

  handlePageShow(event: any): void {
    if (event.persisted) {
      this.addTimeoutCallback(() => {
        this.restoreBottomSheetState();
      }, 50);
    }
  }

  saveBottomSheetState(): void {
    this.lastKnownBreakpoint = this.currentBreakpoint;

    if (this.sheetContent) {
      this.lastKnownScrollTop = this.sheetContent.nativeElement.scrollTop;
    }

    if (this.visibilityChangeAnimationId) {
      gsap.killTweensOf(this.bottomSheet.nativeElement);
      this.visibilityChangeAnimationId = null;
    }
  }

  restoreBottomSheetState(): void {
    if (!this.bottomSheet || this.isRestoringState) return;

    this.isRestoringState = true;

    this.calculateMinBreakpoint();

    this.setButtonToDefaultPosition();

    this.isScrollEnabled = this.lastKnownBreakpoint === this.EXPANDED_BREAKPOINT;

    this.visibilityChangeAnimationId = gsap.set(this.bottomSheet.nativeElement, {
      y: this.windowHeight * (1 - this.lastKnownBreakpoint),
      onComplete: () => {
        
        this.currentBreakpoint = this.lastKnownBreakpoint;

        if (this.isScrollEnabled && this.sheetContent) {
          this.sheetContent.nativeElement.scrollTop = this.lastKnownScrollTop;
        }

        this.isRestoringState = false;
        this.visibilityChangeAnimationId = null;

        if (this.currentBreakpoint === this.actualMinBreakpoint) {
          this.moveSelectedEstablishmentToFirst();
          this.scrollToSelectedEstablishment();
          this.synchronizeEstablishmentData();
        }
      }
    });
  }

  ngOnDestroy(): void {
    this.maintainButtonVisibility = false;

    document.body.classList.remove('bottom-sheet-open');

    document.removeEventListener('visibilitychange', this.handleVisibilityChange.bind(this));
    window.removeEventListener('focus', this.handleWindowFocus.bind(this));
    window.removeEventListener('blur', this.handleWindowBlur.bind(this));
    window.removeEventListener('pageshow', this.handlePageShow.bind(this));

    gsap.killTweensOf(this.bottomSheet.nativeElement);
    if (this.sheetContent) {
      gsap.killTweensOf(this.sheetContent.nativeElement);
    }

    if (this.draggableInstance) {
      this.draggableInstance.kill();
    }

    this.timeoutIds.forEach(id => window.clearTimeout(id));
    this.timeoutIds = [];
  }

  @HostListener('window:resize')
  onResize(): void {
    this.windowHeight = window.innerHeight;
    this.calculateMinBreakpoint();
    this.setupBottomSheet();

    this.setButtonToDefaultPosition();
  }

  setButtonToDefaultPosition(): void {
    if (!this.button) return;

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
    if (this.draggableInstance) {
      this.draggableInstance.kill();
    }

    const initialBreakpoint = this.isRestoringState ? this.lastKnownBreakpoint : this.currentBreakpoint;

    gsap.set(this.bottomSheet.nativeElement, {
      y: this.windowHeight * (1 - initialBreakpoint),
      height: this.windowHeight
    });

    this.draggableInstance = Draggable.create(this.bottomSheet.nativeElement, {
      type: 'y',
      bounds: {
        minY: this.windowHeight * (1 - this.EXPANDED_BREAKPOINT) - 1,
        maxY: this.windowHeight * (1 - this.actualMinBreakpoint) + 1
      },
      edgeResistance: 0.95,
      inertia: true,
      overshootTolerance: 0,
      onDragStart: () => {
        this.isDragging = true;
        this.dragStartTime = Date.now();
        this.isAnimatingToMinBreakpoint = false;
        this.preventNextVisibilityUpdate = true;

        if (this.sheetContent) {
          this.initialScrollTop = this.sheetContent.nativeElement.scrollTop;
        }

        this.isScrollEnabled = false;

        this.previousY = this.draggableInstance.y;

        this.setButtonToDefaultPosition();
      },
      onDrag: this.onDrag.bind(this),
      onDragEnd: this.onDragEnd.bind(this),
      onThrowComplete: () => {
        this.isDragging = false;
        this.saveBottomSheetState();

        this.isScrollEnabled = this.currentBreakpoint === this.EXPANDED_BREAKPOINT;

        this.preventNextVisibilityUpdate = false;

        this.setButtonToDefaultPosition();
      }
    })[0];
  }

  calculateMinBreakpoint(): void {
    if (!this.header || !this.button || !this.searchBar || !this.couponsList) return;

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
        selectedEstablishmentHeight = 96;
      }

      selectedEstablishmentHeight += 16;

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

    const currentY = this.draggableInstance.y;

    if (currentY > this.previousY + 1) {
      this.lastDragDirection = -1;
    } else if (currentY < this.previousY - 1) {
      this.lastDragDirection = 1;
    }

    this.previousY = currentY;

    const maxY = this.windowHeight * (1 - this.actualMinBreakpoint);
    const minY = this.windowHeight * (1 - this.EXPANDED_BREAKPOINT);

    if (currentY < minY) {
      gsap.to(this.bottomSheet.nativeElement, {
        y: minY,
        duration: 0.1,
        ease: "power2.out"
      });
      this.draggableInstance.update(true);
    } else if (currentY > maxY) {
      gsap.to(this.bottomSheet.nativeElement, {
        y: maxY,
        duration: 0.1,
        ease: "power2.out"
      });
      this.draggableInstance.update(true);
    }

    this.setButtonToDefaultPosition();
  }

  onDragEnd(): void {
    if (!this.draggableInstance) return;

    const position = 1 - (this.draggableInstance.y / this.windowHeight);

    const dragDuration = Date.now() - this.dragStartTime;
    const isQuickDrag = dragDuration < 300;

    let targetBreakpoint;

    if (this.lastDragDirection === 1) {
      if (position >= this.EXPANDED_BREAKPOINT - this.SNAP_TOLERANCE_UP || 
          (position >= this.DEFAULT_BREAKPOINT + (this.SNAP_TOLERANCE_UP / 2) && isQuickDrag)) {
        targetBreakpoint = this.EXPANDED_BREAKPOINT;
      } else if (position >= this.DEFAULT_BREAKPOINT - this.SNAP_TOLERANCE_UP || 
                (position >= this.actualMinBreakpoint + (this.SNAP_TOLERANCE_UP / 2) && isQuickDrag)) {
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

  scrollToTop(): void {
    if (this.sheetContent) {
      gsap.to(this.sheetContent.nativeElement, {
        scrollTop: 0,
        duration: 0.2,
        ease: 'power2.out'
      });
    }
  }

  selectEstablishment(establishment: Establishment): void {
    if (!establishment.isSelected) {
      this.establishments.forEach(c => c.isSelected = false);
      establishment.isSelected = true;
  
      if (this.currentBreakpoint === this.actualMinBreakpoint) {
        this.moveSelectedEstablishmentToFirst();
      }
      this.addTimeoutCallback(() => {
        this.calculateMinBreakpoint();
        this.setButtonToDefaultPosition();
        if (this.currentBreakpoint === this.actualMinBreakpoint) {
          this.updateBottomSheetPosition();
        }
        this.saveBottomSheetState();
      }, 50);
    }
  }

  moveSelectedEstablishmentToFirst(): void {
    const selectedEstablishment = this.establishments.find(establishment => establishment.isSelected);
    if (!selectedEstablishment) {
      console.log('No selected establishment found');
      return;
    }
    const selectedIndex = this.establishments.findIndex(establishment => establishment.isSelected);
    if (selectedIndex <= 0) {
      console.log('Selected establishment already at first position');
      return;
    }
  
    console.log('Moving establishment ID', selectedEstablishment.id, 'from position', selectedIndex, 'to first position');
  
    const reorderedEstablishments = [
      selectedEstablishment,
      ...this.establishments.slice(0, selectedIndex),
      ...this.establishments.slice(selectedIndex + 1)
    ];
    this.establishments = reorderedEstablishments;
    
    console.log('New establishment order:', this.establishments.map(e => e.id));
    
    const currentId = this.selectedEstablishmentId;
    this.selectedEstablishmentId = null;
    
    this.cachedOrderedIds = [];
    
    setTimeout(() => {
      this.selectedEstablishmentId = currentId;
      this.scrollToTop();
    }, 50);
    
    this.setButtonToDefaultPosition();
  }

  synchronizeEstablishmentData(): void {
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

    if (this.currentBreakpoint === this.actualMinBreakpoint && filteredEstablishments.length > 0) {
      const selectedEstablishment = filteredEstablishments.find(establishment => establishment.isSelected);

      if (selectedEstablishment) {
        const filteredWithoutSelected = filteredEstablishments.filter(e => !e.isSelected);
        return [selectedEstablishment, ...filteredWithoutSelected];
      }
    }

    return filteredEstablishments;
  }

  clearSearch(): void {
    this.searchTerm = '';

    if (this.currentBreakpoint === this.actualMinBreakpoint) {
      this.moveSelectedEstablishmentToFirst();
    }
    this.setButtonToDefaultPosition();
    this.saveBottomSheetState();
  }
}