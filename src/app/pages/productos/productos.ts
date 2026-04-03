import { HttpClient } from '@angular/common/http';  // 👈 agrega esto
import { Component, OnInit } from '@angular/core';
import { NgFor, NgIf, CurrencyPipe, DatePipe, NgClass } from '@angular/common'; // Agregamos NgClassimport { FormsModule } from '@angular/forms';
import { InmuebleService, Inmueble } from '../../services/inmueble';
import { FormsModule } from '@angular/forms'; // 👈 Agrega esta línea
@Component({
  selector: 'app-productos',
  standalone: true,
  templateUrl: './productos.html',
  imports: [NgFor, NgIf, FormsModule, CurrencyPipe, DatePipe, NgClass], // 👈 Importante NgClass  templateUrl: './productos.html',
  styleUrls: ['./productos.scss']
})
export class Productos implements OnInit {
  inmuebleActual: Inmueble = this.initInmueble();
  inmuebles: Inmueble[] = [];
  filtro = '';
  mostrarFormulario = false;
  modoEdicion = false;
selectedFiles: File[] = [];
  fotosPreview: string[] = [];
  
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

  guardarInmueble() {
    // Si es edición, podrías decidir si mandas fotos o no. 
    // Para la demo, enfoquémonos en el "Crear" (nuevo inmueble) con fotos.
    const accion = this.modoEdicion
      ? this.inmuebleService.actualizar(this.inmuebleActual.id!, this.inmuebleActual)
      : this.inmuebleService.crearInmueble(this.inmuebleActual, this.selectedFiles); // 👈 Pasamos selectedFiles

    accion.subscribe({
      next: () => {
        alert(this.modoEdicion ? 'Actualizado ✅' : 'Creado con fotos en Azure ✅');
        this.mostrarFormulario = false;
        this.selectedFiles = []; // Limpiar fotos
        this.fotosPreview = [];
        this.cargarInmuebles();
      },
      error: (err: any) => alert('Error: ' + err.error)
    });
  }

  // Al dar click en "Nuevo", reseteamos fotos
  nuevoInmueble() {
    this.mostrarFormulario = true;
    this.modoEdicion = false;
    this.selectedFiles = [];
    this.fotosPreview = [];
    this.inmuebleActual = this.initInmueble();
  }

  private initInmueble(): Inmueble {
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
    idTipoInmueble: 1
  };
}

  

  tipos: any[] = [];
  estados: any[] = [];

  // ✅ inyectamos HttpClient aquí
  constructor(
    private inmuebleService: InmuebleService,
    private http: HttpClient  // 👈 agrega esto
  ) {}

  ngOnInit() {
    this.cargarInmuebles();
    this.cargarCatalogos();
  }

cargarCatalogos() {
  // CAMBIA la URL vieja por esta nueva:
  const urlNueva = 'https://inmobiliaria-api-cvewh6fphthve7ad.westus-01.azurewebsites.net/api/v1/inmuebles/tipos';
  
  this.http.get<any[]>(urlNueva).subscribe({
    next: data => {
      console.log('Datos recibidos de la API:', data); // Revisa esto en la consola F12
      this.tipos = data;
    },
    error: err => console.error('Error al cargar tipos', err)
  });
}
  cargarInmuebles() {
    this.inmuebleService.listarInmuebles().subscribe({
      next: (data) => (this.inmuebles = data),
      error: (err) => console.error('Error al cargar inmuebles', err)
    });
  }


  buscar() {
  const texto = this.filtro.toLowerCase();
  return this.inmuebles.filter(i => 
    (i.titulo?.toLowerCase().includes(texto)) || 
    (i.nispc?.toLowerCase().includes(texto))
  );
}

 

  editarInmueble(i: Inmueble) {
    this.mostrarFormulario = true;
    this.modoEdicion = true;
    this.inmuebleActual = { ...i };
  }

  
}
