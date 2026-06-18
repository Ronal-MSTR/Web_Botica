import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-proveedor-registro',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './proveedor-registro.component.html'
})
export class ProveedorRegistroComponent implements OnInit {
  
  // Objeto limpio para un proveedor nuevo
  proveedor: any = {
    ruc: '',
    razonSocial: '',
    telefono: '',
    email: '',
    direccion: ''
  };

  esEdicion: boolean = false;
  proveedorId!: number;

  constructor(
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Revisamos si en la URL viene un ID para saber si es edición
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.esEdicion = true;
      this.proveedorId = +idParam;
      this.cargarProveedor(this.proveedorId);
    }
  }

  // Si estamos editando, buscamos los datos para llenar el formulario
  cargarProveedor(id: number) {
    this.http.get<any[]>('https://web-botica.onrender.com/api/proveedores/listar').subscribe(proveedores => {
      const provFound = proveedores.find(p => p.proveedor_id === id);
      if (provFound) {
        this.proveedor = provFound;
      }
    });
  }

  // Método unificado para Guardar (Crea o Actualiza según corresponda)
  guardarProveedor() {
    if (this.esEdicion) {
      this.http.put(`https://web-botica.onrender.com/api/proveedores/actualizar/${this.proveedorId}`, this.proveedor)
        .subscribe({
          next: () => {
            alert('¡Proveedor actualizado con éxito!');
            this.router.navigate(['/proveedores']);
          },
          error: (err) => console.error('Error al actualizar', err)
        });
    } else {
      this.http.post('https://web-botica.onrender.com/api/proveedores/registro', this.proveedor)
        .subscribe({
          next: () => {
            alert('¡Proveedor registrado con éxito!');
            this.router.navigate(['/proveedores']);
          },
          error: (err) => console.error('Error al registrar', err)
        });
    }
  }
}
