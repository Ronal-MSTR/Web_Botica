import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardService } from '../../services/dashboard.service';
import { NgChartsModule } from 'ng2-charts'; 
import { ChartConfiguration, ChartOptions, Chart, registerables } from 'chart.js';
import { VozService } from '../../services/voz.service'; 

Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, NgChartsModule], 
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  nombreCajero: string = '';
  
  // Variables para las tarjetas KPIs
  ingresosHoy: number = 0;
  stockTotal: number = 0;
  ticketsHoy: number = 0;
  usuariosActivos: number = 0;

  // 1. Configuración Inicial del Gráfico de Líneas
  public lineChartData: ChartConfiguration<'line'>['data'] = {
    labels: [], 
    datasets: [
      { 
        data: [], 
        label: 'Ingresos por Día (S/)',
        borderColor: '#4e18d1',
        backgroundColor: 'rgba(78, 24, 209, 0.1)',
        pointBackgroundColor: '#20c997',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: '#20c997',
        fill: true, 
        tension: 0.4,
        borderWidth: 3
      }
    ]
  };

  public lineChartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      x: { grid: { display: false } },
      y: { beginAtZero: true, grid: { color: '#f0f0f0' }, border: { display: false } }
    }
  };

  // 2. Configuración Inicial del Gráfico de Pastel (Ventas por Categoría)
  public pieChartData: ChartConfiguration<'pie'>['data'] = { labels: [], datasets: [] };
  public pieChartOptions: ChartOptions<'pie'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { position: 'right' } }
  };

  // 3. Configuración Inicial del Gráfico de Barras (Top 5 Productos)
  public barChartData: ChartConfiguration<'bar'>['data'] = { labels: [], datasets: [] };
  public barChartOptions: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      x: { grid: { display: false } },
      y: { beginAtZero: true, grid: { color: '#f0f0f0' }, border: { display: false } }
    }
  };

  constructor(private dashboardService: DashboardService,private vozService: VozService) {}

  ngOnInit(): void {
    this.nombreCajero = localStorage.getItem('usuario_nombre') || 'Administrador';
    this.cargarDatosDashboard();
  }

  cargarDatosDashboard() {
    this.dashboardService.obtenerResumen().subscribe({
      next: (data) => {
        // Actualizamos los KPI
        
        this.ingresosHoy = data.ingresosHoy;
        this.stockTotal = data.stockTotal;
        this.ticketsHoy = data.ticketsHoy;
        this.usuariosActivos = data.usuariosActivos;

        // Procesar datos reales para la línea
        if (data.ventasUltimaSemana) {
          this.procesarDatosGrafico(data.ventasUltimaSemana);
        }

        // Procesar datos reales para el pastel
        if (data.ventasPorCategoria) {
          this.procesarDatosPastel(data.ventasPorCategoria);
        }

        // Procesar datos reales para las barras
        if (data.topProductos) {
          this.procesarDatosBarras(data.topProductos);
        }
        this.vozService.hablar('Bienvenido al sistema. Datos del panel actualizados.');
      },
      error: (err) => {
        console.error('Error al cargar datos del dashboard:', err);
      }
    });
  }

  // 4. Método para el botón de "Escuchar Resumen"
  escucharResumen(): void {
    // Verificamos que al menos tengamos datos de ingresos o stock antes de hablar
    if (this.ingresosHoy !== undefined) { 
      // Usamos las variables de la clase directamente en lugar de "this.resumen"
      const texto = `
        Resumen del día de hoy. 
        Los ingresos totales son de ${this.ingresosHoy} soles. 
        Se han emitido ${this.ticketsHoy} tickets.
        El stock total actual es de ${this.stockTotal} unidades.
      `;
      
      this.vozService.hablar(texto);
    }
  }

  // --- Procesadores de Datos Reales ---

  procesarDatosGrafico(ventasBackend: any) {
    const diasAMostrar = 7;
    const etiquetasFechas: string[] = [];
    const datosVentas: number[] = [];

    for (let i = diasAMostrar - 1; i >= 0; i--) {
      const fecha = new Date();
      fecha.setDate(fecha.getDate() - i);
      const fechaString = fecha.toISOString().split('T')[0]; 
      etiquetasFechas.push(fechaString);
      
      const totalVenta = ventasBackend[fechaString] || 0;
      datosVentas.push(totalVenta);
    }

    this.lineChartData = {
      labels: etiquetasFechas,
      datasets: [{
        data: datosVentas,
        label: 'Ingresos por Día (S/)',
        borderColor: '#4e18d1',
        backgroundColor: 'rgba(78, 24, 209, 0.1)',
        pointBackgroundColor: '#20c997',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: '#20c997',
        fill: true, tension: 0.4, borderWidth: 3
      }]
    };
  }

  procesarDatosPastel(categoriasBackend: any) {
    // Se espera que Spring Boot envíe un Map<String, Number>
    // Ejemplo: { "Analgésicos": 150, "Vitaminas": 80 }
    this.pieChartData = {
      labels: Object.keys(categoriasBackend),
      datasets: [{
        data: Object.values(categoriasBackend),
        backgroundColor: ['#4e18d1', '#20c997', '#ffc107', '#fd7e14', '#6c757d', '#0dcaf0'],
        borderWidth: 2,
        borderColor: '#ffffff'
      }]
    };
  }

  procesarDatosBarras(productosBackend: any[]) {
    // Se espera que Spring Boot envíe un List de objetos
    // Ejemplo: [{ producto: "Paracetamol", cantidad: 120 }, ...]
    // Nota: Si en tu backend la variable se llama "nombre" en lugar de "producto", cámbialo en p.producto a p.nombre
    this.barChartData = {
      labels: productosBackend.map(p => p.producto),
      datasets: [{
        data: productosBackend.map(p => p.cantidad),
        label: 'Unidades Vendidas',
        backgroundColor: '#20c997',
        borderRadius: 6,
        barPercentage: 0.6
      }]
    };
  }
}