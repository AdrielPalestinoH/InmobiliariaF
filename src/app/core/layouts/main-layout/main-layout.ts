import { Component } from '@angular/core';
import { Sidebar } from '../../components/sidebar/sidebar'; // 👈 importa el Sidebar
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [Sidebar,RouterOutlet], // 👈 agrégalo aquí
  templateUrl: './main-layout.html',
  styleUrls: ['./main-layout.scss']
})
export class MainLayout {}
