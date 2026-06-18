import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-usuario-lista',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './usuario-lista.component.html'
})
export class UsuarioListaComponent implements OnInit {
  usuarios: any[] = []; // Aquí guardaremos la lista que venga de Java

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.obtenerUsuarios(); // Apenas cargue la página, busca los usuarios
  }

  obtenerUsuarios() {
    this.http.get<any[]>('https://web-botica.onrender.com/api/usuarios/listar')
      .subscribe(data => {
        this.usuarios = data;
      });
  }

  darDeBaja(id: number) {
  if (confirm('¿Estás seguro de que deseas dar de baja a este empleado?')) {
    this.http.patch(`https://web-botica.onrender.com/api/usuarios/desactivar/${id}`, {})
      .subscribe(() => {
        alert('Empleado desactivado con éxito');
        this.obtenerUsuarios(); // Volvemos a cargar la lista para ver el cambio en vivo
      });
  }
}

// Método para volver a activar a un empleado
  activar(id: number) {
  if (confirm('¿Estás seguro de que deseas reactivar a este empleado?')) {
    this.http.patch(`https://web-botica.onrender.com/api/usuarios/activar/${id}`, {})
      .subscribe(() => {
        alert('Empleado reactivado con éxito');
        this.obtenerUsuarios(); // Refrescamos la tabla para ver el cambio en vivo
      });
  }
}
}
