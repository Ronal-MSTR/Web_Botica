import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Venta } from '../models/models';

@Injectable({
  providedIn: 'root'
})
export class VentaService {
  private apiUrl = 'http://localhost:8080/api/ventas';

  constructor(private http: HttpClient) { }

  listar(): Observable<Venta[]> {
    return this.http.get<Venta[]>(`${this.apiUrl}/listar`);
  }

  registrar(venta: any): Observable<Venta> {
    return this.http.post<Venta>(`${this.apiUrl}/registrar`, venta);
  }

  buscarPorComprobante(nroComprobante: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/buscar/${nroComprobante}`);
  }
}