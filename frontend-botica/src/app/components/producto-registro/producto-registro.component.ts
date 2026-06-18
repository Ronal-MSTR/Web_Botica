import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute, RouterModule } from '@angular/router'; 

@Component({
  selector: 'app-producto-registro',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './producto-registro.component.html'
})
export class ProductoRegistroComponent implements OnInit {
  
  producto: any = {
    nombreComercial: '',
    nombreGenerico: '',
    presentacion: '',
    precioVentaUnitario: null,
    stockMinimo: null,
    imagenUrl: '',
    categoria: { categoria_id: null }
  };

  categorias: any[] = [];
  esEdicion: boolean = false; // <--- Bandera para saber qué estamos haciendo
  productoId!: number;

  constructor(
    private http: HttpClient, 
    private router: Router,
    private route: ActivatedRoute // <--- Inyectado para leer la URL
  ) {}

  ngOnInit(): void {
    this.cargarCategorias();
    
    // Revisar si la URL trae un ID (modo edición)
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.esEdicion = true;
      this.productoId = +idParam;
      this.cargarProducto(this.productoId);
    }
  }

  cargarCategorias() {
    this.http.get<any[]>('https://web-botica.onrender.com/api/categorias/listar')
      .subscribe(data => this.categorias = data);
  }

  cargarProducto(id: number) {
    this.http.get<any[]>('https://web-botica.onrender.com/api/productos/listar').subscribe(productos => {
      const prodFound = productos.find(p => p.producto_id === id);
      if (prodFound) {
        this.producto = prodFound; // Rellena el formulario con los datos
      }
    });
  }

  registrarProducto() {
    if (this.esEdicion) {
      // Método PUT para actualizar
      this.http.put(`https://web-botica.onrender.com/api/productos/actualizar/${this.productoId}`, this.producto)
        .subscribe({
          next: () => {
            alert('¡Medicamento actualizado con éxito!');
            this.router.navigate(['/productos']);
          },
          error: (err) => console.error(err)
        });
    } else {
      // Método POST para registrar nuevo (se queda igual)
      this.http.post('https://web-botica.onrender.com/api/productos/registro', this.producto)
        .subscribe({
          next: () => {
            alert('¡Medicamento registrado con éxito!');
            this.router.navigate(['/productos']);
          },
          error: (err) => console.error(err)
        });
    }
  }
}
