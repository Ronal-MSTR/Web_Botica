import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-caja',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './caja.component.html'
})
export class CajaComponent implements OnInit {
  // Variables para la vista
  resumen = { ingresos: 0, egresos: 0, saldoCaja: 0 };
  movimientos: any[] = [];

  // Objeto para el formulario de movimientos manuales
  nuevoMovimiento = {
    tipoMovId: 1, // Por defecto: 1 (APERTURA)
    monto: null,
    descripcion: '',
    // Lo dejamos en 0 porque se llenará automáticamente al hacer clic en guardar
    usuarioId: 0
  };

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.cargarDatosCaja();
  }

  cargarDatosCaja() {
    // 1. Traer los totales calculados
    this.http.get<any>('https://web-botica.onrender.com/api/caja/resumen').subscribe(data => {
      this.resumen = data;
    });

    // 2. Traer el historial de la tabla (Ventas, Gastos, etc.)
    this.http.get<any[]>('https://web-botica.onrender.com/api/caja/movimientos').subscribe(data => {
      // Ordenamos para que los más recientes salgan arriba
      this.movimientos = data.sort((a, b) => 
        new Date(b.fechaMovimiento).getTime() - new Date(a.fechaMovimiento).getTime()
      );
    });
  }

  registrarMovimiento() {
    if (!this.nuevoMovimiento.monto || this.nuevoMovimiento.monto <= 0) {
      alert('Por favor, ingrese un monto válido.');
      return;
    }
    if (!this.nuevoMovimiento.descripcion.trim()) {
      alert('La descripción es obligatoria.');
      return;
    }

    // --- ¡ESTA ES LA LÍNEA NUEVA! ---
    // Atrapamos el ID del usuario de la memoria y lo reemplazamos
    this.nuevoMovimiento.usuarioId = Number(localStorage.getItem('usuario_id'));
    // --------------------------------

    this.http.post('https://web-botica.onrender.com/api/caja/registrar', this.nuevoMovimiento).subscribe({
      next: () => {
        alert('Movimiento registrado con éxito en el libro contable.');
        this.cargarDatosCaja(); // Refrescar los números y la tabla
        
        // Limpiar el formulario
        this.nuevoMovimiento.monto = null;
        this.nuevoMovimiento.descripcion = '';
        this.nuevoMovimiento.tipoMovId = 1;
      },
      error: (err) => {
        alert('Error al registrar el movimiento.');
        console.error(err);
      }
    });
  }
}
