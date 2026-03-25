import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgFor, NgIf } from '@angular/common';
import { UsuarioService, Usuario } from '../../services/usuario';

@Component({
  selector: 'app-clientes',
  standalone: true,
  imports: [FormsModule, NgFor, NgIf],
  templateUrl: './clientes.html',
  styleUrls: ['./clientes.scss']
})
export class Clientes implements OnInit {
  clientes: Usuario[] = [];
  filtro = '';
  mostrarFormulario = false;

  modoEdicion = false;

  clienteActual: Usuario = {
    id: undefined,
    nombre: '',
    apellidos: '',
    email: '',
    cel: '',
    tipoUsuarioDescripcion: 'Cliente'
  };

  nuevoCliente: Usuario = {
    nombre: '',
    apellidos: '',
    email: '',
    cel: '',
    tipoUsuarioDescripcion: 'Cliente'
  };

  constructor(private usuarioService: UsuarioService) {}

  ngOnInit() {
    this.cargarClientes();
  }

  cargarClientes() {
    this.usuarioService.listar().subscribe({
      next: (data) => (this.clientes = data),
      error: (err) => console.error('Error al cargar clientes', err)
    });
  }

  buscar() {
    const texto = this.filtro.toLowerCase();
    return this.clientes.filter(c => {
      const nombre = c.nombre ?? '';
      const apellidos = c.apellidos ?? '';
      const email = c.email ?? '';
      return (
        nombre.toLowerCase().includes(texto) ||
        apellidos.toLowerCase().includes(texto) ||
        email.toLowerCase().includes(texto)
      );
    });
  }


   editarCliente(c: Usuario) {
    this.mostrarFormulario = true;
    this.modoEdicion = true;
    this.clienteActual = { ...c };
  }

   /** 👉 renamed to avoid conflict */
  nuevoClienteForm() {
    this.mostrarFormulario = true;
    this.modoEdicion = false;
    this.clienteActual = {
      nombre: '',
      apellidos: '',
      email: '',
      cel: '',
      tipoUsuarioDescripcion: 'Cliente'
    };
  }


  guardarCliente() {
    if (!this.nuevoCliente.nombre || !this.nuevoCliente.email) {
      alert('Por favor llena los campos obligatorios.');
      return;
    }

    this.usuarioService.crear(this.nuevoCliente).subscribe({
      next: () => {
        alert('Cliente creado con éxito ✅');
        this.mostrarFormulario = false;
        this.cargarClientes();
        this.nuevoCliente = {
          nombre: '',
          apellidos: '',
          email: '',
          cel: '',
          tipoUsuarioDescripcion: 'Cliente'
        };
      },
      error: (err) => console.error('Error al crear cliente', err)
    });
  }
}
