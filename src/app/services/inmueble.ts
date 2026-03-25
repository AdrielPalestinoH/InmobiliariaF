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
  private apiUrl =
    "https://inmoapi-adagc9dgfjgnfuar.westus-01.azurewebsites.net/api/inmuebles";

  constructor(private http: HttpClient) {}

  listarInmuebles(): Observable<Inmueble[]> {
    return this.http.get<Inmueble[]>(this.apiUrl);
  }

  crearInmueble(inmueble: Inmueble): Observable<Inmueble> {
    return this.http.post<Inmueble>(this.apiUrl, inmueble);
  }

  actualizar(id: number, inmueble: Inmueble): Observable<Inmueble> {
    return this.http.put<Inmueble>(`${this.apiUrl}/${id}`, inmueble);
  }

  obtenerInmueble(id: number) {
    return this.http.get<Inmueble>(
      `https://inmoapi-adagc9dgfjgnfuar.westus-01.azurewebsites.net/api/inmuebles/${id}`,
    );
  }

  enviarContacto(inmuebleId: number, data: any) {
    return this.http.post(
      `https://inmoapi-adagc9dgfjgnfuar.westus-01.azurewebsites.net/api/inmuebles/${inmuebleId}/contacto`,
      data,
    );
  }
}
