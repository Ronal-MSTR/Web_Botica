import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-proveedor-lista',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './proveedor-lista.component.html'
})
export class ProveedorListaComponent implements OnInit {
  proveedores: any[] = []; // Directorio de proveedores

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.obtenerProveedores();
  }

  obtenerProveedores() {
    this.http.get<any[]>('https://web-botica.onrender.com/api/proveedores/listar')
      .subscribe({
        next: (data) => this.proveedores = data,
        error: (err) => console.error('Error al listar proveedores:', err)
      });
  }

  // Método para dar de baja (desactivar)
  darDeBaja(id: number) {
    if (confirm('¿Estás seguro de que deseas dar de baja a este proveedor?')) {
      this.http.patch(`https://web-botica.onrender.com/api/proveedores/desactivar/${id}`, {})
        .subscribe(() => {
          alert('Proveedor desactivado correctamente');
          this.obtenerProveedores(); // Refrescamos la tabla
        });
    }
  }

  // Método para reactivar
  activar(id: number) {
    if (confirm('¿Deseas reactivar este proveedor para futuras compras?')) {
      this.http.patch(`https://web-botica.onrender.com/api/proveedores/activar/${id}`, {})
        .subscribe(() => {
          alert('Proveedor reactivado con éxito');
          this.obtenerProveedores(); // Refrescamos la tabla
        });
    }
  }
}
