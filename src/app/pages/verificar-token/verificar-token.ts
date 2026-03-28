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

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    const token = this.route.snapshot.queryParamMap.get("token");

    console.log("TOKEN:", token);

    if (!token) {
      this.router.navigate(["/login"]);
      return;
    }

    this.authService.verificarToken(token).subscribe({
      next: (resp: any) => {
        console.log("LOGIN OK:", resp);

        // guardar sesión
        localStorage.setItem("token", resp.token);

       console.log("TOKEN GUARDADO:", localStorage.getItem("token"));
        localStorage.setItem("usuario", JSON.stringify(resp));

        // 🔥 redirección por rol
        if (resp.rol === "ADMIN") {
          this.router.navigate(["/dashboard"]);
        } else {
          this.router.navigate(["/mispagos"]);
        }
      },
      error: (err) => {
         console.log("🔥 ERROR TOKEN COMPLETO:", err);
  this.router.navigate(["/login"]);
      },
    });
  }
}