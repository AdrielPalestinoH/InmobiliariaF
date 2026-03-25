import { Component } from "@angular/core";
import { RouterLink } from "@angular/router";
import { Navbar } from "../../shared/navbar/navbar";
import { Footer } from "../../shared/footer/footer"; // 👈 importa RouterLink

@Component({
  selector: "app-landing",
  imports: [RouterLink, Navbar, Footer],
  templateUrl: "./landing.html",
  styleUrl: "./landing.scss",
})
export class Landing {}
