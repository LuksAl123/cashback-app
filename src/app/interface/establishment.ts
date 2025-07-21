export interface Establishment {
    id: number;
    nomeempresa: string;
    cb_perc_creditoporcompra: number;
    vr_comprasacimade: number;
    tipo: string;
    cep: string;
    latitude?: number;
    longitude?: number;
    isSelected?: boolean;
}