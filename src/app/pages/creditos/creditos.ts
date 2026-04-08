import { Component, OnInit } from '@angular/core';
import { NgFor, NgIf, DatePipe, CurrencyPipe,NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CreditoService, Credito } from '../../services/credito';
import { AuthService } from '../../services/auth';
import { ActivatedRoute } from '@angular/router';
import { saveAs } from 'file-saver'; // Opcional, o usa el método nativo abajo

@Component({
  selector: 'app-creditos',
  standalone: true,
  imports: [NgFor, NgIf, FormsModule, DatePipe, CurrencyPipe,NgClass],
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
        console.log("cuotas recibidas:", data); // Revisa esto en la consola para ver qué llega
        this.cuotas = data;
        this.mostrarTabla = true; // Oculta el listado y muestra la tabla
        this.mostrarFormulario = false;
      },
      error: (err) => console.error("Error al cargar la tabla de amortización:", err)
    });
  }

// Cambiamos la firma para recibir creditoId y nroCuota
descargarPdf(creditoId: number, nroCuota: number) {
  this.descargarComprobantePorCuota(creditoId, nroCuota).subscribe({
    next: (res: any) => {
      const blob = new Blob([res.body], { type: 'application/pdf' });
      const nombreArchivo = `Recibo_Credito${creditoId}_Cuota${nroCuota}.pdf`;
      saveAs(blob, nombreArchivo);
    },
    error: (err) => {
      console.error("Error", err);
      alert("No se encontró el recibo para esta cuota específica.");
    }
  });
}

// Nueva función de llamada al API
descargarComprobantePorCuota(creditoId: number, nroCuota: number) {
  const url = `https://inmobiliaria-api-cvewh6fphthve7ad.westus-01.azurewebsites.net/api/v1/pagos/comprobante/credito/${creditoId}/cuota/${nroCuota}`;
  return this.http.get(url, {
    responseType: 'blob',
    observe: 'response'
  });
}

  regresarAlListado() {
    this.mostrarTabla = false;
    this.cuotas = [];
    this.creditoSeleccionado = null;
  }

  // Objeto 'nuevo' adaptado al JSON de Azure
nuevoCreditoDTO: any = {
  montoEnganche: 0,
  montoCredito: 0,
  comisionAperturaPct: 1.5, // Un valor default común
  tasaInteresAnualPct: 12.0,
  tasaInteresMoratorioPct: 5.0,
  plazoTotalMeses: 24,
  diaPagoMensual: 1,
  usuarioId: null,
  inmuebleId: null
};

constructor(
  public authService: AuthService, // 👈 Public para que el HTML lo use
  private http: HttpClient,
  private route: ActivatedRoute // 👈 Inyecta esto
  // ... otros servicios
) {}

  ngOnInit() {
    this.cargarCreditos();
    this.cargarCatalogos();
    this.route.queryParams.subscribe(params => {
    if (params['pago'] === 'exito') {
      alert('¡Gracias! Tu pago ha sido procesado correctamente. Actualizando tu estado de cuenta...');
      // Puedes llamar a cargarCreditos() de nuevo para ver la cuota como PAGADA
      this.cargarCreditos();
    }
  });
  }


  descargarComprobante(pagoId: number) {
  const url = `https://inmobiliaria-api-cvewh6fphthve7ad.westus-01.azurewebsites.net/api/v1/pagos/comprobante/${pagoId}`;
  
  return this.http.get(url, {
    responseType: 'blob', // <--- CRUCIAL para archivos
    observe: 'response'   // Para poder leer los headers si fuera necesario
  });
}

cargarCreditos() {
  const user = this.authService.getUsuarioActual();
  console.log("Usuario actual en créditos:", user); // 👈 Revisa esto en la consola para ver cómo se llama el ID
  let url = 'https://inmobiliaria-api-cvewh6fphthve7ad.westus-01.azurewebsites.net/api/v1/creditos';
  
  // Si es cliente, agregamos el parámetro de filtro
  if (this.authService.isCliente()) {
    url += `?usuarioId=${user.idUsuario}`; // Asegúrate de que el objeto user tenga el campo 'id'
  }

  this.http.get<any[]>(url).subscribe({
    next: (data) => this.creditos = data,
    error: (err) => console.error("Error:", err)
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


// 1. Agrega esta variable al inicio de la clase
procesandoPago = false;

// 2. Agrega la función de pago
pagarConPaypal(creditoId: number) {
  this.procesandoPago = true;
  const urlCrearPago = `https://inmobiliaria-api-cvewh6fphthve7ad.westus-01.azurewebsites.net/api/v1/pagos/crear/${creditoId}`;

  console.log("Iniciando pago para crédito:", creditoId);

  this.http.post<any>(urlCrearPago, {}).subscribe({
    next: (res) => {
      if (res && res.url) {
        console.log("Redirigiendo a PayPal:", res.url);
        // Redirección externa al sitio de PayPal
        window.location.href = res.url;
      } else {
        alert("El servidor no devolvió una URL de PayPal válida.");
        this.procesandoPago = false;
      }
    },
    error: (err) => {
      console.error("Error al crear orden de PayPal:", err);
      alert("Hubo un error al conectar con PayPal. Intenta de nuevo.");
      this.procesandoPago = false;
    }
  });
}

guardar() {
  // Creamos una copia limpia para enviar
  const payload = {
    ...this.nuevoCreditoDTO,
    usuarioId: Number(this.nuevoCreditoDTO.usuarioId),
    inmuebleId: Number(this.nuevoCreditoDTO.inmuebleId),
    montoCredito: Number(this.nuevoCreditoDTO.montoCredito),
    montoEnganche: Number(this.nuevoCreditoDTO.montoEnganche)
  };

  console.log('Enviando Crédito a Azure:', payload);
  
  const url = `https://inmobiliaria-api-cvewh6fphthve7ad.westus-01.azurewebsites.net/api/v1/creditos/crear`;

  this.http.post(url, payload).subscribe({
    next: (res) => {
      this.procesarExito();
    },
    error: (err) => {
      console.error(err);
      // Tip: A veces Azure responde 201 pero Angular lo toma como error por el formato del body
      if(err.status === 201) {
        this.procesarExito();
      } else {
        alert('Error al crear crédito: ' + (err.error?.mensaje || 'Verifique IDs y montos'));
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
// Al abrir el formulario
nuevoCredito() {
  this.mostrarFormulario = true;
  this.mostrarTabla = false;
}

  cancelar() { this.mostrarFormulario = false; }
}