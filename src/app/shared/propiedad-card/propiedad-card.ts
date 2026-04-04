import { Component, Input } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterLink, RouterModule } from "@angular/router";

@Component({
  selector: "app-propiedad-card",
  standalone: true,
  imports: [CommonModule, RouterModule, RouterLink],
  templateUrl: "./propiedad-card.html",
  styleUrl: "./propiedad-card.scss",
})
export class PropiedadCard {
  @Input({ required: true }) inmueble!: any;

  // Extraer la imagen de la lista que viene de la API
  getImagenUrl(): string {
    if (this.inmueble?.imagenes && this.inmueble.imagenes.length > 0) {
      const principal = this.inmueble.imagenes.find((img: any) => img.esPrincipal);
      return principal ? principal.url : this.inmueble.imagenes[0].url;
    }
    return 'assets/img/placeholder.jpg'; // Imagen por defecto si no hay fotos
  }
}