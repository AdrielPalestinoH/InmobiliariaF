import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// Definimos la interfaz aquí para que sea reutilizable
export interface TipoUsuario {
  id_tipo_usuario: number; 
  role: string;
}

@Injectable({ providedIn: 'root' })
export class CatalogoUsuario {
  private apiUrl = 'https://inmobiliaria-api-cvewh6fphthve7ad.westus-01.azurewebsites.net/api/v1/usuarios/roles';

  constructor(private http: HttpClient) {}

  listarTipos(): Observable<TipoUsuario[]> {
    return this.http.get<TipoUsuario[]>(this.apiUrl);
  }
}