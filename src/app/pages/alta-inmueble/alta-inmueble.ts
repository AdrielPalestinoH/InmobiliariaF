import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Catalogo, EstadoInmueble, TipoInmueble } from '../../services/catalogo';
import { InmuebleService } from '../../services/inmueble';
import { NgFor } from '@angular/common';  // 👈 Importar esto

@Component({
  selector: 'app-alta-inmueble',
  standalone: true,
  imports: [FormsModule,NgFor],
  templateUrl: './alta-inmueble.html',
  styleUrls: ['./alta-inmueble.scss']
})
export class AltaInmueble implements OnInit {
  estados: EstadoInmueble[] = [];
  tipos: TipoInmueble[] = [];

  inmueble = {
    descripcion: '',
    precio: 0,
    estadoId: 0,
    tipoId: 0
  };

  constructor(
    private catalogoService: Catalogo,
    private inmuebleService: InmuebleService
  ) {}

  ngOnInit() {
    this.catalogoService.getEstados().subscribe({
      next: (data) => {
        console.log('Estados cargados:', data);
        this.estados = data;
      },
      error: (err) => console.error('Error al cargar estados', err)
    });

    this.catalogoService.getTipos().subscribe({
      next: (data) => {
        console.log('Tipos cargados:', data);
        this.tipos = data;
      },
      error: (err) => console.error('Error al cargar tipos', err)
    });
  }

  guardar() {
    this.inmuebleService.crearInmueble(
      { descripcion: this.inmueble.descripcion, precio: this.inmueble.precio },
   
    ).subscribe({
      next: () => alert('Inmueble creado con éxito'),
      error: (err) => console.error('Error al crear inmueble', err)
    });
  }
}
