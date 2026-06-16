import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-compra-registro',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './compra-registro.component.html'
})
export class CompraRegistroComponent implements OnInit {
  proveedores: any[] = [];
  productos: any[] = [];

  // 1. El DTO Cabecera (Tal cual lo armamos en Java)
  compra = {
    proveedorId: null,
    usuarioId: 1, // HARDCODED temporalmente asumiendo que el ID 1 es el Admin. Luego lo tomaremos del Login.
    nroFactura: '',
    montoTotal: 0,
    detalles: [] as any[] // Aquí guardaremos la lista de medicamentos
  };

  // 2. Un formulario temporal para agregar 1 producto a la vez a la lista
  itemTemp = {
    productoId: null,
    cantidad: null,
    precioUnitario: null,
    fechaVencimiento: ''
  };

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.cargarProveedores();
    this.cargarProductos();
  }

  cargarProveedores() {
    this.http.get<any[]>('http://localhost:8080/api/proveedores/listar').subscribe(data => {
      // Filtramos para mostrar solo los proveedores que están activos
      this.proveedores = data.filter(p => p.activo === true);
    });
  }

  cargarProductos() {
    this.http.get<any[]>('http://localhost:8080/api/productos/listar').subscribe(data => {
      this.productos = data;
    });
  }

  // Método para agregar un medicamento a la lista temporal
  agregarItem() {
    if (!this.itemTemp.productoId || !this.itemTemp.cantidad || !this.itemTemp.precioUnitario || !this.itemTemp.fechaVencimiento) {
      alert('Por favor, complete todos los datos del medicamento, incluyendo la fecha de vencimiento.');
      return;
    }

    // Buscamos el nombre del producto solo para mostrarlo en la tabla visual
    const prodSeleccionado = this.productos.find(p => p.producto_id === this.itemTemp.productoId);
    const subtotalCalc = this.itemTemp.cantidad * this.itemTemp.precioUnitario;

    this.compra.detalles.push({
      productoId: this.itemTemp.productoId,
      nombreProducto: prodSeleccionado.nombreComercial, // Solo uso visual
      cantidad: this.itemTemp.cantidad,
      precioUnitario: this.itemTemp.precioUnitario,
      fechaVencimiento: this.itemTemp.fechaVencimiento,
      subtotal: subtotalCalc
    });

    this.calcularTotal();
    
    // Limpiamos los campos temporales para agregar el siguiente medicamento
    this.itemTemp = { productoId: null, cantidad: null, precioUnitario: null, fechaVencimiento: '' };
  }

  // Método para quitar un medicamento si nos equivocamos
  quitarItem(index: number) {
    this.compra.detalles.splice(index, 1);
    this.calcularTotal();
  }

  calcularTotal() {
    this.compra.montoTotal = this.compra.detalles.reduce((acc, item) => acc + item.subtotal, 0);
  }

  // Método final para enviar todo a Java
  registrarCompra() {
    if (!this.compra.proveedorId || !this.compra.nroFactura) {
      alert('Faltan los datos de la factura (Proveedor o Número).');
      return;
    }
    if (this.compra.detalles.length === 0) {
      alert('Debe agregar al menos un medicamento a la compra.');
      return;
    }

    // ¡NUEVA LÍNEA! Extraemos el ID
    const idAdminLogueado = Number(localStorage.getItem('usuario_id'));
    // Armamos el Payload (El DTO final estricto que Java espera, sin campos extra visuales)
    const payload = {
      proveedorId: this.compra.proveedorId,
      usuarioId: idAdminLogueado,
      nroFactura: this.compra.nroFactura,
      montoTotal: this.compra.montoTotal,
      detalles: this.compra.detalles.map(d => ({
        productoId: d.productoId,
        cantidad: d.cantidad,
        precioUnitario: d.precioUnitario,
        fechaVencimiento: d.fechaVencimiento
      }))
    };

    this.http.post('http://localhost:8080/api/compras/registrar', payload)
      .subscribe({
        next: () => {
          alert('¡Factura registrada! Los lotes físicos ya ingresaron al inventario.');
          this.router.navigate(['/productos']); // Redirigimos al catálogo para ver los productos
        },
        error: (err) => {
          console.error('Error al registrar compra:', err);
          alert('Error de conexión con el servidor.');
        }
      });
  }
}
