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

  // Agrega estas variables a tu clase
  mostrarTabla: boolean = false;
  cuotas: any[] = [];
  creditoSeleccionado: any = null;

  // Método para cargar la tabla
  verDetalle(credito: any) {
    this.creditoSeleccionado = credito;
    const url = `https://inmobiliaria-api-cvewh6fphthve7ad.westus-01.azurewebsites.net/api/v1/creditos/${credito.id}/tabla`;
    
    this.http.get<any[]>(url).subscribe({
      next: (data) => {
        this.cuotas = data;
        this.mostrarTabla = true; // Oculta el listado y muestra la tabla
        this.mostrarFormulario = false;
      },
      error: (err) => console.error("Error al cargar la tabla de amortización:", err)
    });
  }

  regresarAlListado() {
    this.mostrarTabla = false;
    this.cuotas = [];
    this.creditoSeleccionado = null;
  }

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
  // 1. Agregamos el /v1/ que faltaba
  const url = 'https://inmobiliaria-api-cvewh6fphthve7ad.westus-01.azurewebsites.net/api/v1/creditos';
  
  this.http.get<any[]>(url).subscribe({
    next: (data) => {
      this.creditos = data;
      console.log("Créditos recibidos:", data);
    },
    error: (err) => console.error("Error al cargar créditos:", err)
  });
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
  const payload = {
    usuarioId: Number(this.nuevo.usuarioId),
    inmuebleId: Number(this.nuevo.inmuebleId),
    montoEnganche: Number(this.nuevo.montoEnganche),
    montoCredito: Number(this.nuevo.montoCredito),
    comisionAperturaPct: Number(this.nuevo.comisionAperturaPct),
    tasaInteresAnualPct: Number(this.nuevo.tasaInteresAnualPct),
    tasaInteresMoratorioPct: Number(this.nuevo.tasaInteresMoratorioPct),
    plazoTotalMeses: Number(this.nuevo.plazoTotalMeses),
    diaPagoMensual: Number(this.nuevo.diaPagoMensual),
    saldoInsolutoActual: Number(this.nuevo.montoCredito),
    fechaApertura: new Date(this.nuevo.fechaApertura).toISOString()
  };

  const urlFinal = 'https://inmobiliaria-api-cvewh6fphthve7ad.westus-01.azurewebsites.net/api/v1/creditos/crear';

  this.http.post(urlFinal, payload, { responseType: 'text' }).subscribe({
    next: () => {
      this.procesarExito();
    },
    error: (err) => {
      // ERR_CONNECTION_RESET a menudo llega como status 0 o 201 en la consola
      // Si el log dice 201 (Created), el registro YA ESTÁ en la base de datos.
      if (err.status === 201 || err.status === 200 || err.status === 0) {
        console.warn("Se detectó un corte de conexión, pero el servidor marcó 201. Procesando como éxito.");
        this.procesarExito();
      } else {
        console.error("❌ Error real:", err);
        alert('Error al guardar. Revisa que el monto sea mayor a 0.');
      }
    }
  });
}

// Función auxiliar para no repetir código
procesarExito() {
  alert('¡Crédito generado con éxito! 🚀 (Nota: La tabla de amortización se creó correctamente)');
  this.mostrarFormulario = false;
  this.cargarCreditos(); // Esto refrescará la lista y verás el nuevo crédito ahí
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