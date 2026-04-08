import { HttpClient } from '@angular/common/http';  // 👈 agrega esto
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core'; // Agrega ViewChild y ElementRef
import { NgFor, NgIf, CurrencyPipe, DatePipe, NgClass } from '@angular/common'; // Agregamos NgClassimport { FormsModule } from '@angular/forms';
import { InmuebleService, Inmueble } from '../../services/inmueble';
import { FormsModule } from '@angular/forms'; // 👈 Agrega esta línea
import { UsuarioService } from '../../services/usuario';
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
asentamientos: any[] = [];
municipioNombre: string = '';
estadoNombre: string = '';


  @ViewChild('fileInput') fileInput!: ElementRef;
  
  onFileSelected(event: any) {
  const nuevosArchivos = Array.from(event.target.files) as File[];
  
  // Validar que el total no pase de 4
  if (this.selectedFiles.length + nuevosArchivos.length > 4) {
    alert("No puedes subir más de 4 fotos en total.");
    event.target.value = ''; // Limpiar el input para que puedan reintentar
    return;
  }


  
  // Acumular los archivos y generar sus previews
  nuevosArchivos.forEach(file => {
    this.selectedFiles.push(file);
    const reader = new FileReader();
    reader.onload = (e: any) => this.fotosPreview.push(e.target.result);
    reader.readAsDataURL(file);
  });

  // Limpiar el input físico para permitir volver a seleccionar el mismo archivo si se desea
  event.target.value = '';
}



// 2. Método para buscar la dirección (Reutilizamos la lógica de Clientes)
buscarDireccion() {
    if (this.inmuebleActual.codigoPostal?.length === 5) {
      this.usuarioService.buscarPorCP(this.inmuebleActual.codigoPostal).subscribe({
        next: (data) => {
          this.asentamientos = data;
          if (data && data.length > 0) {
            this.municipioNombre = data[0].municipio.nombre;
            this.estadoNombre = data[0].municipio.estado.nombre;
          }
        },
        error: (err) => {
          console.error('Error al buscar CP', err);
          this.asentamientos = [];
          this.municipioNombre = '';
          this.estadoNombre = '';
        }
      });
    }
  }

// Agregar este método para que el usuario pueda corregir si se equivoca de foto
quitarFoto(index: number) {
  this.selectedFiles.splice(index, 1);
  this.fotosPreview.splice(index, 1);
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

        this.selectedFiles = [];
this.fotosPreview = [];
if (this.fileInput) this.fileInput.nativeElement.value = '';
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

  limpiarFormulario() {
    this.selectedFiles = [];
    this.fotosPreview = [];
    if (this.fileInput) this.fileInput.nativeElement.value = '';
    this.asentamientos = [];
    this.municipioNombre = '';
    this.estadoNombre = '';
  }


  inicializarInmueble() {
  return {
    titulo: '',
    precio: 0,
    nispc: '',
    claveCatastral: '',
    id_tipo_inmueble: 0,
    manzana: '',
    lote: '',
    fraccion: '',
    terrenoM2: 0,
    // Nuevos campos planos:
    calle: '',
    codigoPostal: '',
    idAsentamiento: undefined
  };
}

 // 4. Unificamos la inicialización en un solo lugar
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
      idTipoInmueble: 1,
      // Campos de dirección planos
      calle: '',
      codigoPostal: '',
      idAsentamiento: undefined,
      // Campos de detalle
      banos: 0,
      recamaras: 0,
      estacionamientos: 0,
      niveles: 1,
      construccionM2: 0,
      caracteristicas: ''
    };
  }

  

  tipos: any[] = [];
  estados: any[] = [];

  // ✅ inyectamos HttpClient aquí
  constructor(
 private inmuebleService: InmuebleService,
    private usuarioService: UsuarioService, 
    private http: HttpClient
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

 

editarInmueble(i: any) {
    this.mostrarFormulario = true;
    this.modoEdicion = true;
    this.inmuebleActual = { ...i };
    if (this.inmuebleActual.codigoPostal) {
      this.buscarDireccion();
    }
  }

  
}
