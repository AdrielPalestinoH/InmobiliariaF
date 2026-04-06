import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { AuthService } from "../../services/auth";

@Component({
  selector: "app-verificar-token",
  template: `<div class="text-center mt-5">
               <h3>Validando acceso...</h3>
             </div>`,
})
export class VerificarTokenComponent implements OnInit {
  private validando = false; // 👈 Candado para evitar doble petición

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    const token = this.route.snapshot.queryParamMap.get("token");

    if (!token || this.validando) return; // 👈 Si ya está validando, no hagas nada

    this.validando = true; // 👈 Bloqueamos futuras peticiones
    console.log("Iniciando validación de TOKEN:", token);

    this.authService.verificarToken(token).subscribe({
      next: (resp: any) => {
        // ... (tu lógica de guardar en localStorage)
        localStorage.setItem("token", resp.token);
        localStorage.setItem("usuario", JSON.stringify(resp));

        console.log("LOGIN EXITOSO, REDIRECCIONANDO...");
        
        // Usa el campo 'rol' que viene del backend
        if (resp.rol === "ADMIN") {
          this.router.navigate(["/dashboard"]);
        } else {
          this.router.navigate(["/catalogo"]); // Sugerencia: llevar al cliente al catálogo
        }
      },
      error: (err) => {
        console.error("🔥 ERROR AL VERIFICAR:", err);
        // Si el error dice "ya fue utilizado" pero ya tenemos un usuario en localStorage, 
        // quizá fue que la primera petición sí entró. 
        if (localStorage.getItem("usuario")) {
           this.router.navigate(["/dashboard"]);
        } else {
           this.router.navigate(["/login"]);
        }
      },
    });
  }
}