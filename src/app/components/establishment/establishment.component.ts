import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { catchError, of } from 'rxjs';
import { ApiService } from 'src/app/services/api/api.service';

@Component({
  selector: 'app-establishment',
  templateUrl: './establishment.component.html',
  styleUrls: ['./establishment.component.scss'],
  standalone: false
})

export class EstablishmentComponent  implements OnInit {

  @Output() loadingChange = new EventEmitter<boolean>();

  @Input() establishment: Establishment;
  @Input() isSelected: boolean;

  campaignData: any = null;
  errorMsg: string | null = null;
  isLoading: boolean = true;

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.loadEstablishments();
  }

  get establishments() {
    if (this.campaignData && this.campaignData.detalhe) {
      return this.campaignData.detalhe.filter((establishment: any) => establishment.tipo === 'CASHBACK');
    }
    return [];
  }

  loadEstablishments() {
    this.isLoading = true;
    this.loadingChange.emit(this.isLoading);

    this.apiService.getCampaignData()
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
          console.log(this.campaignData);
          this.isLoading = false;
          this.loadingChange.emit(this.isLoading);
        }, 2000);
      });
  }

  getFirstTwoNames(fullName: string): string {
    if (!fullName) return '';
    
    const names = fullName.split(' ');
    
    return names.slice(0, 2).join(' ');
  }
}
