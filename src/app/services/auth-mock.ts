import { Injectable } from '@angular/core';
import { Observable, of, throwError, tap, delay } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  // Usuarios “fake” para pruebas
  private usuariosFake = [
    { email: 'admin@test.com', pwd: '1234', tipoUsuarioId: 1, nombre: 'Admin' },
    {
      email: 'cliente@test.com',
      pwd: '1234',
      tipoUsuarioId: 2,
      nombre: 'Cliente',
    },
  ];

  login(email: string, pwd: string): Observable<any> {
    const user = this.usuariosFake.find(
      (u) => u.email === email && u.pwd === pwd,
    );

    if (!user) {
      return throwError(() => new Error('Credenciales inválidas')).pipe(
        delay(300),
      );
    }

    // simula respuesta del backend (sin pwd)
    const respuesta = {
      email: user.email,
      tipoUsuarioId: user.tipoUsuarioId,
      nombre: user.nombre,
    };

    return of(respuesta).pipe(
      delay(300),
      tap((u) => localStorage.setItem('usuario', JSON.stringify(u))),
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
    return !!u && u.tipoUsuarioId === 1;
  }

  isCliente(): boolean {
    const u = this.getUsuarioActual();
    return !!u && u.tipoUsuarioId === 2;
  }
}
