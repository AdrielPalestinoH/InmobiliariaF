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
  private apiUrl = 'https://inmoapi-adagc9dgfjgnfuar.westus-01.azurewebsites.net/api/usuarios';

  constructor(private http: HttpClient) {}

  listar(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(this.apiUrl);
  }

  crear(usuario: Usuario): Observable<Usuario> {
    return this.http.post<Usuario>(this.apiUrl, usuario);
  }


  actualizar(id: number, usuario: Usuario): Observable<Usuario> {
    return this.http.put<Usuario>(`${this.apiUrl}/${id}`, usuario);
  }

}
