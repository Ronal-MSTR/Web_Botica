export interface Categoria {
  categoria_id?: number;
  nombre: string;
  descripcion: string;
}

export interface Producto {
  producto_id?: number;
  nombreComercial: string;
  imagenPath?: string;
  imagenUrl?: string;
  nombreGenerico: string;
  presentacion: string;
  precioVentaUnitario: number;
  stockMinimo: number;
  categoria?: Categoria;
}

export interface Proveedor {
  proveedor_id?: number;
  ruc: string;
  razonSocial: string;
  telefono?: string;
  email?: string;
  direccion?: string;
  activo: boolean;
}

export interface Lote {
  lote_id?: number;
  codigoLote: string;
  fechaIngreso: string;
  fechaVencimiento: string;
  cantidadActual: number;
  producto?: Producto;
  detalleCompra?: any;
}

export interface Usuario {
  usuario_id?: number;
  nombre_completo: string;
  email: string;
  password_hash?: string;
  activo: boolean;
  rol?: Rol;
  createdAt?: string;
}

export interface Rol {
  rol_id?: number;
  nombre: string;
  descripcion: string;
}

export interface Compra {
  compra_id?: number;
  nroFactura: string;
  fechaCompra: string;
  montoTotal: number;
  estadoCompra: string;
  proveedor?: Proveedor;
  usuario?: Usuario;
  detalles?: DetalleCompra[];
}

export interface DetalleCompra {
  detalle_compra_id?: number;
  producto?: Producto;
  cantidadComprada: number;
  precioCompraUnitario: number;
  subtotal: number;
}

export interface Venta {
  venta_id?: number;
  fechaVenta: string;
  nroComprobante: string;
  metodoPago: string;
  total: number;
  usuario?: Usuario;
  detalles?: DetalleVenta[];
}

export interface DetalleVenta {
  detalle_id?: number;
  venta_id?: number;
  lote?: Lote;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
}

export interface MovimientoCaja {
  movimiento_id?: number;
  tipoMovimiento?: TipoMovimiento;
  monto: number;
  descripcion: string;
  fechaMovimiento: string;
  usuario?: Usuario;
  referenciaId?: number;
  referenciaTipo?: string;
}

export interface TipoMovimiento {
  tipo_mov_id?: number;
  nombre: string;
}

export interface DevolucionCliente {
  dev_cliente_id?: number;
  venta?: Venta;
  lote?: Lote;
  usuario?: Usuario;
  cantidad: number;
  motivo: string;
  estado: string;
  fechaDevolucion: string;
}