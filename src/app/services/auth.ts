import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = 'https://inmoapi-adagc9dgfjgnfuar.westus-01.azurewebsites.net/api/usuarios/login';

  constructor(private http: HttpClient) {}

  login(email: string, pwd: string): Observable<any> {
    return this.http.post(this.apiUrl, { email, pwd }).pipe(
      tap((user: any) => {
        // Guardamos el usuario en localStorage
        localStorage.setItem('usuario', JSON.stringify(user));
      })
    );
  }

  logout() {
    localStorage.removeItem('usuario');
  }

  getUsuarioActual() {
    const data = localStorage.getItem('usuario');
    return data ? JSON.parse(data) : null;
  }

  isAdmin(): boolean {
    const u = this.getUsuarioActual();
    return u && u.tipoUsuarioId === 1;
  }

  isCliente(): boolean {
    const u = this.getUsuarioActual();
    return u && u.tipoUsuarioId === 2;
  }
}
