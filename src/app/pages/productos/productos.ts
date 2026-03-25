import { HttpClient } from '@angular/common/http';  // 👈 agrega esto
import { Component, OnInit } from '@angular/core';
import { NgFor, NgIf, CurrencyPipe, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InmuebleService, Inmueble } from '../../services/inmueble';

@Component({
  selector: 'app-productos',
  standalone: true,
  imports: [NgFor, NgIf, FormsModule, CurrencyPipe, DatePipe],
  templateUrl: './productos.html',
  styleUrls: ['./productos.scss']
})
export class Productos implements OnInit {
  inmuebles: Inmueble[] = [];
  filtro = '';
  mostrarFormulario = false;
  modoEdicion = false;

  inmuebleActual: Inmueble = {
    descripcion: '',
    precio: 0,
    tipoDescripcion: '',
    estadoDescripcion: ''
  };

  tipos: any[] = [];
  estados: any[] = [];

  // ✅ inyectamos HttpClient aquí
  constructor(
    private inmuebleService: InmuebleService,
    private http: HttpClient  // 👈 agrega esto
  ) {}

  ngOnInit() {
    this.cargarInmuebles();
    this.cargarCatalogos();
  }

  cargarCatalogos() {
    this.http.get<any[]>('https://inmoapi-adagc9dgfjgnfuar.westus-01.azurewebsites.net/api/tipos-inmueble').subscribe({
      next: data => (this.tipos = data),
      error: err => console.error('Error al cargar tipos', err)
    });

    this.http.get<any[]>('https://inmoapi-adagc9dgfjgnfuar.westus-01.azurewebsites.net/api/estados-inmueble').subscribe({
      next: data => (this.estados = data),
      error: err => console.error('Error al cargar estados', err)
    });
  }

  cargarInmuebles() {
    this.inmuebleService.listarInmuebles().subscribe({
      next: (data) => (this.inmuebles = data),
      error: (err) => console.error('Error al cargar inmuebles', err)
    });
  }

  buscar() {
    const texto = this.filtro.toLowerCase();
    return this.inmuebles.filter(i => {
      const descripcion = i.descripcion ?? '';
      const tipo = i.tipoDescripcion ?? '';
      return (
        descripcion.toLowerCase().includes(texto) ||
        tipo.toLowerCase().includes(texto)
      );
    });
  }

  nuevoInmueble() {
    this.mostrarFormulario = true;
    this.modoEdicion = false;
    this.inmuebleActual = {
      descripcion: '',
      precio: 0,
      tipoDescripcion: '',
      estadoDescripcion: ''
    };
  }

  editarInmueble(i: Inmueble) {
    this.mostrarFormulario = true;
    this.modoEdicion = true;
    this.inmuebleActual = { ...i };
  }

  guardarInmueble() {
    const accion = this.modoEdicion
      ? this.inmuebleService.actualizar(this.inmuebleActual.id!, this.inmuebleActual)
      : this.inmuebleService.crearInmueble(this.inmuebleActual);

    accion.subscribe({
      next: () => {
        alert(this.modoEdicion ? 'Inmueble actualizado ✅' : 'Inmueble creado ✅');
        this.mostrarFormulario = false;
        this.cargarInmuebles();
      },
      error: (err) => console.error('Error al guardar inmueble', err)
    });
  }
}
