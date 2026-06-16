import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Compra } from '../models/models';

@Injectable({
  providedIn: 'root'
})
export class CompraService {
  private apiUrl = 'http://localhost:8080/api/compras';

  constructor(private http: HttpClient) { }

  listar(): Observable<Compra[]> {
    return this.http.get<Compra[]>(`${this.apiUrl}/listar`);
  }

  registrar(compra: any): Observable<Compra> {
    return this.http.post<Compra>(`${this.apiUrl}/registrar`, compra);
  }
}