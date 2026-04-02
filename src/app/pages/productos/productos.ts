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
  inmuebleActual: Inmueble = this.initInmueble();
  inmuebles: Inmueble[] = [];
  filtro = '';
  mostrarFormulario = false;
  modoEdicion = false;

  

  private initInmueble(): Inmueble {
  return {
    titulo: '',
    precio: 0,
    nispc: '',
    claveCatastral: '',
    manzana: '',
    lote: '',
    fraccion: '',
    terrenoM2: 0,
    disponibilidad: 'DISPONIBLE',
    idTipoInmueble: 1
  };
}

  

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
    // Nota el "/api/v1/inmuebles/tipos"
    this.http.get<any[]>('https://inmobiliaria-api-cvewh6fphthve7ad.westus-01.azurewebsites.net/api/v1/inmuebles/tipos').subscribe({
      next: data => (this.tipos = data),
      error: err => console.error('Error al cargar tipos', err)
    });
  }

  cargarInmuebles() {
    this.inmuebleService.listarInmuebles().subscribe({
      next: (data) => (this.inmuebles = data),
      error: (err) => console.error('Error al cargar inmuebles', err)
    });
  }



nuevoInmueble() {
  this.mostrarFormulario = true;
  this.modoEdicion = false;
  this.inmuebleActual = this.initInmueble();
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
      error: (err: any) => console.error('Error al guardar inmueble', err)
    });
  }
}
