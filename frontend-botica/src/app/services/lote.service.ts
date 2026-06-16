import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Lote } from '../models/models';

@Injectable({
  providedIn: 'root'
})
export class LoteService {
  private apiUrl = 'http://localhost:8080/api/lotes';

  constructor(private http: HttpClient) { }

  listar(): Observable<Lote[]> {
    return this.http.get<Lote[]>(`${this.apiUrl}/listar`);
  }

  buscarPorProducto(productoId: number): Observable<Lote[]> {
    return this.http.get<Lote[]>(`${this.apiUrl}/producto/${productoId}`);
  }
}