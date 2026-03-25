import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe, CurrencyPipe, NgIf, NgFor } from '@angular/common';
import { MisPagosService } from '../../services/mispagos';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-mispagos',
  standalone: true,
  imports: [CommonModule, DatePipe, CurrencyPipe, NgIf, NgFor],
  templateUrl: './mispagos.html',
  styleUrls: ['./mispagos.scss']
})
export class MisPagos implements OnInit {
  creditos: any[] = [];
  detalles: any[] = [];
  creditoSeleccionado: any = null;

  constructor(private pagosService: MisPagosService, private auth: AuthService) {}

  ngOnInit() {
    const usuario = this.auth.getUsuarioActual();
    console.log('🧍 Usuario autenticado:', usuario);

    if (usuario && usuario.id) {
      this.cargarCreditos(usuario.id);
    } else {
      console.warn('⚠️ No hay usuario autenticado.');
    }
  }

  cargarCreditos(usuarioId: number) {
    console.log('📡 Cargando créditos para usuario:', usuarioId);
    this.pagosService.listarCreditos(usuarioId).subscribe({
      next: (data) => {
        console.log('📦 Créditos recibidos:', data);
        this.creditos = data;
      },
      error: (err) => console.error('❌ Error al cargar créditos del cliente', err)
    });
  }

  verPagos(credito: any) {
    this.creditoSeleccionado = credito;
    console.log('📘 Viendo pagos del crédito:', credito.id);

    this.pagosService.listarPagos(credito.id).subscribe({
      next: (data) => {
        console.log('📄 Pagos recibidos:', data);
        this.detalles = data;
      },
      error: (err) => console.error('❌ Error al cargar pagos', err)
    });
  }

  pagarConPaypal(detalle: any) {
  console.log('🟦 Iniciando pago con PayPal para detalle:', detalle.id);

  this.pagosService.iniciarPagoPaypal(detalle.id).subscribe({
    next: (res: any) => {
      console.log('🌐 Redirigiendo a PayPal:', res);
      window.location.href = res.approvalUrl; // Redirige al flujo de aprobación
    },
    error: (err) => console.error('❌ Error iniciando pago PayPal', err)
  });
}

}
