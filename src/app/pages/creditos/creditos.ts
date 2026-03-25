import { Component, OnInit } from '@angular/core';
import { NgFor, NgIf, DatePipe, CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CreditoService, Credito } from '../../services/credito';

@Component({
  selector: 'app-creditos',
  standalone: true,
  imports: [NgFor, NgIf, FormsModule, DatePipe, CurrencyPipe],
  templateUrl: './creditos.html',
  styleUrls: ['./creditos.scss']
})
export class Creditos implements OnInit {
  creditos: Credito[] = [];
  clientes: any[] = [];
  inmuebles: any[] = [];
  mostrarFormulario = false;

  nuevo: any = {
    id: null,
    usuarioId: null,
    inmuebleId: null,
    total: 0,
    totalPagos: 1,
    frecuencia: 'MENSUAL',
    referencia: '',
    fechaInicio: new Date().toISOString().substring(0, 10),
    fechaFinal: ''
  };

  constructor(private creditoService: CreditoService, private http: HttpClient) {}

  ngOnInit() {
    this.cargarCreditos();
    this.cargarCatalogos();
  }

  cargarCreditos() {
    this.creditoService.listar().subscribe({
      next: (data) => (this.creditos = data),
      error: (err) => console.error('Error al cargar créditos', err)
    });
  }

  cargarCatalogos() {
    this.http.get<any[]>('https://inmoapi-adagc9dgfjgnfuar.westus-01.azurewebsites.net/api/usuarios').subscribe({
      next: (data) => (this.clientes = data),
      error: (err) => console.error('Error al cargar usuarios', err)
    });
    this.http.get<any[]>('https://inmoapi-adagc9dgfjgnfuar.westus-01.azurewebsites.net/api/inmuebles').subscribe({
      next: (data) => (this.inmuebles = data),
      error: (err) => console.error('Error al cargar inmuebles', err)
    });
  }

  nuevoCredito() {
    this.nuevo = {
      id: null,
      usuarioId: null,
      inmuebleId: null,
      total: 0,
      totalPagos: 1,
      frecuencia: 'MENSUAL',
      referencia: '',
      fechaInicio: new Date().toISOString().substring(0, 10),
      fechaFinal: ''
    };
    this.mostrarFormulario = true;
  }

  guardar() {
    this.creditoService.crear(this.nuevo).subscribe({
      next: () => {
        alert('Crédito creado ✅');
        this.mostrarFormulario = false;
        this.cargarCreditos();
      },
      error: (err) => console.error('Error al guardar crédito', err)
    });
  }

  editar(c: any) {
    this.nuevo = { ...c };
    this.mostrarFormulario = true;
  }

reestructurar() {
  if (!this.nuevo.id || !this.nuevo.totalPagos) {
    alert('Debe seleccionar un crédito y definir el número de pagos');
    return;
  }

  const url = `https://inmoapi-adagc9dgfjgnfuar.westus-01.azurewebsites.net/api/creditos/${this.nuevo.id}/reestructurar?nuevoTotalPagos=${this.nuevo.totalPagos}&frecuencia=${this.nuevo.frecuencia}`;

  console.log('📤 Enviando reestructuración a:', url);

  this.http.put(url, null, { responseType: 'text' }).subscribe({
    next: (response) => {
      console.log('✅ Respuesta backend:', response);
      alert('Crédito reestructurado correctamente ✅');
      this.mostrarFormulario = false;
      this.cargarCreditos();
    },
    error: (err) => {
      console.error('❌ Error al reestructurar crédito', err);
      alert('Error al reestructurar crédito ❌');
    }
  });
}


  cancelar() {
    this.mostrarFormulario = false;
  }
}
