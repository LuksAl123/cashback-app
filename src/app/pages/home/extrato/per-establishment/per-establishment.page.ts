import { Component, OnInit } from '@angular/core';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { catchError, firstValueFrom, map, Observable, of } from 'rxjs';
import { HttpService } from 'src/app/services/http/http.service';
import { UserService } from 'src/app/services/user/user.service';
import { SharedDataService } from 'src/app/shared-data.service';

@Component({
  selector: 'app-per-establishment',
  templateUrl: './per-establishment.page.html',
  styleUrls: ['./per-establishment.page.scss'],
  standalone: false
})

export class PerEstablishmentPage implements OnInit {

  faEye = faEye;
  faEyeSlash = faEyeSlash;
  showBalance: boolean = false; 
  detalheArray$!: Observable<any[]>;
  totalCashback$!: Observable<number>;
  detailData: any = null;
  extratoOrdenado: any[] = [];

  constructor(
    private httpService: HttpService,
    private userService: UserService,
    private sharedDataService: SharedDataService
  ) { }

  ngOnInit() {
    this.totalCashback$ = this.sharedDataService.totalCashback$;
  }

  ionViewWillEnter() {
    this.loadExtrato(this.userService.getCodEmpresa());
  }

  loadExtrato(codEmpresa: number) {
    this.detalheArray$ = this.httpService.getExpiringCashback(this.userService.getUserId()!, codEmpresa).pipe(
      map(response => response?.detalhe ?? []),
      catchError(error => {
        console.log(error);
        return of([]);
      })
    );
  }

  async ordenaExtrato(campo: string, debcred: string = 'AMBOS', ordem: string = 'desc') {
    try {
      console.log(`Ordenando extrato por: ${campo}, debcred: ${debcred}, ordem: ${ordem}`);
      let extratoOrdenado = await firstValueFrom(this.detalheArray$);
      if (debcred !== 'AMBOS') {
        extratoOrdenado = extratoOrdenado.filter(item => item.debcred === debcred);
      }

      extratoOrdenado.sort((a, b) => {
        let valorA = a[campo];
        let valorB = b[campo];

        if (campo === 'dtmovimento' || campo === 'dtvalidade') {
          valorA = new Date(valorA);
          valorB = new Date(valorB);
        }

        if (ordem === 'asc') {
          return valorA > valorB ? 1 : -1;
        } else if (ordem === 'desc') {
          return valorA < valorB ? 1 : -1;
        } else {
          throw new Error('A ordem deve ser "asc" ou "desc".');
        }
      });

      this.extratoOrdenado = extratoOrdenado;
    } catch (error) {
      console.log("Erro na função ordenaExtrato", error);
    }
  }

  toggleBalance() {
    this.showBalance = !this.showBalance;
  }

  async filterExtracts(event?: any) {
    if(event && event.detail) {
      const selectedValue = event.detail.value;
      console.log(selectedValue);
      if(!selectedValue.includes("#")) {
        const [campo, ordem] = selectedValue.split("_");
        this.ordenaExtrato(campo, 'AMBOS', ordem);
      } else {
        const campo = selectedValue.split("#")[0];
        const [debcred, ordem] = (selectedValue.split("#")[1]).split("_");
        this.ordenaExtrato(campo, debcred, ordem);
      }
    }
  }
}