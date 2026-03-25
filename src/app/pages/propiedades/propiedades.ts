import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Inmueble } from "../../services/inmueble";
import { Navbar } from "../../shared/navbar/navbar";
import { Footer } from "../../shared/footer/footer";
import { InmuebleMockService } from "../../services/inmueble-mock";
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
  inmueblesView: any[] = [];

  //Aqui cambiamos al componente de produccion
  //constructor(private inmuebleService: InmuebleService) {}
  constructor(private inmuebleServiceMock: InmuebleMockService) {}

  ngOnInit() {
    this.inmuebleServiceMock.getPropiedades().subscribe({
      next: (data) => {
        this.inmuebles = data;
        this.inmueblesView = Array.isArray(data) ? [...data] : [];
      },
      error: (err) => {
        console.error("Error al cargar propiedades", err);
        this.inmuebles = [];
        this.inmueblesView = [];
      },
    });
  }

  onOrdenChange(event: Event) {
    const orden = (event.target as HTMLSelectElement).value;

    const base = [...this.inmuebles];

    if (orden === "priceAsc") {
      base.sort((a, b) => (Number(a.precio) || 0) - (Number(b.precio) || 0));
    } else if (orden === "priceDesc") {
      base.sort((a, b) => (Number(b.precio) || 0) - (Number(a.precio) || 0));
    }

    this.inmueblesView = base;
  }
}
