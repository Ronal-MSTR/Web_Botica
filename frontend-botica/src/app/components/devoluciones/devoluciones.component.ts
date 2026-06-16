import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-devoluciones',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './devoluciones.component.html'
})
export class DevolucionesComponent {
  nroComprobante: string = '';
  ventaEncontrada: any = null;
  detallesVenta: any[] = [];
  mensajeError: string = '';

  detalleSeleccionado: any = null;
  cantidadDevolver: number = 1;
  motivoDevolucion: string = '';

  // NUEVO: Historial visual nativo
  historialDevoluciones: any[] = [];

  constructor(private http: HttpClient) {}

  buscarTicket() {
    this.mensajeError = '';
    this.ventaEncontrada = null;
    this.detallesVenta = [];
    this.detalleSeleccionado = null;

    if (!this.nroComprobante.trim()) return;

    this.http.get<any>(`http://localhost:8080/api/ventas/buscar/${this.nroComprobante.trim()}`).subscribe({
      next: (data) => {
        this.ventaEncontrada = data.venta;
        this.detallesVenta = data.detalles;
      },
      error: (err) => {
        this.mensajeError = 'No se encontró el comprobante o hubo un error de conexión.';
      }
    });
  }

  prepararDevolucion(detalle: any) {
    this.detalleSeleccionado = detalle;
    this.cantidadDevolver = 1;
    this.motivoDevolucion = '';
  }

  procesarDevolucion() {
    if (this.cantidadDevolver > this.detalleSeleccionado.cantidad || this.cantidadDevolver <= 0) {
      alert('Cantidad inválida. Verifica lo que compró el cliente.');
      return;
    }
    if (!this.motivoDevolucion.trim()) {
      alert('El motivo de la devolución es obligatorio por políticas de calidad.');
      return;
    }

    // Extraemos el ID de la memoria
    const idLogueado = Number(localStorage.getItem('usuario_id'));

    const payload = {
      ventaId: this.ventaEncontrada.venta_id || this.ventaEncontrada.ventaId,
      loteId: this.detalleSeleccionado.lote.lote_id || this.detalleSeleccionado.lote.loteId,
      usuarioId: idLogueado, 
      cantidad: this.cantidadDevolver,
      motivo: this.motivoDevolucion
    };

    this.http.post('http://localhost:8080/api/devoluciones/procesar', payload).subscribe({
      next: () => {
        // 1. Calcular dinero devuelto para el historial
        const precioUnitario = this.detalleSeleccionado.precioUnitario || this.detalleSeleccionado.precio_unitario;
        const totalReembolso = this.cantidadDevolver * precioUnitario;

        // 2. Guardar en el historial visual
        this.historialDevoluciones.unshift({
          ticket: this.ventaEncontrada.nroComprobante || this.ventaEncontrada.nro_comprobante,
          producto: this.detalleSeleccionado.lote.producto?.nombreGenerico || this.detalleSeleccionado.lote.producto?.nombre_generico,
          cantidad: this.cantidadDevolver,
          monto: totalReembolso,
          hora: new Date()
        });

        // 3. Limpieza total (Reset)
        this.ventaEncontrada = null;
        this.detallesVenta = [];
        this.detalleSeleccionado = null;
        this.nroComprobante = ''; // Vaciamos el buscador

        // 4. Notificación
        alert('¡ÉXITO! La devolución se procesó correctamente. El dinero se restó de la caja y el stock regresó al estante.');
      },
      error: (err) => {
        alert('Hubo un error al procesar la devolución.');
        console.error(err);
      }
    });
  }
}