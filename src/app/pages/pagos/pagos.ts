import { Component, OnInit } from '@angular/core';
import { NgFor, NgIf, DatePipe, CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PagoService, Pago } from '../../services/pagos';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-pagos',
  standalone: true,
  imports: [NgFor, NgIf, FormsModule, DatePipe, CurrencyPipe],
  templateUrl: './pagos.html',
  styleUrls: ['./pagos.scss']
})
export class Pagos implements OnInit {
  creditos: any[] = [];
  detalles: any[] = [];
  metodos: any[] = [];
  pagos: any[] = [];
  clienteNombre = '';

  creditoSeleccionado: any = null;
  nuevoPago: Pago = { creditoDetalleId: 0, metodoPagoId: 0, totalAbonado: 0, referencia: '' };

  mostrarDetalles = false;
  mostrarFormularioPago = false;

  constructor(private pagoService: PagoService, private http: HttpClient) {}

  ngOnInit() {
    this.cargarCreditos();
    this.cargarMetodosPago();
  }

  cargarCreditos() {
    this.pagoService.listarCreditos().subscribe({
      next: (data) => (this.creditos = data),
      error: (err) => console.error('Error al cargar créditos', err)
    });
  }

  cargarMetodosPago() {
    this.http.get<any[]>('https://inmoapi-adagc9dgfjgnfuar.westus-01.azurewebsites.net/api/pagos/metodos').subscribe({
      next: (data) => (this.metodos = data),
      error: (err) => console.error('Error al cargar métodos de pago', err)
    });
  }

  verPagos(credito: any) {
    this.creditoSeleccionado = credito;
    this.clienteNombre = credito.usuarioNombre;
    this.http.get<any[]>(`https://inmoapi-adagc9dgfjgnfuar.westus-01.azurewebsites.net/api/pagos/detalle/${credito.id}`).subscribe({
      next: (data) => (this.pagos = data),
      error: (err) => console.error('Error al cargar pagos', err)
    });
  }

verDetalles(c: any) {
  this.creditoSeleccionado = c;
  this.mostrarDetalles = true;

  this.http.get<any[]>(`https://inmoapi-adagc9dgfjgnfuar.westus-01.azurewebsites.net/api/pagos/${c.id}`).subscribe({
    next: (data) => (this.detalles = data),
    error: (err) => console.error('Error al cargar pagos', err)
  });
}
  abrirPago(detalle: any) {
    this.nuevoPago = {
      creditoDetalleId: detalle.id,
      metodoPagoId: 0,
      totalAbonado: detalle.precio,
      referencia: ''
    };
    this.mostrarFormularioPago = true;
  }

guardarPago() {
  if (!this.nuevoPago.metodoPagoId) {
    alert('Por favor selecciona un método de pago.');
    return;
  }

  if (!this.nuevoPago.referencia.trim()) {
    alert('Por favor ingresa una referencia del pago.');
    return;
  }

  console.log('📤 Enviando pago:', this.nuevoPago);

  this.pagoService.crearPago(this.nuevoPago).subscribe({
    next: () => {
      alert('✅ Pago registrado correctamente');
      this.mostrarFormularioPago = false;
      this.verDetalles(this.creditoSeleccionado);
    },
    error: (err) => {
      console.error('Error al guardar pago:', err);
      alert('❌ Error al registrar el pago');
    }
  });
}

  estatusTexto(estatus: number): string {
    return estatus === 1 ? 'Pagado' : 'Pendiente';
  }
}
