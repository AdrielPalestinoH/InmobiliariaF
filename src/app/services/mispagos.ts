import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class MisPagosService {
  private apiUrl = 'https://inmoapi-adagc9dgfjgnfuar.westus-01.azurewebsites.net/api';

   constructor(private http: HttpClient) {}

  listarCreditos(usuarioId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/creditos/usuario/${usuarioId}`);
  }

  listarPagos(creditoId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/pagos/${creditoId}`);
  }

  // (Opcional para PayPal)
iniciarPagoPaypal(detalleId: number): Observable<any> {
  return this.http.post<any>(`https://inmoapi-adagc9dgfjgnfuar.westus-01.azurewebsites.net/api/pagos/paypal/${detalleId}`, {});
}
}
