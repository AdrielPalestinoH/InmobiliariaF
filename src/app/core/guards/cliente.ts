import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../../services/auth';

@Injectable({ providedIn: 'root' })
export class ClienteGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    const user = this.authService.getUsuarioActual();
    if (user && user.tipoUsuarioId === 2) {
      return true; // ✅ Cliente puede pasar
    }
    this.router.navigate(['/login']);
    return false;
  }
}
