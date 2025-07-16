import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { catchError, of } from 'rxjs';
import { HttpService } from 'src/app/services/http/http.service';
import { Establishment } from 'src/app/interface/establishment';
import { MapService } from 'src/app/services/map/map.service';

@Component({
  selector: 'app-establishment',
  templateUrl: './establishment.component.html',
  styleUrls: ['./establishment.component.scss'],
  standalone: false
})

export class EstablishmentComponent implements OnInit {

  private _selectedEstablishmentId: number | null = null;

  @Input()
  set selectedEstablishmentId(value: number | null) {
    console.log('selectedEstablishmentId changed:', value);
    this._selectedEstablishmentId = value;
    this.updateEstablishmentsDisplay();
  }

  get selectedEstablishmentId(): number | null {
    return this._selectedEstablishmentId;
  }

  private _searchTerm: string = '';

  @Input()
  set searchTerm(value: string) {
    this._searchTerm = value || '';
    this.updateEstablishmentsDisplay();
  }

  get searchTerm(): string {
    return this._searchTerm;
  }

  private _orderedEstablishmentIds: number[] = [];

  @Input()
  set orderedEstablishmentIds(value: number[]) {
    if (value && value.length > 0 && JSON.stringify(value) !== JSON.stringify(this._orderedEstablishmentIds)) {
      console.log('orderedEstablishmentIds changed with non-empty array:', value);
      this._orderedEstablishmentIds = [...value];
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

  constructor(
    private httpService: HttpService,
    private mapService: MapService
  ) {}

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
            cep: est.cep,
            latitude: est.latitude,
            longitude: est.longitude,
            isSelected: est.id === this._selectedEstablishmentId
          }));
    }
    return [];
  }

  private updateEstablishmentsDisplay(): void {

    if (this._baseEstablishments.length === 0 && this.campaignData && this.campaignData.detalhe) {
      this._baseEstablishments = this.getEstablishmentsFromData();
    }

    //Quando inicializa o input, return acionado
    if (this._baseEstablishments.length === 0) {
      this._establishments = [];
      return;
    }

    // Apply selection status
    this._baseEstablishments.forEach(est => {
      est.isSelected = est.id === this._selectedEstablishmentId;
    });

    // First filter by search term if provided
    let filteredEstablishments = this._baseEstablishments;
    if (this._searchTerm && this._searchTerm.trim() !== '') {
      const searchTermLower = this._searchTerm.toLowerCase().trim();
      filteredEstablishments = this._baseEstablishments.filter(est => {
        return est.nomeempresa.toLowerCase().includes(searchTermLower);
      });
    }

    // Then apply ordering
    if (this._orderedEstablishmentIds && this._orderedEstablishmentIds.length > 0) {
      console.log('Applying custom order to establishments:', this._orderedEstablishmentIds);
      const ordered: Establishment[] = [];

      // Track which IDs we've already processed
      const processedIds = new Set<number>();

      // First add the establishments in the ordered list that also match the search filter
      this._orderedEstablishmentIds.forEach(id => {
        const found = filteredEstablishments.find(est => est.id === id);
        if (found) {
          ordered.push({...found}); // Create a new object to ensure change detection
          processedIds.add(id);
        }
      });

      // Then add any filtered establishments that aren't in the ordered list
      filteredEstablishments.forEach(est => {
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
      console.log('No custom ordering, using filtered establishments');
      this._establishments = filteredEstablishments.map(est => ({...est}));
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
          this.isLoading = false;
          this.loadingChange.emit(this.isLoading);
          this._baseEstablishments = this.getEstablishmentsFromData();
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
    //adicionar check de url pra checar se está na pagina locations para executar o código a seguir
    this.centerOnMarker(establishment);
  }

  centerOnMarker(establishment: Establishment) {
    this.mapService.centerOnEstablishment(establishment); //??
  }
}
