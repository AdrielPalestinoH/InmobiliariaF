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
  tipos: any[] = []; // Para cargar los roles si fuera necesario

  clienteActual: Usuario = this.inicializarCliente();

  constructor(private usuarioService: UsuarioService) {}

  ngOnInit() {
    this.cargarClientes();
  }

  inicializarCliente(): Usuario {
    return {
      nombres: '',
      apellidos: '',
      email: '',
      telefono: '',
      role: 'CLIENTE',
      codigoPostal: '',
      calle: '',
      numeroExterior: '',
      numeroInterior: '',
      idAsentamiento: undefined
    };
  }

  cargarClientes() {
    this.usuarioService.listar().subscribe({
      next: (data) => (this.clientes = data),
      error: (err) => console.error('Error al cargar', err)
    });
  }

  editarCliente(c: Usuario) {
    this.mostrarFormulario = true;
    this.modoEdicion = true;
    // Clonamos el objeto y nos aseguramos de mapear role si viene de la lista de tiposUsuario
    this.clienteActual = { ...c };
  }

  nuevoClienteForm() {
    this.mostrarFormulario = !this.mostrarFormulario;
    this.modoEdicion = false;
    this.clienteActual = this.inicializarCliente();
  }

  guardarCliente() {
    if (this.modoEdicion) {
      // Lógica de Actualizar (necesitas implementar 'actualizar' en tu service)
      this.usuarioService.actualizar(this.clienteActual.id!, this.clienteActual).subscribe({
        next: () => {
          alert('Cliente actualizado con éxito ✅');
          this.finalizarGuardado();
        },
        error: (err) => alert('Error al actualizar')
      });
    } else {
      // Lógica de Crear
      this.usuarioService.crear(this.clienteActual).subscribe({
        next: () => {
          alert('Cliente registrado y correo enviado ✅');
          this.finalizarGuardado();
        },
        error: (err) => alert('Error al registrar')
      });
    }
  }

  finalizarGuardado() {
    this.mostrarFormulario = false;
    this.cargarClientes();
  }

  buscar() {
    const texto = this.filtro.toLowerCase();
    return this.clientes.filter(c => 
      (c.nombres?.toLowerCase().includes(texto)) || 
      (c.apellidos?.toLowerCase().includes(texto)) || 
      (c.email?.toLowerCase().includes(texto))
    );
  }
}
