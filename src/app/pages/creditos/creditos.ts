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
  const baseUrlV1 = 'https://inmobiliaria-api-cvewh6fphthve7ad.westus-01.azurewebsites.net/api/v1';
  
  // 1. Intenta cargar usuarios SIN el v1 si con v1 da 404
  // O revisa si la ruta es plural/singular (usuario vs usuarios)
  this.http.get<any[]>(`${baseUrlV1}/usuarios/debug`).subscribe({
    next: (data) => this.clientes = data,
    error: () => {
      // Intento de rescate si la ruta no tiene v1
      this.http.get<any[]>('https://inmobiliaria-api-cvewh6fphthve7ad.westus-01.azurewebsites.net/api/usuarios/debug')
        .subscribe(data => this.clientes = data);
    }
  });

  // 2. Inmuebles ya sabemos que funciona con v1
  this.http.get<any[]>(`${baseUrlV1}/inmuebles`).subscribe(data => this.inmuebles = data);
}


guardar() {
  // Aseguramos que los valores sean números
  const enganche = Number(this.nuevo.montoEnganche);
  const totalInmueble = Number(this.nuevo.montoCredito);
  
  // 🎯 IMPORTANTE: 
  // Si tu backend espera que 'montoCredito' sea el préstamo neto:
  // const prestamoNeto = totalInmueble - enganche; 
  // Pero vamos a mandarlos tal cual, asegurando que no sean cero.

  const payload = {
    usuarioId: Number(this.nuevo.usuarioId),
    inmuebleId: Number(this.nuevo.inmuebleId),
    montoEnganche: enganche,
    montoCredito: totalInmueble, // <--- Verifica si aquí debes mandar el total o la resta
    comisionAperturaPct: Number(this.nuevo.comisionAperturaPct),
    tasaInteresAnualPct: Number(this.nuevo.tasaInteresAnualPct),
    tasaInteresMoratorioPct: Number(this.nuevo.tasaInteresMoratorioPct),
    plazoTotalMeses: Number(this.nuevo.plazoTotalMeses),
    diaPagoMensual: Number(this.nuevo.diaPagoMensual),
    saldoInsolutoActual: totalInmueble,
    fechaApertura: new Date(this.nuevo.fechaApertura).toISOString()
  };

  if (payload.montoCredito <= 0) {
    alert("El monto del crédito debe ser mayor a cero antes de enviar.");
    return;
  }

  const urlFinal = 'https://inmobiliaria-api-cvewh6fphthve7ad.westus-01.azurewebsites.net/api/v1/creditos/crear';

  this.http.post(urlFinal, payload).subscribe({
    next: (res) => {
      alert('¡Crédito generado con éxito! 🚀');
      this.mostrarFormulario = false;
      this.cargarCreditos();
    },
    error: (err) => {
      // Si el servidor responde 201 'Created', es un éxito aunque haya error de parseo JSON
      if (err.status === 201 || err.status === 200) {
        alert('¡Crédito generado con éxito! 🚀');
        this.mostrarFormulario = false;
        this.cargarCreditos();
      } else {
        console.error("❌ Error 400 - El Backend rechazó los datos:", err.error);
        alert(`Error del servidor: ${err.error}`); 
      }
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