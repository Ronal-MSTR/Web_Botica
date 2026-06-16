import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Proveedor } from '../models/models';

@Injectable({
  providedIn: 'root'
})
export class ProveedorService {
  private apiUrl = 'http://localhost:8080/api/proveedores';

  constructor(private http: HttpClient) { }

  listar(): Observable<Proveedor[]> {
    return this.http.get<Proveedor[]>(`${this.apiUrl}/listar`);
  }

  registrar(proveedor: Proveedor): Observable<Proveedor> {
    return this.http.post<Proveedor>(`${this.apiUrl}/registro`, proveedor);
  }

  actualizar(id: number, proveedor: Proveedor): Observable<Proveedor> {
    return this.http.put<Proveedor>(`${this.apiUrl}/actualizar/${id}`, proveedor);
  }

  desactivar(id: number): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/desactivar/${id}`, {});
  }

  activar(id: number): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/activar/${id}`, {});
  }
}