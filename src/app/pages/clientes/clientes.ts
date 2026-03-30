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
  // 1. Corregimos la validación: Usamos clienteActual que es el que está en el [(ngModel)]
  if (!this.clienteActual.nombre || !this.clienteActual.email) {
    alert('Por favor llena los campos obligatorios.');
    return;
  }

  if (this.modoEdicion) {
    // Lógica para ACTUALIZAR
    this.usuarioService.actualizar(this.clienteActual.id!, this.clienteActual).subscribe({
      next: () => {
        alert('Cliente actualizado ✅');
        this.finalizarGuardado();
      },
      error: (err) => console.error('Error al actualizar', err)
    });
  } else {
    // Lógica para CREAR (Llamará a /registro)
    this.usuarioService.crear(this.clienteActual).subscribe({
      next: () => {
        alert('Cliente registrado con éxito ✅');
        this.finalizarGuardado();
      },
      error: (err) => console.error('Error al registrar', err)
    });
  }
}

// Función auxiliar para limpiar
finalizarGuardado() {
  this.mostrarFormulario = false;
  this.cargarClientes();
}
}
