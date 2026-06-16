import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DevolucionService {
  private apiUrl = 'http://localhost:8080/api/devoluciones';

  constructor(private http: HttpClient) { }

  procesar(devolucion: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/procesar`, devolucion);
  }
}