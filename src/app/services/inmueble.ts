import { Injectable } from "@angular/core"; 
import { Observable } from "rxjs";
import { HttpClient, HttpHeaders } from '@angular/common/http';
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
  id_tipo_inmueble?: number; // Añade este para que coincida con el formulario
  idTipoInmueble: number;
  
  // Campos para compatibilidad con componentes viejos (Catalogo/Productos)
  imagenes?: any[];
  fechaAlta?: string; // Evita el error en productos.html
  // Agregamos estos como opcionales para que el build no truene
  descripcion?: string; 
  tipoDescripcion?: string;
  estadoDescripcion?: string;
  // --- NUEVOS CAMPOS ---
  banos?: number;
  recamaras?: number;
  estacionamientos?: number;
  niveles?: number;
  construccionM2?: number;
  caracteristicas?: string;
  [key: string]: any; // 👈 Esto le dice a TypeScript: "Acepta cualquier otra propiedad extra"
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
  crearInmueble(inmueble: any, files: File[]): Observable<any> {
  const formData = new FormData();

  // 1. Agregamos el objeto inmueble como un Blob de tipo JSON
  // El nombre 'inmueble' debe ser IGUAL al @RequestPart("inmueble") del Java
  formData.append('inmueble', new Blob([JSON.stringify(inmueble)], {
    type: 'application/json'
  }));

  // 2. Agregamos los archivos al mismo FormData
  // El nombre 'files' debe ser IGUAL al @RequestPart("files") del Java
  files.forEach((file) => {
    formData.append('files', file);
  });

  // NOTA: No pongas Content-Type en los headers, 
  // el navegador lo pondrá automáticamente como multipart/form-data
  return this.http.post(`${this.apiUrl}/registro`, formData);
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

  // inmueble.service.ts (el real)

  obtenerPorId(id: number): Observable<Inmueble> {
    return this.http.get<Inmueble>(`${this.apiUrl}/${id}`);
  }
}
