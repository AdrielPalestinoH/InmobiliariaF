import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms'; 
import { UsuarioService, Usuario } from '../../services/usuario';
import { NgFor, NgIf, NgClass } from '@angular/common'; // <--- AGREGA NgClass AQUÍ
import { RouterModule } from '@angular/router'; // Asegúrate de tenerlo para otros links

@Component({
  selector: 'app-clientes',
  standalone: true,
  imports: [FormsModule, NgFor, NgIf, NgClass, RouterModule],
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
  const usuarioParaEnviar = {
    // Usamos los nombres que tu DTO/Entity esperan (basado en tus logs previos)
    nombres: this.clienteActual.nombre,
    apellidos: this.clienteActual.apellidos,
    email: this.clienteActual.email,
    telefono: this.clienteActual.cel,
    // ESTO ES LO QUE ESTABA FALTANDO/FALLANDO:
    role: 'CLIENTE' 
  };

  this.usuarioService.crear(usuarioParaEnviar).subscribe({
    next: () => {
      alert('Cliente registrado. Se envió correo de activación ✅');
      this.finalizarGuardado();
    },
    error: (err) => {
      console.error('Error al guardar', err);
      alert('Error en el servidor. Revisa si el campo "role" llega al DTO.');
    }
  });
}

// Función auxiliar para limpiar
finalizarGuardado() {
  this.mostrarFormulario = false;
  this.cargarClientes();
}
}
