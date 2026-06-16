import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';


@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],

})
export class SidebarComponent {

  constructor(private router: Router) {}

  cerrarSesion() {
    localStorage.clear(); // Borramos el token y los datos de seguridad
    this.router.navigate(['/login']); // Lo pateamos al login
  }

}

