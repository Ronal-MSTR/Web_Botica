import { Routes } from '@angular/router';
import { UsuarioListaComponent } from './components/usuario-lista/usuario-lista.component';
import { RegistroComponent } from './components/registro/registro.component';
import { ProductoListaComponent } from './components/producto-lista/producto-lista.component'; 
import { ProductoRegistroComponent } from './components/producto-registro/producto-registro.component';
import { ProveedorListaComponent } from './components/proveedor-lista/proveedor-lista.component';
import { ProveedorRegistroComponent } from './components/proveedor-registro/proveedor-registro.component';
import { CompraRegistroComponent } from './components/compra-registro/compra-registro.component';
import { InventarioLotesComponent } from './components/inventario-lotes/inventario-lotes.component';
import { PosVentaComponent } from './components/pos-venta/pos-venta.component';
import { CajaComponent } from './components/caja/caja.component';
import { DevolucionesComponent } from './components/devoluciones/devoluciones.component';
import { DevolucionProveedorComponent } from './components/devolucion-proveedor/devolucion-proveedor.component';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { roleGuard } from './guards/role.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },

  // ==========================================
  // ZONA DE ADMINISTRADOR (Gerencia y Control)
  // ==========================================
  { path: 'dashboard', component: DashboardComponent, canActivate: [roleGuard], data: { rolesPermitidos: ['ADMIN'] } },
  { path: 'usuarios', component: UsuarioListaComponent, canActivate: [roleGuard], data: { rolesPermitidos: ['ADMIN'] } },
  { path: 'registro', component: RegistroComponent, canActivate: [roleGuard], data: { rolesPermitidos: ['ADMIN'] } },
  { path: 'editar/:id', component: RegistroComponent, canActivate: [roleGuard], data: { rolesPermitidos: ['ADMIN'] } },
  { path: 'productos', component: ProductoListaComponent, canActivate: [roleGuard], data: { rolesPermitidos: ['ADMIN'] } },
  { path: 'productos/nuevo', component: ProductoRegistroComponent, canActivate: [roleGuard], data: { rolesPermitidos: ['ADMIN'] } },
  { path: 'productos/editar/:id', component: ProductoRegistroComponent, canActivate: [roleGuard], data: { rolesPermitidos: ['ADMIN'] } },
  { path: 'proveedores', component: ProveedorListaComponent, canActivate: [roleGuard], data: { rolesPermitidos: ['ADMIN'] } },
  { path: 'proveedores/nuevo', component: ProveedorRegistroComponent, canActivate: [roleGuard], data: { rolesPermitidos: ['ADMIN'] } },
  { path: 'proveedores/editar/:id', component: ProveedorRegistroComponent, canActivate: [roleGuard], data: { rolesPermitidos: ['ADMIN'] } },
  { path: 'compras/nueva', component: CompraRegistroComponent, canActivate: [roleGuard], data: { rolesPermitidos: ['ADMIN'] } },
  { path: 'inventario', component: InventarioLotesComponent, canActivate: [roleGuard], data: { rolesPermitidos: ['ADMIN'] } },
  { path: 'salida-proveedor', component: DevolucionProveedorComponent, canActivate: [roleGuard], data: { rolesPermitidos: ['ADMIN'] } },

  // ==========================================
  // ZONA DE VENDEDOR (Operación Diaria)
  // ==========================================
// ¡CORREGIDO! El Arqueo ahora lo pueden ver tanto el ADMIN como el VENDEDOR
  { path: 'arqueo', component: CajaComponent, canActivate: [roleGuard], data: { rolesPermitidos: ['ADMIN', 'VENDEDOR'] } },
  // Zonas exclusivas o principales del vendedor
  { path: 'caja', component: PosVentaComponent, canActivate: [roleGuard], data: { rolesPermitidos: ['ADMIN', 'VENDEDOR'] } }, // (Opcional: puedes dejar que el Admin también venda si quieres)
  { path: 'devoluciones', component: DevolucionesComponent, canActivate: [roleGuard], data: { rolesPermitidos: ['ADMIN', 'VENDEDOR'] } },
  
  // Redirecciones por defecto y rutas inválidas
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' } 
];