import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface TipoUsuario {
  id: number;
  descripcion: string;
}

@Injectable({ providedIn: 'root' })
export class CatalogoUsuario {
  private apiUrl = 'https://inmoapi-adagc9dgfjgnfuar.westus-01.azurewebsites.net/api/catalogo/tipos-usuario';

  constructor(private http: HttpClient) {}

  listarTipos(): Observable<TipoUsuario[]> {
    return this.http.get<TipoUsuario[]>(this.apiUrl);
  }
}
