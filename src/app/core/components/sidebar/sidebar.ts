import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgIf } from '@angular/common'; // 👈 Importante para el *ngIf
import { AuthService } from '../../../services/auth'; // 👈 Importa tu servicio

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, NgIf], // 👈 Agrega NgIf aquí
  templateUrl: './sidebar.html',
  styleUrls: ['./sidebar.scss']
})
export class Sidebar {
  // Inyectamos el servicio como público para usarlo en el HTML
  constructor(public authService: AuthService) {}
}