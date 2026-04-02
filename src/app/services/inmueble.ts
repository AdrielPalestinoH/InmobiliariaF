import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

// En inmueble.ts
export interface Inmueble {
  id?: number;
  nispc: string;
  titulo: string;
  precio: number;
  claveCatastral: string;
  manzana: string;
  lote: string;
  fraccion: string;
  terrenoM2: number;
  disponibilidad: string;
  idTipoInmueble: number;
  
  // Campos para compatibilidad con componentes viejos (Catalogo/Productos)
  imagenes?: any[];
  fechaAlta?: string; // Evita el error en productos.html
  // Agregamos estos como opcionales para que el build no truene
  descripcion?: string; 
  tipoDescripcion?: string;
  estadoDescripcion?: string;
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

  // En inmueble.ts
  actualizar(id: number, inmueble: Inmueble): Observable<Inmueble> {
    return this.http.put<Inmueble>(`${this.apiUrl}/${id}`, inmueble);
  }
}
