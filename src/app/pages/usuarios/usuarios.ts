import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgFor, NgIf } from '@angular/common';
import { UsuarioService } from '../../services/usuario';
import { CatalogoUsuario, TipoUsuario } from '../../services/catalogo-usuario';
import { HttpClient, HttpHeaders} from '@angular/common/http';


@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [FormsModule, NgFor, NgIf],
  templateUrl: './usuarios.html',
  styleUrls: ["./usuarios.scss"],
})
export class Usuarios implements OnInit {
  // Ajusta esta URL a tu API en Azure
  private readonly API_AZURE = 'https://inmobiliaria-api-cvewh6fphthve7ad.westus-01.azurewebsites.net/api/v1';

  usuarios: any[] = [];
  tipos: TipoUsuario[] = [];
  asentamientos: any[] = [];
  
  municipioNombre: string = '';
  estadoNombre: string = '';

  nuevo: any = {
    nombres: '',
    apellidos: '',
    email: '',
    telefono: '',
    codigoPostal: '',
    calle: '',
    numeroExterior: '',
    numeroInterior: '',
    idAsentamiento: null
  };

  tipoId: number | null = null;

  constructor(
    private usuarioService: UsuarioService,
    private catalogoUsuarioService: CatalogoUsuario,
    private http: HttpClient
  ) {}

  ngOnInit() {
    this.cargarUsuarios();
    this.cargarRoles();
  }

  // --- BUSCADOR DE CP ---
buscarDireccion() {
  if (this.nuevo.codigoPostal?.length === 5) {
    // Definimos los headers para forzar JSON
    const headers = new HttpHeaders().set('Accept', 'application/json');

    this.http.get<any[]>(`${this.API_AZURE}/catalogos/cp/${this.nuevo.codigoPostal}`, { headers }).subscribe({
      next: (data) => {
        // Al forzar el header, 'data' ya debería ser un array de objetos JS
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

  guardar() {
    // Mapeamos al UsuarioDTO que espera tu Controller de Java
    const usuarioDTO = {
      nombres: this.nuevo.nombres,
      apellidos: this.nuevo.apellidos,
      email: this.nuevo.email,
      telefono: this.nuevo.telefono,
      role: this.tipos.find(t => t.id_tipo_usuario === this.tipoId)?.role,
      direccion: { // Esto llena los campos de calle, cp, etc. en el back
        calle: this.nuevo.calle,
        codigoPostal: this.nuevo.codigoPostal,
        numeroExterior: this.nuevo.numeroExterior,
        numeroInterior: this.nuevo.numeroInterior,
        idAsentamiento: this.nuevo.idAsentamiento
      }
    };

    this.http.post(`${this.API_AZURE}/registro`, usuarioDTO).subscribe({
      next: () => {
        alert('Usuario registrado con éxito en Azure');
        this.cargarUsuarios();
        this.resetForm();
      },
      error: (err) => alert('Error al registrar: ' + (err.error?.mensaje || 'Error interno'))
    });
  }

  cargarRoles() {
    this.catalogoUsuarioService.listarTipos().subscribe(data => this.tipos = data);
  }

  cargarUsuarios() {
    this.usuarioService.listar().subscribe(data => this.usuarios = data);
  }

  resetForm() {
    this.nuevo = { nombres: '', apellidos: '', email: '', telefono: '', codigoPostal: '', calle: '', numeroExterior: '', numeroInterior: '', idAsentamiento: null };
    this.municipioNombre = '';
    this.estadoNombre = '';
    this.asentamientos = [];
    this.tipoId = null;
  }
}