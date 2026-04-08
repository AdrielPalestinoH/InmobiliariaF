import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Router } from '@angular/router'; // <--- Importante
@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = 'https://inmobiliaria-api-cvewh6fphthve7ad.westus-01.azurewebsites.net/api/v1/auth/login-request';

  constructor(private http: HttpClient, private router: Router) {}

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
    // 1. Borramos la información de sesión
    localStorage.removeItem('usuario');
    
    // 2. Si manejas tokens u otros datos, bórralos también
    localStorage.clear(); // Opción radical para borrar todo

    // 3. Redireccionamos a la raíz
    this.router.navigate(['/']);
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
