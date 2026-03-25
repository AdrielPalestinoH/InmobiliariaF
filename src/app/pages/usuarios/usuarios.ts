import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgFor } from '@angular/common';
import { UsuarioService, Usuario } from '../../services/usuario';
import { CatalogoUsuario, TipoUsuario } from '../../services/catalogo-usuario';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [FormsModule, NgFor],
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
  tipoId: number = 0;

  constructor(
    private usuarioService: UsuarioService,
    private catalogoUsuarioService: CatalogoUsuario
  ) {}

  ngOnInit() {
    this.cargarUsuarios();
    this.catalogoUsuarioService.listarTipos().subscribe(data => this.tipos = data);
  }

    cargarUsuarios() {
      this.usuarioService.listar().subscribe({
        next: (data) => {
          console.log('Usuarios cargados:', data); // 👈 para debug
          this.usuarios = data;
        },
        error: (err) => console.error('Error al listar usuarios', err)
      });
    }

  guardar() {
    const dto = { ...this.nuevo, tipoUsuarioId: this.tipoId };
    this.usuarioService.crear(dto).subscribe(() => {
      alert('Usuario creado');
      this.cargarUsuarios();
      this.nuevo = { nombre: '', apellidos: '', email: '', cel: '' };
      this.tipoId = 0;
    });
  }
}
