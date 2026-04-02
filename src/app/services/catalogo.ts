import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface TipoInmueble {
  id: number;           // Antes era id_tipo_inmueble
  inmuebleTipo: string; // Antes era inmueble_tipo
}

export interface EstadoInmueble {
  id: number;
  descripcion: string;
}

@Injectable({
  providedIn: 'root'
})
export class Catalogo {
  private apiUrl = 'https://inmobiliaria-api-cvewh6fphthve7ad.westus-01.azurewebsites.net/api/v1/inmuebles';

  constructor(private http: HttpClient) {}

  getEstados(): Observable<EstadoInmueble[]> {
    return this.http.get<EstadoInmueble[]>(`${this.apiUrl}/estados`);
  }

  getTipos(): Observable<TipoInmueble[]> {
    return this.http.get<TipoInmueble[]>(`${this.apiUrl}/tipos`);
  }
}
