import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { InmuebleService } from "../../services/inmueble";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Navbar } from "../../shared/navbar/navbar";
import { Footer } from "../../shared/footer/footer";
import { InmuebleMockService } from "../../services/inmueble-mock";

@Component({
  selector: "app-detalle-propiedad",
  standalone: true,
  imports: [CommonModule, FormsModule, Navbar, Footer],
  templateUrl: "./detalle-propiedad.html",
})
export class DetallePropiedad implements OnInit {
  inmueble: any;
  contacto = { nombre: "", email: "", telefono: "", mensaje: "" };

  //constructor(
  //private route: ActivatedRoute,
  //private inmuebleService: InmuebleService,
  //) {}

  //constructor temporal que utiliza el inmuebleServiceMock para testing
  constructor(
    private route: ActivatedRoute,
    private inmuebleServiceMock: InmuebleMockService,
  ) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get("id"));
    //cambiamos inmuebleService al inmuebleServiceMock para testing
    this.inmuebleServiceMock.obtenerInmueble(id).subscribe({
      next: (data) => (this.inmueble = data),
      error: (err) => console.error("Error al cargar inmueble", err),
    });
  }

  enviarContacto() {
    if (!this.inmueble?.id) return;
    ///cambiamos inmuebleService al inmuebleServiceMock para testing
    this.inmuebleServiceMock
      .enviarContacto(this.inmueble.id, this.contacto)
      .subscribe({
        next: () => {
          alert("Mensaje enviado correctamente ✅");
          this.contacto = { nombre: "", email: "", telefono: "", mensaje: "" };
        },
        error: (err) => console.error("Error al enviar mensaje", err),
      });
  }
}
