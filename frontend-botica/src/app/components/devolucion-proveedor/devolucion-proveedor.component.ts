import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-devolucion-proveedor',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './devolucion-proveedor.component.html'
})
export class DevolucionProveedorComponent implements OnInit {
  nroFactura: string = '';
  compraEncontrada: any = null;
  detallesCompra: any[] = [];
  mensajeError: string = '';

  detalleSeleccionado: any = null;
  cantidadDevolver: number = 1;
  motivoDevolucion: string = '';
  nroGuiaSalida: string = '';

  // Variable nativa para guardar el historial visual
  historialDespachos: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit() {}

  buscarFactura() {
    this.mensajeError = '';
    this.compraEncontrada = null;
    this.detallesCompra = [];
    this.detalleSeleccionado = null;

    if (!this.nroFactura.trim()) return;

    const facturaLimpia = this.nroFactura.trim();

    this.http.get<any>(`http://localhost:8080/api/compras/buscar/${facturaLimpia}`).subscribe({
      next: (data) => {
        this.compraEncontrada = data.compra;
        this.detallesCompra = data.detalles;
      },
      error: (err) => {
        this.mensajeError = err.error && typeof err.error === 'string' ? err.error : 'No se encontró la factura.';
      }
    });
  }

  prepararDevolucion(detalle: any) {
    this.detalleSeleccionado = detalle;
    this.cantidadDevolver = 1;
    this.motivoDevolucion = '';
    this.nroGuiaSalida = '';
  }

  procesarDevolucion() {
    // Validaciones nativas
    if (this.cantidadDevolver > (this.detalleSeleccionado.cantidadComprada || this.detalleSeleccionado.cantidad_comprada) || this.cantidadDevolver <= 0) {
      alert('Cantidad inválida a devolver.');
      return;
    }
    if (!this.motivoDevolucion.trim() || !this.nroGuiaSalida.trim()) {
      alert('El motivo y la Guía de Salida son obligatorios.');
      return;
    }

    // Extraemos el ID de la memoria
    const idLogueado = Number(localStorage.getItem('usuario_id'));

    const payload = {
      compraId: this.compraEncontrada.compraId || this.compraEncontrada.compra_id,
      // ¡CORREGIDO! Ahora enviamos el ID del detalle, no el del producto
      detalleCompraId: this.detalleSeleccionado.detalleCompraId || this.detalleSeleccionado.detalle_compra_id, 
      proveedorId: this.compraEncontrada.proveedor?.proveedorId || this.compraEncontrada.proveedor?.proveedor_id,
      usuarioId: idLogueado, 
      cantidad: this.cantidadDevolver,
      motivo: this.motivoDevolucion,
      nroGuiaSalida: this.nroGuiaSalida
    };

    this.http.post('http://localhost:8080/api/devoluciones-proveedor/procesar', payload).subscribe({
      next: () => {
        // 1. Guardar en el historial visual
        this.historialDespachos.unshift({
          guia: this.nroGuiaSalida,
          proveedor: this.compraEncontrada.proveedor?.razonSocial || this.compraEncontrada.proveedor?.razon_social,
          producto: this.detalleSeleccionado.producto?.nombreGenerico || this.detalleSeleccionado.producto?.nombre_generico,
          cantidad: this.cantidadDevolver,
          hora: new Date()
        });

        // 2. Limpieza total (Reset del buscador y paneles)
        this.compraEncontrada = null;
        this.detallesCompra = [];
        this.detalleSeleccionado = null;
        this.nroFactura = ''; 

        // 3. Notificación nativa de Éxito
        alert('¡Despacho Exitoso! La mercadería ha sido descontada del sistema correctamente.');
      },
      error: (err) => {
        alert('Hubo un problema al procesar la salida.');
        console.error(err);
      }
    });
  }
}
