import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../../services/dashboard';
import { CurrencyPipe } from '@angular/common';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.html',
  imports: [CurrencyPipe], // ✅ agrega el CurrencyPipe aquí
  styleUrls: ['./dashboard.scss']
})
export class Dashboard implements OnInit {
  totalClientes = 0;
  totalPagos = 0;
  totalInmuebles = 0;

  constructor(private dashboardService: DashboardService) {}

  ngOnInit() {
    this.dashboardService.getDashboardData().subscribe({
      next: (data) => {
        this.totalClientes = data.clientes;
        this.totalPagos = data.pagos;
        this.totalInmuebles = data.inmuebles;
      },
      error: (err) => console.error('Error al cargar dashboard', err)
    });
  }
}
