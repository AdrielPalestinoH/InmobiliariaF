import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Inmueble, InmuebleService } from "../../services/inmueble"; // 👈 Usar servicio real
import { Navbar } from "../../shared/navbar/navbar";
import { Footer } from "../../shared/footer/footer";
import { PropiedadCard } from "../../shared/propiedad-card/propiedad-card";

@Component({
  selector: "app-propiedades",
  standalone: true,
  imports: [CommonModule, Navbar, Footer, PropiedadCard],
  templateUrl: "./propiedades.html",
  styleUrls: ["./propiedades.scss"],
})
export class Propiedades implements OnInit {
  inmuebles: Inmueble[] = [];
  inmueblesView: Inmueble[] = [];

  // ✅ Inyectamos el servicio real
  constructor(private inmuebleService: InmuebleService) {}

  ngOnInit() {
    this.cargarPropiedades();
  }

  cargarPropiedades() {
    this.inmuebleService.listarInmuebles().subscribe({
      next: (data) => {
        // Guardamos los datos reales de la BD
        this.inmuebles = data;
        this.inmueblesView = [...data];
      },
      error: (err) => {
        console.error("Error al cargar propiedades de la API", err);
      },
    });
  }

  onOrdenChange(event: Event) {
    const orden = (event.target as HTMLSelectElement).value;
    const base = [...this.inmuebles];

    if (orden === "priceAsc") {
      base.sort((a, b) => a.precio - b.precio);
    } else if (orden === "priceDesc") {
      base.sort((a, b) => b.precio - a.precio);
    }

    this.inmueblesView = base;
  }
}