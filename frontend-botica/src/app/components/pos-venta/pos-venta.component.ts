import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
// 1. IMPORTAMOS EL SERVICIO DE VOZ (Ajusta la ruta según tu estructura de carpetas)
import { VozService } from '../../services/voz.service'; 

@Component({
  selector: 'app-pos-venta',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './pos-venta.component.html',
  styles: [`
    .product-card { transition: transform 0.2s; }
    .product-card:hover { transform: translateY(-5px); box-shadow: 0 10px 20px rgba(0,0,0,0.1); }
    .img-catalogo { height: 180px; object-fit: contain; padding: 10px; }
  `]
})
export class PosVentaComponent implements OnInit {
  lotesDisponibles: any[] = [];
  categoriasUnicas: string[] = [];
  ticketActual: any = null;
  nombreCajero: string = '';
  // Filtros
  categoriaSeleccionada: string = 'TODAS';
  terminoBusqueda: string = '';

  carrito: any[] = [];
  venta = {
    nroComprobante: 'B001-' + Math.floor(Math.random() * 1000000).toString().padStart(6, '0'),
    metodoPago: 'Efectivo',
    total: 0
  };

  // 2. INYECTAMOS EL SERVICIO EN EL CONSTRUCTOR
  constructor(
    private http: HttpClient,
    private vozService: VozService 
  ) {}

  ngOnInit(): void {
    this.cargarLotes();
    this.nombreCajero = localStorage.getItem('usuario_nombre') || 'Cajero Desconocido';
  }

  cargarLotes() {
    this.http.get<any[]>('https://web-botica.onrender.com/api/lotes/listar').subscribe(data => {
      this.lotesDisponibles = data.filter(lote => lote.cantidadActual > 0);
      
      // Extraer categorías sin repetir para el menú lateral
      const cats = this.lotesDisponibles.map(l => l.categoriaNombre).filter(Boolean);
      this.categoriasUnicas = [...new Set(cats)];
    });
  }

  // Getter dinámico que filtra en tiempo real lo que se ve en pantalla
  get lotesFiltrados() {
    return this.lotesDisponibles.filter(lote => {
      const matchCat = this.categoriaSeleccionada === 'TODAS' || lote.categoriaNombre === this.categoriaSeleccionada;
      const matchNom = lote.nombreProducto.toLowerCase().includes(this.terminoBusqueda.toLowerCase());
      return matchCat && matchNom;
    });
  }

  agregarAlCarrito(lote: any) {
    const itemExistente = this.carrito.find(item => item.loteId === lote.lote_id);

    if (itemExistente) {
      if ((itemExistente.cantidad + 1) > lote.cantidadActual) {
        // 3. OPCIONAL: HACEMOS QUE EL SISTEMA AVISE EN VOZ ALTA SI FALTA STOCK
        const mensajeAlerta = `Stock físico insuficiente. Solo hay ${lote.cantidadActual} cajas.`;
        this.vozService.hablar(mensajeAlerta);
        alert(mensajeAlerta);
        return;
      }
      itemExistente.cantidad++;
      itemExistente.subtotal = itemExistente.cantidad * itemExistente.precioUnitario;
    } else {
      this.carrito.push({
        loteId: lote.lote_id,
        nombreProducto: lote.nombreProducto,
        codigoLote: lote.codigoLote,
        cantidad: 1, // Por defecto agrega 1 al hacer clic
        precioUnitario: lote.precioVenta,
        subtotal: lote.precioVenta,
        imagen: lote.imagenUrl
      });
    }
    this.calcularTotal();
  }

  aumentarCantidad(index: number) {
    const item = this.carrito[index];
    const loteOriginal = this.lotesDisponibles.find(l => l.lote_id === item.loteId);
    if (item.cantidad < loteOriginal.cantidadActual) {
      item.cantidad++;
      item.subtotal = item.cantidad * item.precioUnitario;
      this.calcularTotal();
    }
  }

  disminuirCantidad(index: number) {
    const item = this.carrito[index];
    if (item.cantidad > 1) {
      item.cantidad--;
      item.subtotal = item.cantidad * item.precioUnitario;
      this.calcularTotal();
    }
  }

  quitarItem(index: number) {
    this.carrito.splice(index, 1);
    this.calcularTotal();
  }

  calcularTotal() {
    this.venta.total = this.carrito.reduce((acc, item) => acc + item.subtotal, 0);
  }

  registrarVenta() {
    if (this.carrito.length === 0) {
      this.vozService.hablar('El carrito está vacío.');
      return alert('El carrito está vacío.');
    }
    
    const idUsuarioLogueado = Number(localStorage.getItem('usuario_id'));
    const payload = {
      usuarioId: idUsuarioLogueado,
      nroComprobante: this.venta.nroComprobante,
      metodoPago: this.venta.metodoPago,
      total: this.venta.total,
      detalles: this.carrito.map(item => ({
        loteId: item.loteId,
        cantidad: item.cantidad,
        precioUnitario: item.precioUnitario
      }))
    };

    this.http.post('https://web-botica.onrender.com/api/ventas/registrar', payload).subscribe({
      next: () => {
        // 1. CAPTURAMOS LOS DATOS PARA EL TICKET (Antes de borrar el carrito)
        this.ticketActual = {
          empresa: 'BOTICA EL BUEN SALUD', // Nombre ficticio de tu botica
          ruc: '20123456789',
          nroComprobante: this.venta.nroComprobante,
          fecha: new Date(),
          metodoPago: this.venta.metodoPago,
          total: this.venta.total,
          items: [...this.carrito], // Hacemos una copia exacta del carrito
          cajero: this.nombreCajero
        };

        // 4. LECTURA EN VOZ ALTA DEL ÉXITO DE LA VENTA Y EL TOTAL A COBRAR
        const mensajeVoz = `Venta registrada con éxito. El total a cobrar es de ${this.venta.total} soles.`;
        this.vozService.hablar(mensajeVoz);

        // 2. Limpiamos la pantalla de la caja para el siguiente cliente en la fila
        this.carrito = [];
        this.calcularTotal();
        this.venta.nroComprobante = 'B001-' + Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
        this.cargarLotes(); // Refrescamos el stock
      },
      error: (err) => {
        this.vozService.hablar('Error al registrar la venta.');
        alert('Error al registrar venta.');
      }
    });
  }

  // --- NUEVAS FUNCIONES PARA EL TICKET ---
  imprimirTicket() {
    window.print(); // Comando nativo del navegador web para invocar la impresora
  }

  cerrarTicket() {
    this.ticketActual = null; // Cierra el modal y deja la caja lista
  }
}