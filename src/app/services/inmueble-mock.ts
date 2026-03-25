import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, map, throwError } from "rxjs";
import { Inmueble } from "./inmueble";

@Injectable({ providedIn: "root" })
export class InmuebleMockService {
  constructor(private http: HttpClient) {}

  getPropiedades(): Observable<any[]> {
    return this.http.get<any[]>("assets/mock/propiedades.json");
  }

  obtenerInmueble(id: number): Observable<Inmueble> {
    return this.getPropiedades().pipe(
      map((lista) => {
        const inmueble = lista.find((p) => p.id === id);
        if (!inmueble) {
          throw new Error(`No existe inmueble con id ${id}`);
        }
        return inmueble;
      }),
    );
  }

  enviarContacto(inmuebleId: number, data: any) {
    return this.http.post(
      `https://inmoapi-adagc9dgfjgnfuar.westus-01.azurewebsites.net/api/inmuebles/${inmuebleId}/contacto`,
      data,
    );
  }
}
