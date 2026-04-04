import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { InmuebleService, Inmueble } from "../../services/inmueble"; // 👈 Servicio REAL
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Navbar } from "../../shared/navbar/navbar";
import { Footer } from "../../shared/footer/footer";

@Component({
  selector: "app-detalle-propiedad",
  standalone: true,
  imports: [CommonModule, FormsModule, Navbar, Footer],
  templateUrl: "./detalle-propiedad.html",
})
export class DetallePropiedad implements OnInit {
  inmueble?: Inmueble; // 👈 Usamos la interfaz
  contacto = { nombre: "", email: "", telefono: "", mensaje: "" };

  constructor(
    private route: ActivatedRoute,
    private inmuebleService: InmuebleService // 👈 Inyectamos el REAL
  ) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get("id"));
    if (id) {
      this.inmuebleService.obtenerPorId(id).subscribe({
        next: (data) => {
          this.inmueble = data;
          console.log("Inmueble cargado:", data);
        },
        error: (err) => console.error("Error al cargar inmueble real", err),
      });
    }
  }

  enviarContacto() {
    // Aquí puedes implementar el envío real a tu API
    console.log("Enviando contacto para ID:", this.inmueble?.id, this.contacto);
    alert("Solicitud enviada. Pronto nos contactaremos.");
  }
}