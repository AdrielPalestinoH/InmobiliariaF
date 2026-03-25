import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './register.html',
  styleUrls: ['./register.scss']
})
export class Register {
  usuario = {
    nombre: '',
    apellidos: '',
    email: '',
    cel: '',
    pwd: ''
  };

  constructor(private http: HttpClient, private router: Router) {}

  registrar() {
    if (!this.usuario.nombre || !this.usuario.email || !this.usuario.pwd) {
      alert('Por favor completa los campos obligatorios.');
      return;
    }

    this.http.post('https://inmoapi-adagc9dgfjgnfuar.westus-01.azurewebsites.net/api/usuarios', this.usuario).subscribe({
      next: (data) => {
        alert('✅ Registro exitoso, ya puedes iniciar sesión.');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error('Error al registrar usuario', err);
        alert('❌ Error al registrar. Intenta nuevamente.');
      }
    });
  }
}
