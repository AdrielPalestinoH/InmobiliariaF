import { Component, OnInit } from '@angular/core';
import { CurrencyPipe, NgFor } from '@angular/common';
import { InmuebleService, Inmueble } from '../../services/inmueble';

@Component({
  selector: 'app-catalogo',
  standalone: true,
  imports: [NgFor, CurrencyPipe],
  templateUrl: './catalogo.html',
  styleUrls: ['./catalogo.scss']
})
export class Catalogo implements OnInit {
  inmuebles: Inmueble[] = [];

  constructor(private inmuebleService: InmuebleService) {}

  ngOnInit() {
    this.inmuebleService.listarInmuebles().subscribe({
      next: (data) => this.inmuebles = data,
      error: (err) => console.error('Error al cargar inmuebles', err)
    });
  }
}
