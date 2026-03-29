import { Component, OnInit } from '@angular/core';
import { CurrencyPipe } from '@angular/common'; // Quitamos NgFor si usamos @for
import { RouterModule } from '@angular/router'; // <--- IMPORTANTE: Agrega esto
import { InmuebleService, Inmueble } from '../../services/inmueble';

@Component({
  selector: 'app-catalogo',
  standalone: true,
  // Agregamos RouterModule para que reconozca [routerLink]
  imports: [CurrencyPipe, RouterModule], 
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