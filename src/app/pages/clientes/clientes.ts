import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms'; 
import { UsuarioService, Usuario } from '../../services/usuario';
import { NgFor, NgIf, NgClass } from '@angular/common'; // <--- AGREGA NgClass AQUÍ
import { RouterModule } from '@angular/router'; // Asegúrate de tenerlo para otros links
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

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

  asentamientos: any[] = [];
  municipioNombre: string = '';
  estadoNombre: string = '';
  
  // Añadimos la URL de catálogos
  private catalogosUrl = 'https://inmobiliaria-api-cvewh6fphthve7ad.westus-01.azurewebsites.net/api/v1/catalogos';


  clienteActual: Usuario = this.inicializarCliente();

  constructor(private usuarioService: UsuarioService,private http: HttpClient) {}

  
  buscarPorCP(cp: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.catalogosUrl}/cp/${cp}`);
  }
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


  buscarDireccion() {
    if (this.clienteActual.codigoPostal?.length === 5) {
      this.usuarioService.buscarPorCP(this.clienteActual.codigoPostal).subscribe({
        next: (data) => {
          this.asentamientos = data;
          if (data && data.length > 0) {
            this.municipioNombre = data[0].municipio.nombre;
            this.estadoNombre = data[0].municipio.estado.nombre;
          }
        },
        error: (err) => {
          console.error('Error al buscar CP', err);
          this.asentamientos = [];
        }
      });
    }
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
    this.clienteActual = { ...c };
    
    // Si ya tiene CP, cargamos los datos de dirección automáticamente
    if (this.clienteActual.codigoPostal) {
      this.buscarDireccion();
    }
  }

  nuevoClienteForm() {
    this.mostrarFormulario = !this.mostrarFormulario;
    this.modoEdicion = false;
    this.clienteActual = this.inicializarCliente();
    this.asentamientos = [];
    this.municipioNombre = '';
    this.estadoNombre = '';
  }

  guardarCliente() {
    if (this.modoEdicion) {
      this.usuarioService.actualizar(this.clienteActual.id!, this.clienteActual).subscribe({
        next: () => {
          alert('Cliente actualizado con éxito ✅');
          this.finalizarGuardado();
        },
        error: (err) => alert('Error al actualizar')
      });
    } else {
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
