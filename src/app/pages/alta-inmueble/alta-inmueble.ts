import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Catalogo, EstadoInmueble, TipoInmueble } from '../../services/catalogo';
import { InmuebleService } from '../../services/inmueble';
import { NgFor ,NgIf} from '@angular/common';  // 👈 Importar esto

@Component({
  selector: 'app-alta-inmueble',
  standalone: true,
  imports: [FormsModule,NgFor,NgIf],
  templateUrl: './alta-inmueble.html',
  styleUrls: ['./alta-inmueble.scss']
})
export class AltaInmueble implements OnInit {
  estados: EstadoInmueble[] = [];
  tipos: TipoInmueble[] = [];


  selectedFiles: File[] = [];
fotosPreview: string[] = [];

onFileSelected(event: any) {
  const files = Array.from(event.target.files) as File[];
  
  if (files.length > 4) {
    alert("Solo puedes subir un máximo de 4 fotos.");
    event.target.value = ''; // Limpiar input
    return;
  }

  this.selectedFiles = files;
  
  // Crear previsualizaciones
  this.fotosPreview = [];
  files.forEach(file => {
    const reader = new FileReader();
    reader.onload = (e: any) => this.fotosPreview.push(e.target.result);
    reader.readAsDataURL(file);
  });
}

  inmueble = {
    titulo: '',
    precio: 0,
    nispc: '',             // 👈 Agregados
    claveCatastral: '',     // 👈 Agregados
    manzana: '',           // 👈 Agregados
    lote: '',              // 👈 Agregados
    fraccion: '',          // 👈 Agregados
    terrenoM2: 0,          // 👈 Agregados
    disponibilidad: 'DISPONIBLE',
    id_tipo_inmueble: 0      // Asegúrate que coincida con el nombre en la interfaz
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
        console.log("tipos: ",this.tipos)
      },
      error: (err) => console.error('Error al cargar tipos', err)
    });
  }

  guardar() {
    // Verificamos que el idTipoInmueble tenga un valor válido antes de enviar
    if (this.inmueble.id_tipo_inmueble === 0) {
      alert('Por favor selecciona un tipo de inmueble');
      return;
    }

    // Enviamos el objeto completo (se castea como 'any' o 'Inmueble' si es necesario)
    this.inmuebleService.crearInmueble(this.inmueble as any).subscribe({
      next: () => {
        alert('Inmueble creado con éxito ✅');
        // Opcional: resetear el formulario aquí
      },
      error: (err) => {
        console.error('Error al crear inmueble', err);
        alert('Error al guardar: ' + (err.error?.message || 'Error de conexión'));
      }
    });
  }
}
