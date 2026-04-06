import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = 'https://inmobiliaria-api-cvewh6fphthve7ad.westus-01.azurewebsites.net/api/v1/auth/login-request';

  constructor(private http: HttpClient) {}

  verificarToken(token: string) {
  return this.http.get<any>(
    `https://inmobiliaria-api-cvewh6fphthve7ad.westus-01.azurewebsites.net/api/v1/auth/verificar?token=${token}`
  );
}


  login(email: string, pwd: string): Observable<any> {
  return this.http.post(this.apiUrl, { 
    email: email,
    token: ""  // importante
  })
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
    return u && (u.tipoUsuarioId === 1 || u.rol === 'ADMIN');
  }

  isCliente(): boolean {
    const u = this.getUsuarioActual();
    return u && (u.tipoUsuarioId === 2 || u.rol === 'CLIENTE');
  }
}
