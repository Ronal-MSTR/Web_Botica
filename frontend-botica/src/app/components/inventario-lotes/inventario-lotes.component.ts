import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-inventario-lotes',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './inventario-lotes.component.html'
})
export class InventarioLotesComponent implements OnInit {
  lotes: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.obtenerLotes();
  }

  obtenerLotes() {
    this.http.get<any[]>('https://web-botica.onrender.com/api/lotes/listar')
      .subscribe({
        next: (data) => {
          // Procesamos los datos antes de guardarlos para calcular sus días restantes
          this.lotes = data.map(lote => {
            const dias = this.calcularDiasRestantes(lote.fechaVencimiento);
            return {
              ...lote, // Mantiene todos los datos originales
              diasRestantes: dias,
              estadoSemaforo: this.determinarColor(dias)
            };
          });

          // Ordenamos la tabla automáticamente: Los que están por vencer salen arriba
          this.lotes.sort((a, b) => a.diasRestantes - b.diasRestantes);
        },
        error: (err) => console.error('Error al listar lotes:', err)
      });
  }

  // Lógica matemática para restar fechas
  calcularDiasRestantes(fechaVencimiento: string): number {
    const fechaVenc = new Date(fechaVencimiento);
    const hoy = new Date();
    // Restamos en milisegundos y convertimos a días exactos
    const diferencia = fechaVenc.getTime() - hoy.getTime();
    return Math.ceil(diferencia / (1000 * 3600 * 24));
  }

  // Asignación de colores de Bootstrap
  determinarColor(dias: number): string {
    if (dias <= 90) return 'danger';    // Alerta Roja (Menos de 3 meses o vencido)
    if (dias <= 180) return 'warning';  // Alerta Amarilla (De 3 a 6 meses)
    return 'success';                   // Todo bien (Más de 6 meses)
  }
}
