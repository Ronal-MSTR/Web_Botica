import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-producto-lista',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './producto-lista.component.html'
  // Si usas styleUrl, déjalo como estaba por defecto
})
export class ProductoListaComponent implements OnInit {
  productos: any[] = []; // Aquí guardaremos los medicamentos que traiga Java

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.obtenerProductos(); // Ejecuta la búsqueda apenas cargue la pantalla
  }

  obtenerProductos() {
    this.http.get<any[]>('https://web-botica.onrender.com/api/productos/listar')
      .subscribe({
        next: (data) => {
          this.productos = data;
        },
        error: (err) => {
          console.error('Error al traer los productos:', err);
        }
      });
  }

  eliminar(id: number) {
    if (confirm('¿Estás seguro de que deseas eliminar este medicamento del catálogo?')) {
      this.http.delete(`https://web-botica.onrender.com/api/productos/eliminar/${id}`)
        .subscribe({
          next: () => {
            alert('Producto eliminado correctamente.');
            this.obtenerProductos(); // Refresca la tabla automáticamente
          },
          error: (err) => {
            console.error('Error al eliminar:', err);
            alert('No se pudo eliminar. Verifica si el producto está siendo usado en otras tablas.');
          }
        });
    }
  }
}
