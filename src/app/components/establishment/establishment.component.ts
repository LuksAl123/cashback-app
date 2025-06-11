import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { catchError, of } from 'rxjs';
import { HttpService } from 'src/app/services/http/http.service';
import { Establishment } from 'src/app/interface/establishment';

@Component({
  selector: 'app-establishment',
  templateUrl: './establishment.component.html',
  styleUrls: ['./establishment.component.scss'],
  standalone: false
})

export class EstablishmentComponent implements OnInit {
  // Replace simple Input with getter/setter
  private _selectedEstablishmentId: number | null = null;

  @Input()
  set selectedEstablishmentId(value: number | null) {
    console.log('selectedEstablishmentId changed:', value);
    this._selectedEstablishmentId = value;
    // Force re-evaluation of establishments when ID changes
    this.updateEstablishmentsDisplay();
  }

  get selectedEstablishmentId(): number | null {
    return this._selectedEstablishmentId;
  }

  // Add proper getter/setter for orderedEstablishmentIds
  private _orderedEstablishmentIds: number[] = [];

  @Input()
  set orderedEstablishmentIds(value: number[]) {
    // Only update if the value actually changes AND has content
    if (value && value.length > 0 && JSON.stringify(value) !== JSON.stringify(this._orderedEstablishmentIds)) {
      console.log('orderedEstablishmentIds changed with non-empty array:', value);
      this._orderedEstablishmentIds = [...value]; // Create a new array to ensure change detection
      // Force update of establishments display when ordering changes
      setTimeout(() => {
        this.updateEstablishmentsDisplay();
      }, 0);
    }
  }

  get orderedEstablishmentIds(): number[] {
    return this._orderedEstablishmentIds;
  }

  @Output() loadingChange = new EventEmitter<boolean>();
  @Output() establishmentsLoaded = new EventEmitter<Establishment[]>();
  @Output() establishmentSelected = new EventEmitter<Establishment>();

  campaignData: any = null;
  errorMsg: string | null = null;
  isLoading: boolean = true;

  private _establishments: Establishment[] = [];
  private _baseEstablishments: Establishment[] = [];

  constructor(private httpService: HttpService) {}

  ngOnInit() {
    this.loadEstablishments();
  }

  get establishments(): Establishment[] {
    if (this._establishments.length === 0) {
      this.updateEstablishmentsDisplay();
    }
    return this._establishments;
  }

  private getEstablishmentsFromData(): Establishment[] {
    if (this.campaignData && this.campaignData.detalhe) {
      return this.campaignData.detalhe
        .filter((est: any) => est.tipo === 'CASHBACK')
        .map((est: any) => ({
          id: est.id,
          nomeempresa: est.nomeempresa,
          cb_perc_creditoporcompra: est.cb_perc_creditoporcompra,
          vr_comprasacimade: est.vr_comprasacimade,
          tipo: est.tipo,
          isSelected: est.id === this._selectedEstablishmentId
        }));
    }
    return [];
  }

  private updateEstablishmentsDisplay(): void {
    if (this._baseEstablishments.length === 0 && this.campaignData && this.campaignData.detalhe) {
      this._baseEstablishments = this.getEstablishmentsFromData();
    }
    if (this._baseEstablishments.length === 0) {
      this._establishments = [];
      return;
    }

    // Apply selection state to all establishments
    this._baseEstablishments.forEach(est => {
      est.isSelected = est.id === this._selectedEstablishmentId;
    });

    // If we have non-empty ordering info, apply it
    if (this._orderedEstablishmentIds && this._orderedEstablishmentIds.length > 0) {
      console.log('Applying custom order to establishments:', this._orderedEstablishmentIds);

      // Create a new array based on the ordering
      const ordered: Establishment[] = [];

      // Track which IDs we've already processed
      const processedIds = new Set<number>();

      // First, add all establishments that are in the ordered list
      this._orderedEstablishmentIds.forEach(id => {
        const found = this._baseEstablishments.find(est => est.id === id);
        if (found) {
          ordered.push({...found}); // Create a new object to ensure change detection
          processedIds.add(id);
        }
      });

      // Then add any establishments that aren't in the ordered list
      this._baseEstablishments.forEach(est => {
        if (!processedIds.has(est.id)) {
          ordered.push({...est}); // Create a new object to ensure change detection
        }
      });

      // Only reassign if the order has actually changed
      if (JSON.stringify(ordered.map(e => e.id)) !== JSON.stringify(this._establishments.map(e => e.id))) {
        console.log('Order has changed, updating establishments');
        this._establishments = ordered;
      }
    } else {
      console.log('No custom ordering, using base order');
      // No ordering, just use base establishments
      this._establishments = this._baseEstablishments.map(est => ({...est})); // Create new objects
    }

    console.log('Final establishments order:', this._establishments.map(est => est.id));
  }

  loadEstablishments() {
    this.isLoading = true;
    this.loadingChange.emit(this.isLoading);

    this.httpService.getCouponData()
      .pipe(
        catchError(error => {
          this.errorMsg = error.message || 'Could not load data.';
          this.isLoading = false;
          this.loadingChange.emit(this.isLoading);
          return of(null);
        })
      )
      .subscribe(response => {
        setTimeout(() => {
          this.campaignData = response;
          console.log('Campaign data loaded:', this.campaignData);
          this.isLoading = false;
          this.loadingChange.emit(this.isLoading);
          this._baseEstablishments = this.getEstablishmentsFromData();
          console.log('Base establishments:', this._baseEstablishments);
          this.updateEstablishmentsDisplay();
          this.establishmentsLoaded.emit(this._baseEstablishments);
        }, 2000);
      });
  }

  getFirstTwoNames(fullName: string): string {
    if (!fullName) return '';
    const names = fullName.split(' ');
    return names.slice(0, 2).join(' ');
  }

  onEstablishmentClick(establishment: Establishment) {
    console.log('Establishment clicked:', establishment);
    this.establishmentSelected.emit(establishment);
  }
}