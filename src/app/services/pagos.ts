import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Pago {
  id?: number;
  creditoDetalleId: number;
  metodoPagoId: number;
  totalAbonado: number;
  referencia: string;
}

@Injectable({ providedIn: 'root' })
export class PagoService {
  private apiUrl = 'https://inmoapi-adagc9dgfjgnfuar.westus-01.azurewebsites.net/api/pagos';

  constructor(private http: HttpClient) {}

  listarCreditos(): Observable<any[]> {
    return this.http.get<any[]>('https://inmoapi-adagc9dgfjgnfuar.westus-01.azurewebsites.net/api/creditos');
  }

  listarDetalles(creditoId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/detalles/${creditoId}`);
  }

  crearPago(pago: Pago): Observable<any> {
    return this.http.post(`${this.apiUrl}`, pago);
  }
  

}
