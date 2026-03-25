import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Credito {
  id?: number;
  total?: number;
  totalPagos?: number;
  referencia?: string;
  estatus?: string;
  fechaInicio?: string;
  fechaFinal?: string;
  usuarioId?: number;
  inmuebleId?: number;
  usuarioNombre?: string;
  inmuebleDescripcion?: string;
  frecuencia?: string; // 👈 este campo debe existir
}

@Injectable({ providedIn: 'root' })
export class CreditoService {
  private apiUrl = 'https://inmoapi-adagc9dgfjgnfuar.westus-01.azurewebsites.net/api/creditos';

  constructor(private http: HttpClient) {}

  listar(): Observable<Credito[]> {
    return this.http.get<Credito[]>(this.apiUrl);
  }

  crear(c: Credito): Observable<Credito> {
    return this.http.post<Credito>(this.apiUrl, c);
  }

  reestructurar(id: number, nuevoTotal: number): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}/reestructurar?pagos=${nuevoTotal}`, {});
  }
}
