import { Component } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

import { SidebarComponent } from './components/sidebar/sidebar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule,SidebarComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'frontend-botica';

  constructor(private router: Router) {}

  // Esta función verifica si estamos en la pantalla de login para ocultar el Navbar
  esPantallaLogin(): boolean {
    return this.router.url === '/login' || this.router.url === '/';
  }

  // Función para obtener el nombre del usuario logueado
  obtenerNombreUsuario(): string | null {
    return localStorage.getItem('usuario_nombre');
  }

  // La acción de salir del sistema
  cerrarSesion() {
    localStorage.clear(); // Borramos el token y los datos de seguridad
    this.router.navigate(['/login']); // Lo pateamos al login
  }
}
