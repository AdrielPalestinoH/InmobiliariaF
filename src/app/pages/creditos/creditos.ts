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
  creditos: any[] = [];
  clientes: any[] = [];
  inmuebles: any[] = [];
  mostrarFormulario = false;

  // Objeto 'nuevo' adaptado al JSON de Azure
  nuevo: any = {
    usuarioId: null,
    inmuebleId: null,
    montoEnganche: 0,
    montoCredito: 0,
    comisionAperturaPct: 1.5,
    tasaInteresAnualPct: 12.0,
    tasaInteresMoratorioPct: 5.0,
    plazoTotalMeses: 24,
    diaPagoMensual: 15,
    saldoInsolutoActual: 0,
    fechaApertura: new Date().toISOString().substring(0, 10)
  };

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.cargarCreditos();
    this.cargarCatalogos();
  }

  cargarCreditos() {
    const url = 'https://inmobiliaria-api-cvewh6fphthve7ad.westus-01.azurewebsites.net/api/creditos';
    this.http.get<any[]>(url).subscribe(data => this.creditos = data);
  }

 cargarCatalogos() {
  // 🎯 Agregamos el /v1/ que es donde tu API realmente escucha
  const baseUrl = 'https://inmobiliaria-api-cvewh6fphthve7ad.westus-01.azurewebsites.net/api/v1';

  this.http.get<any[]>(`${baseUrl}/usuarios`).subscribe({
    next: (data) => {
      this.clientes = data;
      console.log('✅ Usuarios cargados:', data);
    },
    error: (err) => console.error('❌ Error 404 en Usuarios - Revisa la ruta:', err)
  });

  this.http.get<any[]>(`${baseUrl}/inmuebles`).subscribe({
    next: (data) => {
      this.inmuebles = data;
      console.log('✅ Inmuebles cargados:', data);
    },
    error: (err) => console.error('❌ Error 404 en Inmuebles - Revisa la ruta:', err)
  });
}



guardar() {
  // Sincronizar saldo antes de enviar
  this.nuevo.saldoInsolutoActual = this.nuevo.montoCredito;

  const payload = {
    ...this.nuevo,
    fechaApertura: new Date(this.nuevo.fechaApertura).toISOString()
  };

  // 🎯 URL con v1 para el POST
  const urlCreditos = 'https://inmobiliaria-api-cvewh6fphthve7ad.westus-01.azurewebsites.net/api/v1/creditos';

  this.http.post(urlCreditos, payload).subscribe({
    next: (res) => {
      alert('¡Crédito creado con éxito! 🚀');
      this.mostrarFormulario = false;
      this.cargarCreditos();
    },
    error: (err) => {
      console.error('❌ Error al crear crédito:', err);
      alert('Error al guardar. Revisa que el ID del usuario e inmueble existan.');
    }
  });
}

  nuevoCredito() {
    this.nuevo = {
      usuarioId: null,
      inmuebleId: null,
      montoEnganche: 0,
      montoCredito: 0,
      comisionAperturaPct: 1.5,
      tasaInteresAnualPct: 12.0,
      tasaInteresMoratorioPct: 5.0,
      plazoTotalMeses: 24,
      diaPagoMensual: 15,
      saldoInsolutoActual: 0,
      fechaApertura: new Date().toISOString().substring(0, 10)
    };
    this.mostrarFormulario = true;
  }

  cancelar() { this.mostrarFormulario = false; }
}