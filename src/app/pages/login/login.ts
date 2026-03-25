import { Component } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { Router } from "@angular/router";
//import { AuthService } from '../../services/auth';
import { CommonModule } from "@angular/common";
import { AuthService } from "../../services/auth-mock";
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

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  onSubmit() {
    this.authService.login(this.email, this.pwd).subscribe({
      next: (user) => {
        console.log("Usuario autenticado:", user);
        // Redirigir según tipo
        if (user.tipoUsuarioId === 1) {
          this.router.navigate(["/dashboard"]); // admin
        } else {
          this.router.navigate(["/mispagos"]); // cliente
        }
      },
      error: () => {
        this.error = "Email o contraseña incorrectos";
      },
    });
  }
}
