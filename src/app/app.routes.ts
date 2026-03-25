import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { MainLayout } from "./core/layouts/main-layout/main-layout";
import { Dashboard } from "./pages/dashboard/dashboard";
import { Catalogo } from "./pages/catalogo/catalogo";
import { Clientes } from "./pages/clientes/clientes";
import { Productos } from "./pages/productos/productos";
import { Pagos } from "./pages/pagos/pagos";
import { Usuarios } from "./pages/usuarios/usuarios";
import { Creditos } from "./pages/creditos/creditos";
import { AltaInmueble } from "./pages/alta-inmueble/alta-inmueble";

import { Landing } from "./pages/landing/landing";
import { Login } from "./pages/login/login";
import { Register } from "./pages/register/register";
import { Propiedades } from "./pages/propiedades/propiedades";
import { DetallePropiedad } from "./pages/detalle-propiedad/detalle-propiedad";
import { MisPagos } from "./pages/mispagos/mispagos";

import { AdminGuard } from "./core/guards/admin";
import { ClienteGuard } from "./core/guards/cliente";

export const routes: Routes = [
  { path: "", component: Landing },
  { path: "login", component: Login },
  { path: "register", component: Register },
  { path: "propiedades", component: Propiedades },
  { path: "detalle-propiedad/:id", component: DetallePropiedad },

  //Cliente (tipo 2)
  { path: "mispagos", component: MisPagos, canActivate: [ClienteGuard] },

  //Panel de administrador (tipo 1)
  {
    path: "",
    component: MainLayout,
    canActivate: [AdminGuard],
    children: [
      { path: "dashboard", component: Dashboard },
      { path: "clientes", component: Clientes },
      { path: "productos", component: Productos },
      { path: "pagos", component: Pagos },
      { path: "usuarios", component: Usuarios },
      { path: "creditos", component: Creditos },
      { path: "catalogo", component: Catalogo },
      { path: "alta-inmueble", component: AltaInmueble },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
