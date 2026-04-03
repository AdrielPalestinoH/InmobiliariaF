import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Catalogo, EstadoInmueble, TipoInmueble } from '../../services/catalogo';
import { InmuebleService } from '../../services/inmueble';
import { NgFor, NgIf ,NgClass} from '@angular/common';

@Component({
  selector: 'app-alta-inmueble',
  standalone: true,
  imports: [FormsModule, NgFor, NgIf,NgClass],
  templateUrl: './alta-inmueble.html',
  styleUrls: ['./alta-inmueble.scss']
})
export class AltaInmueble implements OnInit {
  estados: EstadoInmueble[] = [];
  tipos: TipoInmueble[] = [];
  selectedFiles: File[] = [];
  fotosPreview: string[] = [];

  // Inicializamos el objeto inmueble llamando al método nuevo
  inmueble = this.initInmueble();

  constructor(
    private catalogoService: Catalogo,
    private inmuebleService: InmuebleService
  ) {}

  // 1. EL MÉTODO QUE FALTABA: Define la estructura inicial/vacia
  initInmueble() {
    return {
      titulo: '',
      precio: 0,
      nispc: '',
      claveCatastral: '',
      manzana: '',
      lote: '',
      fraccion: '',
      terrenoM2: 0,
      
      disponibilidad: 'DISPONIBLE',
      id_tipo_inmueble: 0 
    };
  }

  onFileSelected(event: any) {
    const files = Array.from(event.target.files) as File[];
    if (files.length > 4) {
      alert("Solo puedes subir un máximo de 4 fotos.");
      event.target.value = '';
      return;
    }
    this.selectedFiles = files;
    this.fotosPreview = [];
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e: any) => this.fotosPreview.push(e.target.result);
      reader.readAsDataURL(file);
    });
  }

  ngOnInit() {
    this.catalogoService.getEstados().subscribe({
      next: (data) => { this.estados = data; },
      error: (err) => console.error('Error al cargar estados', err)
    });

    this.catalogoService.getTipos().subscribe({
      next: (data) => { this.tipos = data; },
      error: (err) => console.error('Error al cargar tipos', err)
    });
  }

  guardar() {
    if (this.inmueble.id_tipo_inmueble === 0) {
      alert('Selecciona un tipo de inmueble');
      return;
    }
    if (this.selectedFiles.length === 0) {
      alert('Debes subir al menos 1 imagen');
      return;
    }

    console.log('Enviando datos y fotos a Azure...');

    this.inmuebleService.crearInmueble(this.inmueble, this.selectedFiles).subscribe({
      next: (res) => {
        console.log('Respuesta del servidor:', res);
        alert('¡Inmueble creado y fotos subidas a Azure con éxito! ✅');
        
        // Ahora sí, ya existe el método para limpiar
        this.inmueble = this.initInmueble(); 
        this.selectedFiles = [];
        this.fotosPreview = [];
      },
      error: (err) => {
        console.error('Error en el registro:', err);
        alert('Error al guardar: ' + (err.error?.message || 'Error de conexión con el servidor'));
      }
    });
  }
}