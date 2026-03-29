import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

export interface Inmueble {
  id?: number;
  titulo?: string;
  precio?: number;
  ubicacion?: string;
  tipo?: string;
  recamaras?: number;
  banos?: number;
  metros2?: number;
  estacionamientos?: number;
  imagen?: string;
  descripcion?: string;
  estatus?: string;
  destacada?: boolean;

  fechaAlta?: string;
  estadoDescripcion?: string;
  tipoDescripcion?: string;

  tipoId?: number;
  estadoId?: number;
}

@Injectable({ providedIn: "root" })
export class InmuebleService {
  // 1. La URL base correcta
  private apiUrl = "https://inmobiliaria-api-cvewh6fphthve7ad.westus-01.azurewebsites.net/api/v1/inmuebles";

  constructor(private http: HttpClient) {}

  listarInmuebles(): Observable<Inmueble[]> {
    return this.http.get<Inmueble[]>(this.apiUrl);
  }

  // 2. Usar 'this.apiUrl' + '/registro' (según tu InmuebleController)
  crearInmueble(inmueble: Inmueble): Observable<Inmueble> {
    return this.http.post<Inmueble>(`${this.apiUrl}/registro`, inmueble);
  }

  // 3. Corregido: Ya no usamos el dominio 'inmoapi-adagc9dgfjgnfuar'
  obtenerInmueble(id: number) {
    return this.http.get<Inmueble>(`${this.apiUrl}/${id}`);
  }

  // 4. Corregido: Unificado a la API real
  enviarContacto(inmuebleId: number, data: any) {
    return this.http.post(`${this.apiUrl}/${inmuebleId}/contacto`, data);
  }
}
