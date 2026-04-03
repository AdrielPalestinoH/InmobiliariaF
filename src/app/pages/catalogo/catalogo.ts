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

  // NUEVO MÉTODO: Para encontrar la foto de Azure
  obtenerImagenPrincipal(inmueble: Inmueble): string {
    if (inmueble.imagenes && inmueble.imagenes.length > 0) {
      // Buscamos la que tenga esPrincipal true en el JSON de Java
      const principal = inmueble.imagenes.find(img => img.esPrincipal === true);
      // Retornamos la URL de esa, o la primera si no hay marcada como principal
      // OJO: Usamos 'url' porque así lo llamamos en el DTO de Java
      return principal ? principal.url : inmueble.imagenes[0].url;
    }
    return 'https://picsum.photos/400/300'; // Fallback si no hay fotos
  }
}