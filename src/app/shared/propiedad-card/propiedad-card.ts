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
}
