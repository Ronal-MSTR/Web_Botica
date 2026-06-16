import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MovimientoCaja } from '../models/models';

@Injectable({
  providedIn: 'root'
})
export class MovimientoCajaService {
  private apiUrl = 'http://localhost:8080/api/caja';

  constructor(private http: HttpClient) { }

  listar(): Observable<MovimientoCaja[]> {
    return this.http.get<MovimientoCaja[]>(`${this.apiUrl}/movimientos`);
  }

  obtenerResumen(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/resumen`);
  }

  registrar(movimiento: MovimientoCaja): Observable<MovimientoCaja> {
    return this.http.post<MovimientoCaja>(`${this.apiUrl}/registrar`, movimiento);
  }
}