import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Credito {
  id?: number;
  usuarioId: number;
  inmuebleId: number;
  montoEnganche: number;
  montoCredito: number;
  comisionAperturaPct: number;
  tasaInteresAnualPct: number;
  tasaInteresMoratorioPct: number;
  plazoTotalMeses: number;
  diaPagoMensual: number;
  saldoInsolutoActual: number;
  fechaApertura: string;
  // Campos auxiliares para la tabla de la lista
  usuarioNombre?: string;
  inmuebleDescripcion?: string;
}

@Injectable({ providedIn: 'root' })
export class CreditoService {
private readonly API_BASE = 'https://inmobiliaria-api-cvewh6fphthve7ad.westus-01.azurewebsites.net/api';
  constructor(private http: HttpClient) {}

  listar(): Observable<any[]> {
    return this.http.get<any[]>(`${this.API_BASE}/creditos`);
  }

  crear(c: Credito): Observable<any> {
    // Este enviará el JSON completo que definimos al endpoint POST /api/creditos
    return this.http.post<any>(`${this.API_BASE}/creditos`, c);
  }

  // Por si ocupas los catálogos desde el mismo servicio
  obtenerUsuarios(): Observable<any[]> {
    return this.http.get<any[]>(`${this.API_BASE}/usuarios`);
  }

  obtenerInmuebles(): Observable<any[]> {
    return this.http.get<any[]>(`${this.API_BASE}/inmuebles`);
  }
}
