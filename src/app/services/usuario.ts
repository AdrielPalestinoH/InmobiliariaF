import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';



export interface Usuario {
  id?: number;
  nombre?: string;
  apellidos?: string;
  email?: string;
  cel?: string;
  tipoUsuarioDescripcion?: string;
  tipoUsuarioId?: number; // 👈 agrega este campo
}

@Injectable({ providedIn: 'root' })
export class UsuarioService {
  private baseUrl = 'https://inmobiliaria-api-cvewh6fphthve7ad.westus-01.azurewebsites.net/api/v1/usuarios';
  constructor(private http: HttpClient) {}

listar(): Observable<Usuario[]> {
    // Usamos el endpoint de debug para traer la lista
    return this.http.get<Usuario[]>(`${this.baseUrl}/debug`);
  }

  crear(usuario: Usuario): Observable<Usuario> {
    // IMPORTANTE: Tu controlador espera /registro para crear
    return this.http.post<Usuario>(`${this.baseUrl}/registro`, usuario);
  }

  actualizar(id: number, usuario: Usuario): Observable<Usuario> {
    // Si no tienes PUT en el controller todavía, dará 405, pero esta es la ruta estándar
    return this.http.put<Usuario>(`${this.baseUrl}/${id}`, usuario);
  }

}
