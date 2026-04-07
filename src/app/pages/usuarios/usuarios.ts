import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgFor, NgIf } from '@angular/common';
import { UsuarioService, Usuario } from '../../services/usuario';
import { CatalogoUsuario, TipoUsuario } from '../../services/catalogo-usuario';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [FormsModule, NgFor, NgIf],
  templateUrl: './usuarios.html',
  styleUrls: ['./usuarios.scss']
})
export class Usuarios implements OnInit {
  usuarios: Usuario[] = [];
  tipos: TipoUsuario[] = [];

  nuevo: Partial<Usuario> = {
    nombre: '',
    apellidos: '',
    email: '',
    cel: ''
  };

  tipoId: number | null = null;

  constructor(
    private usuarioService: UsuarioService,
    private catalogoUsuarioService: CatalogoUsuario
  ) {}

  ngOnInit() {
    this.cargarUsuarios();
    this.cargarRoles();
  }

  cargarRoles() {
    this.catalogoUsuarioService.listarTipos().subscribe({
      next: (data) => {
        this.tipos = data;
      },
      error: (err) => console.error('Error al cargar roles', err)
    });
  }

  cargarUsuarios() {
    this.usuarioService.listar().subscribe({
      next: (data) => {
        this.usuarios = data;
      },
      error: (err) => console.error('Error al listar usuarios', err)
    });
  }

  guardar() {
    if (!this.tipoId) {
      alert('Debe seleccionar un tipo de usuario');
      return;
    }

    // Usamos 'any' para evitar conflictos con la interfaz Usuario estricta
    const dto: any = { 
      ...this.nuevo, 
      tipoUsuarioId: this.tipoId 
    };

    this.usuarioService.crear(dto).subscribe({
      next: () => {
        alert('Usuario creado con éxito');
        this.cargarUsuarios();
        // Reset del formulario
        this.nuevo = { nombre: '', apellidos: '', email: '', cel: '' };
        this.tipoId = null;
      },
      error: (err) => {
        console.error(err);
        alert('Error al guardar el usuario');
      }
    });
  }
}