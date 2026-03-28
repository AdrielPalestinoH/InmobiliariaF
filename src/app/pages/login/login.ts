import { Component } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { Router } from "@angular/router";
//import { AuthService } from '../../services/auth';
import { CommonModule } from "@angular/common";
import { AuthService } from "../../services/auth";
import { Navbar } from "../../shared/navbar/navbar";
import { Footer } from "../../shared/footer/footer";

@Component({
  selector: "app-login",
  standalone: true,
  imports: [FormsModule, CommonModule, Navbar, Footer],
  templateUrl: "./login.html",
  styleUrls: ["./login.scss"],
})
export class Login {
  email = "";
  pwd = "";
  error = "";

  loading = false;
mensajeExito = "";

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

onSubmit() {
  if (this.loading) return; // evita múltiples clics

  this.loading = true;
  this.error = "";
  this.mensajeExito = "";

  this.authService.login(this.email, this.pwd).subscribe({
    next: (user) => {
      console.log("Respuesta backend:", user);

      // Mostrar mensaje al usuario
      this.mensajeExito =
        "Se ha enviado un enlace a tu correo. Revisa tu bandeja principal o spam.";

      // ⏳ Espera unos segundos antes de redirigir (para demo)
      setTimeout(() => {
        if (user.email === 'isc.adrielpalestino@gmail.com') {
          this.router.navigate(["/dashboard"]);
        } else {
          this.router.navigate(["/mispagos"]);
        }
      }, 2000); // 2 seg para que se vea el mensaje

      // desbloquear botón después de unos segundos
      setTimeout(() => {
        this.loading = false;
      }, 5000);
    },
    error: (err) => {
      console.log("ERROR:", err);
      this.error = "Error al enviar el enlace";
      this.loading = false;
    },
  });
}
}
