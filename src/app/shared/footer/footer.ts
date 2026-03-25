import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

@Component({
  selector: "app-footer",
  imports: [CommonModule, FormsModule],
  templateUrl: "./footer.html",
  styleUrl: "./footer.scss",
})
export class Footer {
  year: number = new Date().getFullYear();
  email: string = "";

  submitNewsletter(): void {
    const value = (this.email || "").trim();
    if (!value) return;

    console.log("Newsletter email:", value);
    this.email = "";
  }
}
